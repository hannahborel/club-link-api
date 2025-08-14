import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import { db } from '@/lib/db/client';
import { users } from '@/lib/db/schema';

// CORS headers for cross-origin requests
const corsHeaders = {
  'Access-Control-Allow-Origin': 'http://localhost:3001',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

// Handle preflight OPTIONS request
export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: corsHeaders,
  });
}

// Validation schemas
const createUserSchema = z.object({
  email: z.string().email(),
  role: z.enum(['admin', 'owner', 'member']),
  clerkId: z.string().min(1),
});

const updateUserSchema = z.object({
  email: z.string().email().optional(),
  role: z.enum(['admin', 'owner', 'member']).optional(),
});

// GET - Read all users
export async function GET() {
  try {
    const allUsers = await db.select().from(users);

    return NextResponse.json(
      {
        success: true,
        data: allUsers,
        count: allUsers.length,
      },
      { headers: corsHeaders },
    );
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch users' },
      { status: 500, headers: corsHeaders },
    );
  }
}

// POST - Create a new user
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = createUserSchema.parse(body);

    const newUser = await db.insert(users).values(validatedData).returning();

    return NextResponse.json(
      {
        success: true,
        data: newUser[0],
        message: 'User created successfully',
      },
      { status: 201, headers: corsHeaders },
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Validation error', details: error.issues },
        { status: 400, headers: corsHeaders },
      );
    }

    console.error('Error creating user:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create user' },
      { status: 500, headers: corsHeaders },
    );
  }
}

// PUT - Update a user by ID
export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400, headers: corsHeaders },
      );
    }

    const body = await request.json();
    const validatedData = updateUserSchema.parse(body);

    const updatedUser = await db
      .update(users)
      .set({
        ...validatedData,
        updatedAt: new Date(),
      })
      .where(eq(users.id, id))
      .returning();

    if (updatedUser.length === 0) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404, headers: corsHeaders },
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: updatedUser[0],
        message: 'User updated successfully',
      },
      { headers: corsHeaders },
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Validation error', details: error.issues },
        { status: 400, headers: corsHeaders },
      );
    }

    console.error('Error updating user:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update user' },
      { status: 500, headers: corsHeaders },
    );
  }
}

// DELETE - Delete a user by ID
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400, headers: corsHeaders },
      );
    }

    const deletedUser = await db.delete(users).where(eq(users.id, id)).returning();

    if (deletedUser.length === 0) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404, headers: corsHeaders },
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: deletedUser[0],
        message: 'User deleted successfully',
      },
      { headers: corsHeaders },
    );
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete user' },
      { status: 500, headers: corsHeaders },
    );
  }
}
