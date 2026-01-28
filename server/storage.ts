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
  createListing(listing: InsertListing & { userId: string }): Promise<Listing>;
  
  // Bookings
  getBookingsByUser(userId: string): Promise<BookingWithListing[]>;
  getBookingById(id: number, userId: string): Promise<BookingWithListing | undefined>;
  createBooking(booking: InsertBooking & { userId: string; stripeSessionId?: string | null }): Promise<Booking>;
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

  async createListing(insertListing: InsertListing & { userId: string }): Promise<Listing> {
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

  async getBookingById(id: number, userId: string): Promise<BookingWithListing | undefined> {
    const results = await db.select({
      booking: bookings,
      listing: listings
    })
    .from(bookings)
    .innerJoin(listings, eq(bookings.listingId, listings.id))
    .where(and(eq(bookings.id, id), eq(bookings.userId, userId)));

    if (results.length === 0) return undefined;
    
    return {
      ...results[0].booking,
      listing: results[0].listing
    };
  }

  async createBooking(insertBooking: InsertBooking & { userId: string; stripeSessionId?: string | null }): Promise<Booking> {
    const listing = await this.getListing(insertBooking.listingId);
    if (!listing) throw new Error("Listing not found");

    const TRANSACTION_FEE = 400;
    const totalPrice = listing.price + TRANSACTION_FEE;

    const [booking] = await db.insert(bookings).values({
      listingId: insertBooking.listingId,
      userId: insertBooking.userId,
      startTime: insertBooking.startTime,
      endTime: insertBooking.endTime,
      status: "confirmed",
      totalPrice,
      stripeSessionId: insertBooking.stripeSessionId || null,
    }).returning();
    
    return booking;
  }

  async getBookingBySessionId(sessionId: string): Promise<Booking | undefined> {
    const [booking] = await db.select().from(bookings).where(eq(bookings.stripeSessionId, sessionId));
    return booking;
  }
}

export const storage = new DatabaseStorage();
