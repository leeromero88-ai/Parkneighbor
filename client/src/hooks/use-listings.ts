import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl, type ListingInput } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

// Fetch all listings (with optional search)
export function useListings(search?: string) {
  return useQuery({
    queryKey: [api.listings.list.path, search],
    queryFn: async () => {
      // Build URL with query params
      const url = new URL(api.listings.list.path, window.location.origin);
      if (search) {
        url.searchParams.set("search", search);
      }
      
      const res = await fetch(url.toString(), { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch listings");
      
      const data = await res.json();
      return api.listings.list.responses[200].parse(data);
    },
  });
}

// Fetch single listing
export function useListing(id: number) {
  return useQuery({
    queryKey: [api.listings.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.listings.get.path, { id });
      const res = await fetch(url, { credentials: "include" });
      
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch listing");
      
      const data = await res.json();
      return api.listings.get.responses[200].parse(data);
    },
    enabled: !!id,
  });
}

// Create a new listing
export function useCreateListing() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: ListingInput) => {
      // Validate input before sending
      const validated = api.listings.create.input.parse(data);
      
      const res = await fetch(api.listings.create.path, {
        method: api.listings.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });

      if (!res.ok) {
        if (res.status === 400) {
          const error = api.listings.create.responses[400].parse(await res.json());
          throw new Error(error.message);
        }
        if (res.status === 401) {
          throw new Error("You must be logged in to create a listing");
        }
        throw new Error("Failed to create listing");
      }

      return api.listings.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.listings.list.path] });
      toast({
        title: "Success!",
        description: "Your parking spot has been listed.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}
