import * as dotenv from 'dotenv';
import { db } from '../src/lib/db/client';
import {
  users,
  gymOwners,
  gyms,
  members,
  visits,
  messages,
  accessCodes,
  subscriptions,
} from '../src/lib/db/schema';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

async function seedUsers() {
  console.log('🌱 Seeding users...');

  const testUsers = [
    {
      email: 'admin@clublink.com',
      role: 'admin' as const,
      clerkId: 'clerk_admin_001',
    },
    {
      email: 'owner1@clublink.com',
      role: 'owner' as const,
      clerkId: 'clerk_owner_001',
    },
    {
      email: 'owner2@clublink.com',
      role: 'owner' as const,
      clerkId: 'clerk_owner_002',
    },
    {
      email: 'member1@clublink.com',
      role: 'member' as const,
      clerkId: 'clerk_member_001',
    },
    {
      email: 'member2@clublink.com',
      role: 'member' as const,
      clerkId: 'clerk_member_002',
    },
    {
      email: 'member3@clublink.com',
      role: 'member' as const,
      clerkId: 'clerk_member_003',
    },
  ];

  const createdUsers = await db.insert(users).values(testUsers).returning();
  console.log(`✅ Created ${createdUsers.length} users`);

  return createdUsers;
}

async function seedGymOwners(users: any[]) {
  console.log('🏢 Seeding gym owners...');

  const ownerUsers = users.filter((user) => user.role === 'owner');
  const testOwners = [
    {
      userId: ownerUsers[0].id,
      businessName: 'Elite Fitness Center',
      contactPhone: '+1-555-0101',
    },
    {
      userId: ownerUsers[1].id,
      businessName: 'PowerHouse Gym',
      contactPhone: '+1-555-0102',
    },
  ];

  const createdOwners = await db.insert(gymOwners).values(testOwners).returning();
  console.log(`✅ Created ${createdOwners.length} gym owners`);

  return createdOwners;
}

async function seedGyms(owners: any[]) {
  console.log('🏋️ Seeding gyms...');

  const testGyms = [
    {
      ownerId: owners[0].id,
      name: 'Elite Fitness Center - Downtown',
      address: {
        street: '123 Main St',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'USA',
      },
      coordinates: { lat: 40.7589, lng: -73.9851 },
      amenities: [
        'Cardio Equipment',
        'Weight Training',
        'Group Classes',
        'Personal Training',
        'Locker Rooms',
      ],
      photos: ['https://example.com/gym1-1.jpg', 'https://example.com/gym1-2.jpg'],
      openingHours: {
        monday: { open: '06:00', close: '22:00' },
        tuesday: { open: '06:00', close: '22:00' },
        wednesday: { open: '06:00', close: '22:00' },
        thursday: { open: '06:00', close: '22:00' },
        friday: { open: '06:00', close: '22:00' },
        saturday: { open: '08:00', close: '20:00' },
        sunday: { open: '08:00', close: '20:00' },
      },
      status: 'active' as const,
      monthlyFee: '300.00',
    },
    {
      ownerId: owners[1].id,
      name: 'PowerHouse Gym - Midtown',
      address: {
        street: '456 Park Ave',
        city: 'New York',
        state: 'NY',
        zipCode: '10022',
        country: 'USA',
      },
      coordinates: { lat: 40.7614, lng: -73.9776 },
      amenities: ['Heavy Lifting', 'CrossFit', 'Boxing', 'Yoga Studio', 'Sauna'],
      photos: ['https://example.com/gym2-1.jpg', 'https://example.com/gym2-2.jpg'],
      openingHours: {
        monday: { open: '05:00', close: '23:00' },
        tuesday: { open: '05:00', close: '23:00' },
        wednesday: { open: '05:00', close: '23:00' },
        thursday: { open: '05:00', close: '23:00' },
        friday: { open: '05:00', close: '23:00' },
        saturday: { open: '06:00', close: '21:00' },
        sunday: { open: '07:00', close: '20:00' },
      },
      status: 'active' as const,
      monthlyFee: '350.00',
    },
  ];

  const createdGyms = await db.insert(gyms).values(testGyms).returning();
  console.log(`✅ Created ${createdGyms.length} gyms`);

  return createdGyms;
}

async function seedMembers(users: any[], gyms: any[]) {
  console.log('👥 Seeding members...');

  const memberUsers = users.filter((user) => user.role === 'member');
  const testMembers = [
    {
      userId: memberUsers[0].id,
      homeGymId: gyms[0].id,
      preferredName: 'Alex Johnson',
      age: 28,
      occupation: 'Software Engineer',
      location: 'New York, NY',
      athleteType: ['Fitness Enthusiast', 'Runner'],
      subscriptionType: 'base_passport' as const,
      subscriptionStatus: 'active' as const,
      profilePhoto: 'https://example.com/profile1.jpg',
      bio: 'Passionate about fitness and always looking for new challenges.',
      phone: '+1-555-0201',
      socialAccounts: {
        instagram: '@alexfitness',
        twitter: '@alexjohnson',
      },
      preferences: {
        workoutTime: 'evening',
        favoriteClasses: ['HIIT', 'Yoga'],
        equipment: ['treadmill', 'dumbbells'],
      },
    },
    {
      userId: memberUsers[1].id,
      homeGymId: gyms[1].id,
      preferredName: 'Sarah Chen',
      age: 32,
      occupation: 'Marketing Manager',
      location: 'New York, NY',
      athleteType: ['CrossFitter', 'Weight Lifter'],
      subscriptionType: 'unlimited_roamer' as const,
      subscriptionStatus: 'active' as const,
      profilePhoto: 'https://example.com/profile2.jpg',
      bio: 'CrossFit enthusiast who loves pushing limits and building strength.',
      phone: '+1-555-0202',
      socialAccounts: {
        instagram: '@sarahcrossfit',
        facebook: 'sarah.chen.fitness',
      },
      preferences: {
        workoutTime: 'morning',
        favoriteClasses: ['CrossFit', 'Strength Training'],
        equipment: ['barbell', 'kettlebell'],
      },
    },
    {
      userId: memberUsers[2].id,
      homeGymId: gyms[0].id,
      preferredName: 'Mike Rodriguez',
      age: 25,
      occupation: 'Personal Trainer',
      location: 'New York, NY',
      athleteType: ['Bodybuilder', 'Trainer'],
      subscriptionType: 'base_passport' as const,
      subscriptionStatus: 'active' as const,
      profilePhoto: 'https://example.com/profile3.jpg',
      bio: 'Certified personal trainer helping others achieve their fitness goals.',
      phone: '+1-555-0203',
      socialAccounts: {
        instagram: '@miketrainer',
        linkedin: 'mike-rodriguez-trainer',
      },
      preferences: {
        workoutTime: 'afternoon',
        favoriteClasses: ['Strength Training', 'Cardio'],
        equipment: ['machines', 'free weights'],
      },
    },
  ];

  const createdMembers = await db.insert(members).values(testMembers).returning();
  console.log(`✅ Created ${createdMembers.length} members`);

  return createdMembers;
}

async function seedVisits(members: any[], gyms: any[]) {
  console.log('🎫 Seeding visits...');

  const testVisits = [
    {
      memberId: members[0].id,
      gymId: gyms[0].id,
      visitDate: new Date('2024-01-15T10:00:00Z'),
      checkInTime: new Date('2024-01-15T10:05:00Z'),
      checkOutTime: new Date('2024-01-15T11:30:00Z'),
      status: 'completed' as const,
      qrCodeUsed: 'qr_visit_001',
    },
    {
      memberId: members[1].id,
      gymId: gyms[1].id,
      visitDate: new Date('2024-01-16T07:00:00Z'),
      checkInTime: new Date('2024-01-16T07:02:00Z'),
      checkOutTime: new Date('2024-01-16T08:15:00Z'),
      status: 'completed' as const,
      qrCodeUsed: 'qr_visit_002',
    },
    {
      memberId: members[2].id,
      gymId: gyms[0].id,
      visitDate: new Date('2024-01-17T14:00:00Z'),
      checkInTime: new Date('2024-01-17T14:10:00Z'),
      status: 'checked_in' as const,
      qrCodeUsed: 'qr_visit_003',
    },
  ];

  const createdVisits = await db.insert(visits).values(testVisits).returning();
  console.log(`✅ Created ${createdVisits.length} visits`);

  return createdVisits;
}

async function seedMessages(users: any[], gyms: any[]) {
  console.log('💬 Seeding messages...');

  const testMessages = [
    {
      senderId: users[0].id, // admin
      recipientId: users[1].id, // owner
      gymId: gyms[0].id,
      content: 'Welcome to Club Link! Your gym has been approved and is now live.',
      readAt: new Date('2024-01-10T09:00:00Z'),
    },
    {
      senderId: users[1].id, // owner
      recipientId: users[0].id, // admin
      gymId: gyms[0].id,
      content: "Thank you! We're excited to be part of the Club Link network.",
    },
    {
      senderId: users[3].id, // member
      recipientId: users[1].id, // owner
      gymId: gyms[0].id,
      content: 'Hi! I have a question about the new equipment you mentioned.',
    },
  ];

  const createdMessages = await db.insert(messages).values(testMessages).returning();
  console.log(`✅ Created ${createdMessages.length} messages`);

  return createdMessages;
}

async function seedAccessCodes(users: any[], gyms: any[]) {
  console.log('🔑 Seeding access codes...');

  const testAccessCodes = [
    {
      code: 'WELCOME2024',
      gymId: gyms[0].id,
      email: 'newmember@example.com',
      role: 'member' as const,
      expiresAt: new Date('2024-02-15T23:59:59Z'),
    },
    {
      code: 'ADMIN2024',
      gymId: null, // System-wide admin code
      email: 'newadmin@example.com',
      role: 'admin' as const,
      expiresAt: new Date('2024-02-15T23:59:59Z'),
    },
  ];

  const createdAccessCodes = await db.insert(accessCodes).values(testAccessCodes).returning();
  console.log(`✅ Created ${createdAccessCodes.length} access codes`);

  return createdAccessCodes;
}

async function seedSubscriptions(users: any[]) {
  console.log('💳 Seeding subscriptions...');

  const memberUsers = users.filter((user) => user.role === 'member');
  const testSubscriptions = [
    {
      userId: memberUsers[0].id,
      type: 'base_passport' as const,
      status: 'active' as const,
      currentPeriodStart: new Date('2024-01-01T00:00:00Z'),
      currentPeriodEnd: new Date('2024-01-31T23:59:59Z'),
      stripeSubscriptionId: 'sub_base_passport_001',
    },
    {
      userId: memberUsers[1].id,
      type: 'unlimited_roamer' as const,
      status: 'active' as const,
      currentPeriodStart: new Date('2024-01-01T00:00:00Z'),
      currentPeriodEnd: new Date('2024-01-31T23:59:59Z'),
      stripeSubscriptionId: 'sub_unlimited_roamer_001',
    },
    {
      userId: memberUsers[2].id,
      type: 'base_passport' as const,
      status: 'active' as const,
      currentPeriodStart: new Date('2024-01-01T00:00:00Z'),
      currentPeriodEnd: new Date('2024-01-31T23:59:59Z'),
      stripeSubscriptionId: 'sub_base_passport_002',
    },
  ];

  const createdSubscriptions = await db.insert(subscriptions).values(testSubscriptions).returning();
  console.log(`✅ Created ${createdSubscriptions.length} subscriptions`);

  return createdSubscriptions;
}

async function main() {
  try {
    console.log('🚀 Starting database seeding...\n');

    // Seed in order to maintain referential integrity
    const users = await seedUsers();
    const owners = await seedGymOwners(users);
    const gyms = await seedGyms(owners);
    const members = await seedMembers(users, gyms);
    await seedVisits(members, gyms);
    await seedMessages(users, gyms);
    await seedAccessCodes(users, gyms);
    await seedSubscriptions(users);

    console.log('\n🎉 Database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   Users: ${users.length}`);
    console.log(`   Gym Owners: ${owners.length}`);
    console.log(`   Gyms: ${gyms.length}`);
    console.log(`   Members: ${members.length}`);
    console.log(`   Visits: 3`);
    console.log(`   Messages: 3`);
    console.log(`   Access Codes: 2`);
    console.log(`   Subscriptions: 3`);

    console.log('\n✨ You can now test the API endpoints with real data!');
  } catch (error) {
    console.error('💥 Seeding failed:', error);
    process.exit(1);
  }
}

main();
