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
  - Checkout session includes parking price + service fee
  - Bookings created after successful payment verification
