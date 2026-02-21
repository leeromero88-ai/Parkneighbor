# ParkNeighbor

A parking marketplace app that connects drivers looking for parking near Hard Rock Stadium with neighbors offering their driveways and parking spaces.

## Overview
- **Purpose**: Help drivers find affordable, convenient parking near Hard Rock Stadium while allowing neighbors to earn money from their unused parking spaces.
- **Target Users**: Event-goers (drivers) and local homeowners (hosts)

## Project Structure
```
client/                  # React frontend (Vite)
├── src/
│   ├── assets/         # Static assets (logo.png)
│   ├── components/     # Reusable UI components
│   ├── pages/          # Page components
│   ├── hooks/          # Custom React hooks
│   └── lib/            # Utility functions
server/                  # Express backend
├── replit_integrations/ # Auth integration
├── routes.ts           # API endpoints
├── storage.ts          # Database operations
└── db.ts               # Database connection
shared/                  # Shared types and schemas
├── schema.ts           # Drizzle ORM schemas
├── routes.ts           # API contract definitions
└── models/             # Auth models
```

## Recent Changes
- 2026-01-19: Initial build with Replit Auth
- 2026-01-19: Renamed app to "ParkNeighbor"
- 2026-01-19: Added custom logo
- 2026-01-19: Integrated Stripe payments with $4.00 transaction fee
- 2026-01-19: Added Terms of Service, liability disclaimers, and footer
- 2026-01-19: Added About Us page with company info, how it works, and contact section
- 2026-02-21: Added Stripe Connect for host payouts (Express accounts, destination charges)

## User Preferences
- App name: ParkNeighbor
- Target location: Hard Rock Stadium area
- Transaction fee: $4.00 per booking (charged to drivers)

## Technical Notes
- Uses Replit Auth for user authentication
- PostgreSQL database for data storage
- Price stored in cents (integer)
- All dates stored as timestamps
- Stripe integration for payments:
  - Uses stripe-replit-sync for webhook handling
  - $4.00 (400 cents) transaction fee added to each booking
  - Bookings created after successful payment verification
  - Stripe Connect (Express accounts) for host payouts:
    - Hosts onboard at /host/onboarding, linking bank accounts through Stripe
    - Users table has stripeAccountId and stripeAccountStatus fields
    - Checkout uses destination charges: total charge = listing price + $4.00 fee
    - application_fee_amount = $4.00 (kept by platform), remainder goes to host
    - Hosts can create listings without onboarding, but bookings are blocked until active
    - Routes: GET /api/stripe/connect/status, POST /api/stripe/connect/create-account, GET /api/stripe/connect/verify
