import {
  pgEnum,
  pgTable,
  uuid,
  text,
  timestamp,
  jsonb,
  decimal,
  integer,
} from 'drizzle-orm/pg-core';

// Enums
export const userRoleEnum = pgEnum('user_role', ['admin', 'owner', 'member']);
export const gymStatusEnum = pgEnum('gym_status', ['pending', 'active', 'suspended']);
export const subscriptionTypeEnum = pgEnum('subscription_type', [
  'gym_monthly',
  'base_passport',
  'unlimited_roamer',
]);
export const subscriptionStatusEnum = pgEnum('subscription_status', [
  'active',
  'cancelled',
  'past_due',
]);
export const visitStatusEnum = pgEnum('visit_status', [
  'booked',
  'checked_in',
  'completed',
  'no_show',
]);

// Users table
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull().unique(),
  role: userRoleEnum('role').notNull(),
  clerkId: text('clerk_id').notNull().unique(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

// Gym owners
export const gymOwners = pgTable('gym_owners', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id),
  businessName: text('business_name').notNull(),
  contactPhone: text('contact_phone'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

// Gyms
export const gyms = pgTable('gyms', {
  id: uuid('id').primaryKey().defaultRandom(),
  ownerId: uuid('owner_id')
    .notNull()
    .references(() => gymOwners.id),
  name: text('name').notNull(),
  address: jsonb('address').$type<Record<string, unknown>>().notNull(),
  coordinates: jsonb('coordinates').$type<{ lat: number; lng: number }>().notNull(),
  amenities: jsonb('amenities').$type<string[]>().notNull(),
  photos: jsonb('photos').$type<string[]>(),
  openingHours: jsonb('opening_hours').$type<Record<string, unknown>>(),
  status: gymStatusEnum('status').notNull().default('pending'),
  monthlyFee: decimal('monthly_fee', { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

// Members
export const members = pgTable('members', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id),
  homeGymId: uuid('home_gym_id').references(() => gyms.id),
  preferredName: text('preferred_name'),
  age: integer('age'),
  occupation: text('occupation'),
  location: text('location'),
  athleteType: jsonb('athlete_type').$type<string[]>(),
  subscriptionType: subscriptionTypeEnum('subscription_type'),
  subscriptionStatus: subscriptionStatusEnum('subscription_status'),
  profilePhoto: text('profile_photo'),
  bio: text('bio'),
  phone: text('phone'),
  socialAccounts: jsonb('social_accounts').$type<Record<string, unknown>>(),
  preferences: jsonb('preferences').$type<Record<string, unknown>>(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

// Visits
export const visits = pgTable('visits', {
  id: uuid('id').primaryKey().defaultRandom(),
  memberId: uuid('member_id')
    .notNull()
    .references(() => members.id),
  gymId: uuid('gym_id')
    .notNull()
    .references(() => gyms.id),
  visitDate: timestamp('visit_date', { withTimezone: true }).notNull().defaultNow(),
  checkInTime: timestamp('check_in_time', { withTimezone: true }),
  checkOutTime: timestamp('check_out_time', { withTimezone: true }),
  status: visitStatusEnum('status').notNull().default('booked'),
  qrCodeUsed: text('qr_code_used'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

// Messages
export const messages = pgTable('messages', {
  id: uuid('id').primaryKey().defaultRandom(),
  senderId: uuid('sender_id')
    .notNull()
    .references(() => users.id),
  recipientId: uuid('recipient_id')
    .notNull()
    .references(() => users.id),
  gymId: uuid('gym_id').references(() => gyms.id),
  content: text('content').notNull(),
  readAt: timestamp('read_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

// Access codes
export const accessCodes = pgTable('access_codes', {
  id: uuid('id').primaryKey().defaultRandom(),
  code: text('code').notNull().unique(),
  gymId: uuid('gym_id').references(() => gyms.id),
  email: text('email').notNull(),
  role: userRoleEnum('role').notNull(),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  usedAt: timestamp('used_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

// Subscriptions
export const subscriptions = pgTable('subscriptions', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id),
  type: subscriptionTypeEnum('type').notNull(),
  status: subscriptionStatusEnum('status').notNull(),
  currentPeriodStart: timestamp('current_period_start', { withTimezone: true }).notNull(),
  currentPeriodEnd: timestamp('current_period_end', { withTimezone: true }).notNull(),
  stripeSubscriptionId: text('stripe_subscription_id').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});
