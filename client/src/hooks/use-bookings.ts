import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type BookingInput } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";

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
