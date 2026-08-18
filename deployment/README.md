# Deployment Configuration

This directory contains deployment notes and runtime specs for Derivative Genius.

## Stack Overview
- **Framework:** Next.js 16 App Router
- **Runtime:** Node.js >= 20.9.0
- **Database:** PostgreSQL (Neon / Drizzle ORM)
- **Deployment Platform:** Vercel

## Required Environment Variables
```env
# Database Connection (Drizzle ORM + Neon PostgreSQL)
DATABASE_URL="postgresql://..."

# Application URL
NEXT_PUBLIC_APP_URL="https://derivativegenius.com"
```
