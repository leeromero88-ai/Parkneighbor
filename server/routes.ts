import type { Express } from "express";
import type { Server } from "http";
import { setupAuth, registerAuthRoutes } from "./replit_integrations/auth";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { insertListingSchema, insertBookingSchema } from "@shared/schema";
import { getUncachableStripeClient, getStripePublishableKey } from "./stripeClient";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Setup Replit Auth first
  await setupAuth(app);
  registerAuthRoutes(app);

  // === Listings Routes ===

  app.get(api.listings.list.path, async (req, res) => {
    const listings = await storage.getListings();
    res.json(listings);
  });

  app.get(api.listings.get.path, async (req, res) => {
    const id = Number(req.params.id);
    const listing = await storage.getListing(id);
    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }
    res.json(listing);
  });

  app.post(api.listings.create.path, async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    try {
      const userId = (req.user as any).claims.sub;
      const input = insertListingSchema.parse(req.body);
      const listing = await storage.createListing({ ...input, userId });
      res.status(201).json(listing);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.')
        });
      }
      throw err;
    }
  });

  // === Bookings Routes ===

  app.get(api.bookings.list.path, async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    const userId = (req.user as any).claims.sub;
    const bookings = await storage.getBookingsByUser(userId);
    res.json(bookings);
  });

  app.get('/api/bookings/:id', async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    const userId = (req.user as any).claims.sub;
    const id = Number(req.params.id);
    
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid booking ID" });
    }
    
    const booking = await storage.getBookingById(id, userId);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    
    res.json(booking);
  });

  app.post(api.bookings.create.path, async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const userId = (req.user as any).claims.sub;
      const input = insertBookingSchema.parse(req.body);
      const booking = await storage.createBooking({ ...input, userId });
      res.status(201).json(booking);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.')
        });
      }
      if (err instanceof Error && err.message === "Listing not found") {
        return res.status(404).json({ message: "Listing not found" });
      }
      throw err;
    }
  });

  // === Stripe Payment Routes ===
  
  app.get('/api/stripe/publishable-key', async (req, res) => {
    try {
      const publishableKey = await getStripePublishableKey();
      res.json({ publishableKey });
    } catch (error) {
      console.error('Error getting Stripe publishable key:', error);
      res.status(500).json({ message: 'Payment system unavailable' });
    }
  });

  app.post('/api/checkout', async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const { listingId, startTime, endTime } = req.body;
      
      if (!listingId) {
        return res.status(400).json({ message: "Listing ID is required" });
      }

      const listing = await storage.getListing(listingId);
      if (!listing) {
        return res.status(404).json({ message: "Listing not found" });
      }

      const userId = (req.user as any).claims.sub;
      const TRANSACTION_FEE = 400;

      const stripe = await getUncachableStripeClient();

      const baseUrl = `https://${process.env.REPLIT_DOMAINS?.split(',')[0]}`;
      
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: listing.title,
                description: `Parking at ${listing.address}`,
              },
              unit_amount: listing.price,
            },
            quantity: 1,
          },
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: 'ParkNeighbor Transaction Fee',
                description: 'Service fee for booking',
              },
              unit_amount: TRANSACTION_FEE,
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${baseUrl}/booking/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${baseUrl}/browse`,
        metadata: {
          listingId: listingId.toString(),
          userId,
          startTime: startTime || new Date().toISOString(),
          endTime: endTime || new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
        },
      });

      res.json({ url: session.url });
    } catch (error: any) {
      console.error('Checkout error:', error);
      res.status(500).json({ message: 'Failed to create checkout session' });
    }
  });

  app.get('/api/checkout/verify', async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const { session_id } = req.query;
      
      if (!session_id || typeof session_id !== 'string') {
        return res.status(400).json({ message: "Session ID is required" });
      }

      const stripe = await getUncachableStripeClient();
      const session = await stripe.checkout.sessions.retrieve(session_id);

      if (session.payment_status === 'paid') {
        const metadata = session.metadata;
        const userId = (req.user as any).claims.sub;
        
        if (!metadata || !metadata.listingId || !metadata.startTime || !metadata.endTime) {
          return res.status(400).json({ message: "Invalid session metadata" });
        }

        if (metadata.userId !== userId) {
          return res.status(403).json({ message: "Session does not belong to this user" });
        }
        
        const existingBooking = await storage.getBookingBySessionId(session_id);
        if (existingBooking) {
          return res.json({ success: true, booking: existingBooking });
        }

        const booking = await storage.createBooking({
          listingId: parseInt(metadata.listingId),
          userId,
          startTime: new Date(metadata.startTime),
          endTime: new Date(metadata.endTime),
          stripeSessionId: session_id,
        });

        return res.json({ success: true, booking });
      }

      res.json({ success: false, message: 'Payment not completed' });
    } catch (error: any) {
      console.error('Verify checkout error:', error);
      res.status(500).json({ message: 'Failed to verify payment' });
    }
  });

  // Seed data function
  async function seedDatabase() {
    const listings = await storage.getListings();
    if (listings.length === 0) {
      console.log("Database seeded with initial structure.");
    }
  }

  await seedDatabase();

  return httpServer;
}
