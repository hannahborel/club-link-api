# club-link-api

![Node 20](https://img.shields.io/badge/node-20.x-43853d?logo=node.js&logoColor=white)
![Next.js API Routes](https://img.shields.io/badge/Next.js-API_Routes-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)
![Drizzle ORM](https://img.shields.io/badge/Drizzle-ORM-00D4FF)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Vercel_Postgres-4169E1?logo=postgresql&logoColor=white)
![Zod](https://img.shields.io/badge/Zod-Validation-0b7285)
![ESLint](https://img.shields.io/badge/ESLint-configured-4B32C3?logo=eslint&logoColor=white)
![Prettier](https://img.shields.io/badge/Prettier-configured-ff69b4?logo=prettier&logoColor=white)
![License](https://img.shields.io/badge/license-ISC-blue)
![Issues](https://github.com/issues/hannahborel/club-link-api)
![Stars](https://github.com/stars/hannahborel/club-link-api?style=social)

Central API for Club Link (Next.js API routes + Drizzle ORM).

## Tech Stack

- Next.js API Routes (Node serverless via Vercel)
- TypeScript
- Drizzle ORM + PostgreSQL (Vercel Postgres)
- Zod validation
- Auth: Clerk

## Requirements

- Node 20 (see `.nvmrc`)

## Setup

```bash
nvm use
npm install
```

## Scripts

```bash
npm run lint    # ESLint across the repo
npm run format  # Prettier format
npm run db:generate # Generate SQL migrations from Drizzle schema
npm run db:migrate  # Apply migrations to the database
npm run db:smoke    # Run DB connectivity and FK smoke test
npm run db:seed     # Seed database with test data
npm run db:reset    # Reset database (clear all data)
npm run test:api    # Run automated API tests
```

## Tooling

- ESLint (TypeScript, import, unused-imports)
- Prettier (enforced via VSCode settings)
- Husky + lint-staged (runs on pre-commit)

## Project Structure (planned)

- `src/app/api` – API routes
- `src/lib/db` – Drizzle config, schema, migrations
- `src/lib/validation` – Zod schemas
- `src/lib/auth` – Clerk integration, RBAC
- `src/types` – shared types

## Environment Variables

Create a `.env.local` in this directory with at least:

```bash
# Vercel Postgres (pooled)
POSTGRES_URL="postgres://..."

# Optional: direct/non-pooled connection used by some scripts
POSTGRES_URL_NON_POOLING="postgres://..."

# Clerk (to be added later)
# CLERK_PUBLISHABLE_KEY="..."
# CLERK_SECRET_KEY="..."
```

The Drizzle config reads `POSTGRES_URL` by default.

> Tip: When running locally against Vercel Postgres, ensure your IP is allowed or use `vercel env pull` if applicable.

## Database & Drizzle

Drizzle ORM is configured under `src/lib/db/`.

- Edit schema in `src/lib/db/schema.ts`
- Generate migrations from the schema:

```bash
npm run db:generate
```

- Apply migrations to the target database:

```bash
npm run db:migrate
```

### Smoke Test

A smoke test validates connectivity and basic relations by inserting linked records and cleaning them up.

```bash
npm run db:smoke
```

This uses the same `POSTGRES_URL`/`POSTGRES_URL_NON_POOLING` env vars.

## 🚀 Deployment

### Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **Vercel CLI**: Install globally with `npm i -g vercel`
3. **Git Repository**: Ensure your code is pushed to GitHub
4. **Database**: Set up PostgreSQL database (Neon, Vercel Postgres, or self-hosted)
5. **Environment Variables**: Set up all required environment variables

### Environment Setup

#### 1. Copy Environment Template

```bash
cp env.example .env.local
```

#### 2. Configure Environment Variables

Edit `.env.local` with your actual values:

- **Database**: Set your PostgreSQL connection string
- **Clerk**: Add your Clerk authentication keys
- **Stripe**: Configure payment processing keys
- **Security**: Set JWT and encryption keys

#### 3. Required Environment Variables

```bash
# Application
NODE_ENV=development
PORT=3001

# Database
DATABASE_URL="postgresql://username:password@localhost:5432/club_link"
NEON_DATABASE_URL="postgresql://username:password@localhost:5432/club_link"

# Authentication (Clerk)
CLERK_SECRET_KEY=sk_test_your_key
CLERK_WEBHOOK_SECRET=whsec_your_webhook_secret

# API Configuration
API_BASE_URL=http://localhost:3001
CORS_ORIGIN=http://localhost:3000

# Stripe
STRIPE_SECRET_KEY=sk_test_your_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Security
JWT_SECRET=your_jwt_secret_key_here
ENCRYPTION_KEY=your_encryption_key_here
```

### Database Setup

#### 1. Local Development

```bash
# Start local PostgreSQL
brew services start postgresql

# Create database
createdb club_link

# Run migrations
npm run db:migrate

# Seed data (optional)
npm run db:seed
```

#### 2. Production Database

##### Option A: Neon Database

1. Create account at [neon.tech](https://neon.tech)
2. Create new project
3. Copy connection string to environment variables

##### Option B: Vercel Postgres

1. Create Postgres database in Vercel dashboard
2. Vercel automatically sets `POSTGRES_URL` environment variable
3. Update `DATABASE_URL` to use `POSTGRES_URL`

### Development Deployment

#### 1. Quick Deploy

```bash
# Deploy to development environment
./scripts/deploy.sh dev
```

#### 2. Manual Deploy

```bash
# Install dependencies
npm install

# Run linting
npm run lint

# Verify database schema
npm run db:verify

# Build API
npm run build

# Deploy to Vercel
vercel
```

#### 3. Development URL

After deployment, you'll get a development URL like:
`https://club-link-api-git-dev-username.vercel.app`

### Production Deployment

#### 1. Production Deploy

```bash
# Deploy to production
./scripts/deploy.sh prod
```

#### 2. Manual Production Deploy

```bash
# Install dependencies
npm install

# Run linting
npm run lint

# Verify database schema
npm run db:verify

# Build API
npm run build

# Deploy to production
vercel --prod
```

#### 3. Production URL

Your production API will be available at:
`https://your-project-name.vercel.app`

### Vercel Configuration

The `vercel.json` file configures:

- **Build Commands**: `npm run build`
- **Output Directory**: `.next`
- **Framework**: Next.js
- **Security Headers**: XSS protection, content type options
- **Function Timeouts**: 30 seconds for API routes

### Environment Variables in Vercel

#### 1. Via Vercel Dashboard

1. Go to your project in Vercel
2. Navigate to Settings → Environment Variables
3. Add each environment variable
4. Select the appropriate environment (Production, Preview, Development)

#### 2. Via Vercel CLI

```bash
# Set production environment variable
vercel env add DATABASE_URL production

# Set preview environment variable
vercel env add DATABASE_URL preview
```

#### 3. Critical Environment Variables

Ensure these are set in production:

```bash
# Database (Production)
DATABASE_URL="postgresql://username:password@production-host:5432/club_link"

# Authentication
CLERK_SECRET_KEY=sk_live_your_production_key
CLERK_WEBHOOK_SECRET=whsec_your_production_webhook

# Stripe (Production)
STRIPE_SECRET_KEY=sk_live_your_production_key
STRIPE_WEBHOOK_SECRET=whsec_your_production_webhook

# Security
JWT_SECRET=your_production_jwt_secret
ENCRYPTION_KEY=your_production_encryption_key
```

### Database Migrations

#### 1. Development

```bash
# Generate migration
npm run db:generate

# Run migration
npm run db:migrate

# Verify schema
npm run db:verify
```

#### 2. Production

```bash
# Run migrations on production database
npm run db:migrate

# Verify production schema
npm run db:verify
```

### API Testing

#### 1. Test Database Connection

```bash
# Test database connectivity
npm run db:smoke

# Test API endpoints
npm run test:api
```

#### 2. Verify API Health

Check these endpoints after deployment:

- `GET /api/health` - API health check
- `GET /api/test-db` - Database connectivity test
- `POST /api/test-db` - Database write test

### Monitoring & Analytics

#### 1. Vercel Analytics

- View deployment status
- Monitor function execution
- Check API response times
- Track error rates

#### 2. Database Monitoring

- Monitor connection pool usage
- Track query performance
- Check database size and growth
- Monitor backup status

### Troubleshooting

#### Common Issues

1. **Database Connection Failures**
   - Verify DATABASE_URL format
   - Check database accessibility
   - Verify firewall settings
   - Check connection pool limits

2. **Environment Variable Issues**
   - Ensure variables are set in Vercel
   - Check variable names match exactly
   - Verify environment scope
   - Restart functions after variable changes

3. **Build Failures**
   - Check TypeScript compilation
   - Verify all dependencies are installed
   - Check for syntax errors
   - Review build logs

#### Debug Commands

```bash
# Check Vercel status
vercel ls

# View deployment logs
vercel logs

# Check environment variables
vercel env ls

# Test database locally
npm run db:smoke

# Verify schema
npm run db:verify
```

### Security Considerations

- All environment variables are encrypted in Vercel
- Security headers are automatically applied
- HTTPS is enforced for all deployments
- API routes have timeout limits
- Database connections use SSL in production
- JWT tokens have expiration times
- Rate limiting is implemented

### Performance Optimization

#### 1. Database

- Use connection pooling
- Implement query caching
- Add database indexes
- Monitor slow queries

#### 2. API

- Implement response caching
- Use compression
- Optimize payload sizes
- Monitor function cold starts

### Next Steps

After successful deployment:

1. **Test All Endpoints**: Verify API functionality
2. **Monitor Performance**: Check response times and error rates
3. **Set Up Alerts**: Configure monitoring and alerting
4. **Update Web App**: Point web app to new API URL
5. **Test Mobile App**: Verify mobile app connectivity

## API Testing

### Test Endpoint: `/api/test-db`

The `/api/test-db` endpoint provides basic CRUD operations for testing database connectivity and operations.

#### GET /api/test-db

Retrieves all users from the database.

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "email": "user@example.com",
      "role": "member",
      "clerkId": "clerk_user_id",
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    }
  ],
  "count": 1
}
```

#### POST /api/test-db

Creates a new user.

**Request Body:**

```json
{
  "email": "newuser@example.com",
  "role": "member",
  "clerkId": "clerk_user_id"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "newuser@example.com",
    "role": "member",
    "clerkId": "clerk_user_id",
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  },
  "message": "User created successfully"
}
```

#### PUT /api/test-db?id=:id

Updates an existing user by ID.

**Query Parameters:**

- `id`: The UUID of the user to update

**Request Body:**

```json
{
  "email": "updated@example.com",
  "role": "admin"
}
```

#### DELETE /api/test-db?id=:id

Deletes a user by ID.

**Query Parameters:**

- `id`: The UUID of the user to delete

### Testing the API

#### Database Management

```bash
# Seed the database with test data
npm run db:seed

# Reset the database (clear all data)
npm run db:reset

# Run database smoke test
npm run db:smoke
```

#### Automated Testing

```bash
# Run the automated test script
npm run test:api
```

#### Manual Testing with cURL

```bash
# Get all users
curl http://localhost:3000/api/test-db

# Create a user
curl -X POST http://localhost:3000/api/test-db \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","role":"member","clerkId":"test123"}'

# Update a user (replace UUID with actual user ID)
curl -X PUT "http://localhost:3000/api/test-db?id=UUID" \
  -H "Content-Type: application/json" \
  -d '{"email":"updated@example.com"}'

# Delete a user (replace UUID with actual user ID)
curl -X DELETE "http://localhost:3000/api/test-db?id=UUID"
```

### Error Handling

All endpoints return consistent error responses:

```json
{
  "success": false,
  "error": "Error message",
  "details": "Additional error details (if applicable)"
}
```

Common HTTP status codes:

- `200` - Success
- `201` - Created (POST)
- `400` - Bad Request (validation errors)
- `404` - Not Found
- `500` - Internal Server Error

### Validation

The API uses Zod schemas to validate input data:

- **Email**: Must be a valid email format
- **Role**: Must be one of: `admin`, `owner`, `member`
- **Clerk ID**: Must be a non-empty string

> **Note**: This is a test endpoint for development purposes. All operations are performed on the `users` table.

## Contributing

Pre-commit hooks run lint-staged. Ensure a clean `npm run lint` and `npm run format` before pushing.
