#!/bin/bash

# Club Link API Deployment Script
# Usage: ./scripts/deploy.sh [dev|prod]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if environment is specified
if [ -z "$1" ]; then
    print_error "Please specify environment: dev or prod"
    echo "Usage: ./scripts/deploy.sh [dev|prod]"
    exit 1
fi

ENVIRONMENT=$1

# Validate environment
if [ "$ENVIRONMENT" != "dev" ] && [ "$ENVIRONMENT" != "prod" ]; then
    print_error "Invalid environment. Use 'dev' or 'prod'"
    exit 1
fi

print_status "Starting API deployment for $ENVIRONMENT environment..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    print_error "Vercel CLI is not installed. Please install it first:"
    echo "npm i -g vercel"
    exit 1
fi

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    print_warning ".env.local file not found. Please create it from env.example"
    echo "cp env.example .env.local"
    echo "Then edit .env.local with your actual values"
    exit 1
fi

# Install dependencies
print_status "Installing dependencies..."
npm install

# Run linting
print_status "Running linting..."
npm run lint

# Verify database schema
print_status "Verifying database schema..."
npm run db:verify

# Build the application
print_status "Building API..."
npm run build

# Deploy to Vercel
if [ "$ENVIRONMENT" = "prod" ]; then
    print_status "Deploying API to production..."
    vercel --prod
else
    print_status "Deploying API to development..."
    vercel
fi

print_status "API deployment completed successfully!"
print_status "Your API is now live on Vercel!"
