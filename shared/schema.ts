import { pgTable, text, serial, integer, boolean, timestamp, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { users } from "./models/auth"; // Import users table from auth module

// Export auth models so they are included in the schema
export * from "./models/auth";

// === TABLE DEFINITIONS ===

export const listings = pgTable("listings", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  description: text("description").notNull(),
  address: text("address").notNull(),
  price: integer("price").notNull(), // Price in cents
  imageUrl: text("image_url"),
  latitude: text("latitude"), // Store as text for simplicity, or use specific geo types if needed later
  longitude: text("longitude"),
  availableFrom: timestamp("available_from").notNull(),
  availableTo: timestamp("available_to").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  listingId: integer("listing_id").notNull().references(() => listings.id),
  userId: varchar("user_id").notNull().references(() => users.id), // Driver
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time").notNull(),
  status: text("status", { enum: ["pending", "confirmed", "cancelled"] }).default("confirmed").notNull(),
  totalPrice: integer("total_price").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// === BASE SCHEMAS ===

export const insertListingSchema = createInsertSchema(listings).omit({ 
  id: true, 
  userId: true, 
  createdAt: true 
}).extend({
    price: z.coerce.number().min(1, "Price must be at least 1 cent"),
    availableFrom: z.coerce.date(),
    availableTo: z.coerce.date(),
});

export const insertBookingSchema = createInsertSchema(bookings).omit({ 
  id: true, 
  userId: true, 
  createdAt: true,
  status: true, // Status is managed by backend
  totalPrice: true // Price calculated by backend
}).extend({
    startTime: z.coerce.date(),
    endTime: z.coerce.date(),
});

// === EXPLICIT API CONTRACT TYPES ===

export type Listing = typeof listings.$inferSelect;
export type InsertListing = z.infer<typeof insertListingSchema>;
export type CreateListingRequest = InsertListing;

export type Booking = typeof bookings.$inferSelect;
export type InsertBooking = z.infer<typeof insertBookingSchema>;
export type CreateBookingRequest = InsertBooking;

// Extended types for frontend display
export type BookingWithListing = Booking & { listing: Listing };
export type ListingWithHost = Listing & { host: typeof users.$inferSelect };
