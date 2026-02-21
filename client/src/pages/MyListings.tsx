import { useMyListings, useDeleteListing } from "@/hooks/use-listings";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, MapPin, PlusCircle, Trash2, DollarSign, Calendar } from "lucide-react";
import { Link, useLocation } from "wouter";
import { format } from "date-fns";
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function MyListings() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { data: listings, isLoading } = useMyListings();
  const deleteMutation = useDeleteListing();
  const [, setLocation] = useLocation();
  const [deleteId, setDeleteId] = useState<number | null>(null);

  if (authLoading || isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="animate-spin h-8 w-8 text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-muted/20 py-12">
        <div className="container max-w-lg px-4 text-center">
          <h1 className="text-2xl font-bold mb-4">My Listings</h1>
          <p className="text-muted-foreground mb-6">Please log in to manage your listings.</p>
          <Button onClick={() => window.location.href = "/api/login"} data-testid="button-login-listings">
            Log In
          </Button>
        </div>
      </div>
    );
  }

  const handleDelete = () => {
    if (deleteId !== null) {
      deleteMutation.mutate(deleteId, {
        onSuccess: () => setDeleteId(null),
      });
    }
  };

  return (
    <div className="min-h-screen bg-muted/20 py-12 page-transition">
      <div className="container max-w-4xl px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold" data-testid="text-my-listings-title">My Listings</h1>
            <p className="text-muted-foreground mt-1">Manage your parking spots</p>
          </div>
          <Link href="/create-listing">
            <Button className="shadow-lg shadow-primary/20" data-testid="button-new-listing">
              <PlusCircle className="mr-2 h-4 w-4" /> New Listing
            </Button>
          </Link>
        </div>

        {!listings || listings.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="p-12 text-center">
              <MapPin className="h-12 w-12 text-muted-foreground/40 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No listings yet</h3>
              <p className="text-muted-foreground mb-6">Start earning by listing your parking spot near Hard Rock Stadium.</p>
              <Link href="/create-listing">
                <Button data-testid="button-create-first-listing">
                  <PlusCircle className="mr-2 h-4 w-4" /> Create Your First Listing
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {listings.map((listing) => {
              const bgImage = listing.imageUrl || "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=400&auto=format&fit=crop&q=60";
              return (
                <Card key={listing.id} className="overflow-hidden hover:shadow-lg transition-shadow" data-testid={`card-listing-${listing.id}`}>
                  <div className="flex flex-col sm:flex-row">
                    <div className="sm:w-48 h-40 sm:h-auto shrink-0">
                      <img
                        src={bgImage}
                        alt={listing.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardContent className="flex-1 p-4 sm:p-6 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-bold text-lg" data-testid={`text-listing-title-${listing.id}`}>{listing.title}</h3>
                          <Badge variant="secondary" className="shrink-0">
                            <DollarSign className="h-3 w-3 mr-0.5" />
                            {(listing.price / 100).toFixed(2)}
                          </Badge>
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground mt-1">
                          <MapPin className="h-3.5 w-3.5 mr-1" />
                          {listing.address}
                        </div>
                        <div className="flex items-center text-xs text-muted-foreground mt-2">
                          <Calendar className="h-3 w-3 mr-1" />
                          {format(new Date(listing.availableFrom), "MMM d")} - {format(new Date(listing.availableTo), "MMM d, yyyy")}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mt-4">
                        <Link href={`/listing/${listing.id}`}>
                          <Button variant="outline" size="sm" data-testid={`button-view-listing-${listing.id}`}>
                            View
                          </Button>
                        </Link>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => setDeleteId(listing.id)}
                          data-testid={`button-delete-listing-${listing.id}`}
                        >
                          <Trash2 className="h-3.5 w-3.5 mr-1" /> Remove
                        </Button>
                      </div>
                    </CardContent>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      <Dialog open={deleteId !== null} onOpenChange={(open) => !open && setDeleteId(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Remove Listing</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove this parking spot? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)} data-testid="button-cancel-delete">
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
              data-testid="button-confirm-delete"
            >
              {deleteMutation.isPending ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Removing...</>
              ) : (
                "Remove Listing"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}