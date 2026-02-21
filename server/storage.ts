import { db } from "./db";
import { 
  listings, bookings, users,
  type Listing, type InsertListing, 
  type Booking, type InsertBooking, 
  type BookingWithListing
} from "@shared/schema";
import type { User } from "@shared/models/auth";
import { eq, desc, and } from "drizzle-orm";

export interface IStorage {
  // Listings
  getListings(): Promise<Listing[]>;
  getListingsByUser(userId: string): Promise<Listing[]>;
  getListing(id: number): Promise<Listing | undefined>;
  createListing(listing: InsertListing & { userId: string }): Promise<Listing>;
  deleteListing(id: number, userId: string): Promise<boolean>;
  
  // Bookings
  getBookingsByUser(userId: string): Promise<BookingWithListing[]>;
  getBookingById(id: number, userId: string): Promise<BookingWithListing | undefined>;
  createBooking(booking: InsertBooking & { userId: string; stripeSessionId?: string | null }): Promise<Booking>;
  getBookingBySessionId(sessionId: string): Promise<Booking | undefined>;

  // Stripe Connect
  getUser(userId: string): Promise<User | undefined>;
  updateStripeAccount(userId: string, stripeAccountId: string, status: string): Promise<User | undefined>;
  updateStripeAccountStatus(userId: string, status: string): Promise<User | undefined>;
}

export class DatabaseStorage implements IStorage {
  async getListings(): Promise<Listing[]> {
    return await db.select().from(listings).orderBy(desc(listings.createdAt));
  }

  async getListing(id: number): Promise<Listing | undefined> {
    const [listing] = await db.select().from(listings).where(eq(listings.id, id));
    return listing;
  }

  async getListingsByUser(userId: string): Promise<Listing[]> {
    return await db.select().from(listings).where(eq(listings.userId, userId)).orderBy(desc(listings.createdAt));
  }

  async createListing(insertListing: InsertListing & { userId: string }): Promise<Listing> {
    const [listing] = await db.insert(listings).values(insertListing).returning();
    return listing;
  }

  async deleteListing(id: number, userId: string): Promise<boolean> {
    const result = await db.delete(listings).where(and(eq(listings.id, id), eq(listings.userId, userId))).returning();
    return result.length > 0;
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

  async getUser(userId: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, userId));
    return user;
  }

  async updateStripeAccount(userId: string, stripeAccountId: string, status: string): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set({ stripeAccountId, stripeAccountStatus: status, updatedAt: new Date() })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  async updateStripeAccountStatus(userId: string, status: string): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set({ stripeAccountStatus: status, updatedAt: new Date() })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }
}

export const storage = new DatabaseStorage();
