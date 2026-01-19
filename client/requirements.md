## Packages
framer-motion | Smooth animations for page transitions and interactions
date-fns | Date formatting and manipulation for booking calendars
react-day-picker | Calendar component for selecting booking dates
clsx | Utility for constructing className strings conditionally
tailwind-merge | Utility for merging Tailwind CSS classes safely

## Notes
- Images are stored as URL strings in the database.
- Price is stored in cents (integer). Frontend must format to currency.
- Uses Replit Auth: `useAuth` hook handles user state.
- `use-auth.ts` is already provided by the system, so we import from `@/hooks/use-auth`.
