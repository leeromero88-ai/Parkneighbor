import { db } from "./db";
import { 
  listings, bookings, users,
  type Listing, type InsertListing, 
  type Booking, type InsertBooking, 
  type BookingWithListing
} from "@shared/schema";
import { eq, desc, and } from "drizzle-orm";

export interface IStorage {
  // Listings
  getListings(): Promise<Listing[]>;
  getListing(id: number): Promise<Listing | undefined>;
  createListing(listing: InsertListing): Promise<Listing>;
  
  // Bookings
  getBookingsByUser(userId: string): Promise<BookingWithListing[]>;
  createBooking(booking: InsertBooking): Promise<Booking>;
}

export class DatabaseStorage implements IStorage {
  async getListings(): Promise<Listing[]> {
    return await db.select().from(listings).orderBy(desc(listings.createdAt));
  }

  async getListing(id: number): Promise<Listing | undefined> {
    const [listing] = await db.select().from(listings).where(eq(listings.id, id));
    return listing;
  }

  async createListing(insertListing: InsertListing): Promise<Listing> {
    const [listing] = await db.insert(listings).values(insertListing).returning();
    return listing;
  }

  async getBookingsByUser(userId: string): Promise<BookingWithListing[]> {
    const results = await db.select({
      booking: bookings,
      listing: listings
    })
    .from(bookings)
    .innerJoin(listings, eq(bookings.listingId, listings.id))
    .where(eq(bookings.userId, userId))
    .orderBy(desc(bookings.createdAt));

    return results.map(row => ({
      ...row.booking,
      listing: row.listing
    }));
  }

  async createBooking(insertBooking: InsertBooking): Promise<Booking> {
    // Calculate total price based on duration (simplified logic for now)
    // In a real app, we'd check availability and calculate price per hour/day
    const listing = await this.getListing(insertBooking.listingId);
    if (!listing) throw new Error("Listing not found");

    const totalPrice = listing.price; // Flat rate for now or per unit logic

    const [booking] = await db.insert(bookings).values({
      ...insertBooking,
      status: "confirmed",
      totalPrice,
    }).returning();
    
    return booking;
  }
}

export const storage = new DatabaseStorage();
