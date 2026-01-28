import { useRoute, Link, useLocation } from "wouter";
import { useListing } from "@/hooks/use-listings";
import { useCreateBooking } from "@/hooks/use-bookings";
import { useAuth } from "@/hooks/use-auth";
import { Loader2, MapPin, Check, Shield, User, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export default function ListingDetails() {
  const [, params] = useRoute("/listing/:id");
  const id = parseInt(params?.id || "0");
  const { data: listing, isLoading, error } = useListing(id);
  const { isAuthenticated } = useAuth();
  
  if (isLoading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin h-8 w-8 text-primary" /></div>;
  if (error || !listing) return <div className="h-screen flex items-center justify-center text-destructive">Listing not found</div>;

  const bgImage = listing.imageUrl || "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=1200&auto=format&fit=crop&q=80";

  return (
    <div className="min-h-screen bg-background pb-20 page-transition">
      {/* Hero Image */}
      <div className="relative h-[40vh] md:h-[50vh] w-full overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${bgImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
      </div>

      <div className="container -mt-32 relative z-10 px-4">
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h1 className="text-3xl md:text-5xl font-display font-bold text-foreground mb-4 shadow-lg">{listing.title}</h1>
              <div className="flex items-center text-lg text-muted-foreground bg-background/80 backdrop-blur w-fit px-3 py-1 rounded-full border">
                <MapPin className="h-5 w-5 mr-2 text-primary" />
                {listing.address}
              </div>
            </div>

            <Card className="rounded-2xl border-none shadow-lg">
              <CardContent className="p-8">
                <h3 className="text-xl font-bold mb-4 font-display">About this spot</h3>
                <p className="text-muted-foreground leading-relaxed text-lg">
                  {listing.description}
                </p>
                
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3 p-4 rounded-xl bg-muted/30">
                    <Shield className="h-6 w-6 text-accent shrink-0" />
                    <div>
                      <h4 className="font-semibold">Secure Location</h4>
                      <p className="text-sm text-muted-foreground">Monitored residential area</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 rounded-xl bg-muted/30">
                    <Check className="h-6 w-6 text-primary shrink-0" />
                    <div>
                      <h4 className="font-semibold">Instant Booking</h4>
                      <p className="text-sm text-muted-foreground">Guaranteed reservation instantly</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex items-center gap-4">
              <Avatar className="h-12 w-12 ring-2 ring-background shadow-md">
                <AvatarFallback><User /></AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm text-muted-foreground">Hosted by</p>
                <p className="font-bold">Verified Neighbor</p>
              </div>
            </div>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <Card className="rounded-2xl shadow-xl border-primary/10 overflow-hidden">
                <div className="bg-primary/5 p-6 border-b border-primary/10">
                  <div className="flex items-baseline justify-between">
                    <span className="text-3xl font-bold text-primary font-display">
                      ${(listing.price / 100).toFixed(2)}
                    </span>
                    <span className="text-muted-foreground font-medium">per game</span>
                  </div>
                </div>
                
                <CardContent className="p-6 space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Available from</span>
                      <span className="font-medium">{format(new Date(listing.availableFrom), "MMM d, h:mm a")}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Until</span>
                      <span className="font-medium">{format(new Date(listing.availableTo), "h:mm a")}</span>
                    </div>
                    <div className="h-px bg-border my-4" />
                    <div className="flex items-center justify-between font-bold text-lg">
                      <span>Price</span>
                      <span>${(listing.price / 100).toFixed(2)}</span>
                    </div>
                  </div>

                  {isAuthenticated ? (
                    <BookingDialog listing={listing} />
                  ) : (
                    <Button 
                      className="w-full text-lg h-12" 
                      onClick={() => window.location.href = "/api/login"}
                    >
                      Login to Book
                    </Button>
                  )}
                  
                  <p className="text-xs text-center text-muted-foreground">
                    You won't be charged until you confirm.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

function BookingDialog({ listing }: { listing: any }) {
  const { mutate, isPending } = useCreateBooking();
  const [open, setOpen] = useState(false);
  const [, setLocation] = useLocation();

  const handleBook = () => {
    mutate({
      listingId: listing.id,
      startTime: new Date(listing.availableFrom),
      endTime: new Date(listing.availableTo),
    }, {
      onSuccess: (booking) => {
        setOpen(false);
        setLocation(`/booking/confirmed?id=${booking.id}`);
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          className="w-full text-lg h-12 shadow-lg shadow-primary/20 bg-gradient-to-r from-primary to-primary/90"
          data-testid="button-reserve-spot"
        >
          Reserve Spot
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Confirm Reservation</DialogTitle>
          <DialogDescription>
            You are booking <strong>{listing.title}</strong> near Hard Rock Stadium.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4 bg-muted/20 p-4 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Date</span>
            <span className="font-medium">{format(new Date(listing.availableFrom), "MMMM d, yyyy")}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Time</span>
            <span className="font-medium">
              {format(new Date(listing.availableFrom), "h:mm a")} - {format(new Date(listing.availableTo), "h:mm a")}
            </span>
          </div>
          <div className="flex justify-between items-center border-t pt-4">
            <span className="font-bold">Price</span>
            <span className="font-bold text-xl text-primary">${(listing.price / 100).toFixed(2)}</span>
          </div>
        </div>
        <div className="flex items-start gap-2 text-xs text-muted-foreground bg-muted/50 p-3 rounded-lg">
          <Info className="h-4 w-4 shrink-0 mt-0.5" />
          <p>
            By booking, you agree to our{" "}
            <Link href="/terms" className="underline hover:text-foreground">Terms of Service</Link>. 
            ParkNeighbor is not liable for any damages or losses.
          </p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} data-testid="button-cancel-booking">Cancel</Button>
          <Button onClick={handleBook} disabled={isPending} data-testid="button-confirm-booking">
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Confirm Booking
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
