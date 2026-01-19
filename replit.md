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

## User Preferences
- App name: ParkNeighbor
- Target location: Hard Rock Stadium area

## Pending Features
- **Stripe Integration**: User wants to charge a $4.00 fee per transaction to drivers. Stripe connector was not set up. When ready to implement, use `search_integrations` to find Stripe and complete the authorization flow.

## Technical Notes
- Uses Replit Auth for user authentication
- PostgreSQL database for data storage
- Price stored in cents (integer)
- All dates stored as timestamps
