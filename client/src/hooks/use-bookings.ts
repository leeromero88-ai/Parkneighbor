import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type BookingInput } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";
import type { BookingWithListing } from "@shared/schema";

// Fetch user's bookings
export function useBookings() {
  return useQuery({
    queryKey: [api.bookings.list.path],
    queryFn: async () => {
      const res = await fetch(api.bookings.list.path, { credentials: "include" });
      
      if (res.status === 401) return null; // Not logged in
      if (!res.ok) throw new Error("Failed to fetch bookings");
      
      const data = await res.json();
      return api.bookings.list.responses[200].parse(data);
    },
  });
}

// Create checkout session for payment
export function useCheckout() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: { listingId: number; startTime: string; endTime: string }) => {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        credentials: 'include',
      });

      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.message || 'Failed to create checkout');
      }

      return res.json();
    },
    onSuccess: (data) => {
      if (data.url) {
        window.location.href = data.url;
      }
    },
    onError: (error) => {
      toast({
        title: 'Checkout Failed',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

// Verify checkout session and create booking
export function useVerifyCheckout(sessionId: string | null) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useQuery({
    queryKey: ['/api/checkout/verify', sessionId],
    queryFn: async () => {
      if (!sessionId) return null;

      const res = await fetch(`/api/checkout/verify?session_id=${sessionId}`, {
        credentials: 'include',
      });

      if (!res.ok) {
        throw new Error('Failed to verify payment');
      }

      const data = await res.json();
      
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: [api.bookings.list.path] });
      }

      return data;
    },
    enabled: !!sessionId,
  });
}

// Fetch a single booking by ID
export function useBooking(id: number | null) {
  return useQuery<BookingWithListing | null>({
    queryKey: ['/api/bookings', id],
    queryFn: async () => {
      if (!id) return null;
      const res = await fetch(`/api/bookings/${id}`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch booking");
      return res.json();
    },
    enabled: !!id,
  });
}

// Create a new booking
export function useCreateBooking() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: BookingInput) => {
      // Validate
      const validated = api.bookings.create.input.parse(data);
      
      const res = await fetch(api.bookings.create.path, {
        method: api.bookings.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });

      if (!res.ok) {
        const json = await res.json();
        if (res.status === 400) {
          const error = api.bookings.create.responses[400].parse(json);
          throw new Error(error.message);
        }
        if (res.status === 401) throw new Error("Please login to book a spot");
        throw new Error("Failed to create booking");
      }

      return api.bookings.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.bookings.list.path] });
      toast({
        title: "Booking Confirmed!",
        description: "Your spot is reserved. See you at the game!",
      });
    },
    onError: (error) => {
      toast({
        title: "Booking Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}
