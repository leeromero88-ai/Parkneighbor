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
  createBooking(booking: InsertBooking & { stripeSessionId?: string }): Promise<Booking>;
  getBookingBySessionId(sessionId: string): Promise<Booking | undefined>;
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

  async createBooking(insertBooking: InsertBooking & { stripeSessionId?: string }): Promise<Booking> {
    const listing = await this.getListing(insertBooking.listingId);
    if (!listing) throw new Error("Listing not found");

    const totalPrice = listing.price;

    const [booking] = await db.insert(bookings).values({
      ...insertBooking,
      status: "confirmed",
      totalPrice,
      stripeSessionId: insertBooking.stripeSessionId,
    }).returning();
    
    return booking;
  }

  async getBookingBySessionId(sessionId: string): Promise<Booking | undefined> {
    const [booking] = await db.select().from(bookings).where(eq(bookings.stripeSessionId, sessionId));
    return booking;
  }
}

export const storage = new DatabaseStorage();
