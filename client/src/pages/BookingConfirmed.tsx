import { useLocation } from "wouter";
import { useBooking } from "@/hooks/use-bookings";
import { Loader2, MapPin, Calendar, Clock, Car, Navigation, Shield, Mail, CreditCard, ChevronRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";

export default function BookingConfirmed() {
  const searchParams = new URLSearchParams(window.location.search);
  const bookingId = searchParams.get("id");
  const [, setLocation] = useLocation();
  
  const { data: booking, isLoading, error } = useBooking(bookingId ? parseInt(bookingId) : null);

  const handleNavigate = () => {
    if (!booking?.listing) return;
    
    const { latitude, longitude, address } = booking.listing;
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    
    if (latitude && longitude) {
      if (isIOS) {
        window.open(`maps://maps.apple.com/?daddr=${latitude},${longitude}`, '_blank');
      } else {
        window.open(`https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`, '_blank');
      }
    } else {
      const encodedAddress = encodeURIComponent(address);
      if (isIOS) {
        window.open(`maps://maps.apple.com/?daddr=${encodedAddress}`, '_blank');
      } else {
        window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`, '_blank');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" data-testid="spinner-loading" />
          <p className="text-lg text-muted-foreground" data-testid="text-loading-message">Loading your booking...</p>
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-8 pb-8 text-center space-y-6">
            <div className="h-16 w-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto">
              <MapPin className="h-8 w-8 text-destructive" />
            </div>
            <div>
              <h1 className="text-2xl font-bold mb-2" data-testid="text-booking-not-found">Booking Not Found</h1>
              <p className="text-muted-foreground">
                We couldn't find this booking. It may have been cancelled or doesn't exist.
              </p>
            </div>
            <Button onClick={() => setLocation("/bookings")} className="w-full" data-testid="button-view-all-bookings">
              View All Bookings
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const listing = booking.listing;
  const bgImage = listing.imageUrl || "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=800&auto=format&fit=crop&q=80";

  return (
    <div className="min-h-screen bg-background pb-12">
      <div className="container max-w-lg mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-3xl font-bold font-display mb-2" data-testid="text-booking-confirmed">
            Booking Confirmed!
          </h1>
          <p className="text-muted-foreground text-lg" data-testid="text-booking-subtitle">
            Your parking spot is reserved and ready for you.
          </p>
        </div>

        <Card className="mb-6 overflow-hidden">
          <CardContent className="p-0">
            <div className="bg-primary/5 p-5 border-b">
              <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Car className="h-5 w-5 text-primary" />
                Parking Spot Details
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Address</p>
                    <p className="font-medium" data-testid="text-booking-address">{listing.address}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Date</p>
                    <p className="font-medium" data-testid="text-booking-date">
                      {format(new Date(booking.startTime), "EEEE, MMMM d, yyyy")}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Time Window</p>
                    <p className="font-medium" data-testid="text-booking-time">
                      {format(new Date(booking.startTime), "h:mm a")} - {format(new Date(booking.endTime), "h:mm a")}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Car className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Spot Type</p>
                    <p className="font-medium" data-testid="text-booking-type">{listing.title}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-5">
              <Button 
                onClick={handleNavigate} 
                className="w-full h-14 text-lg shadow-lg shadow-primary/20"
                data-testid="button-navigate"
              >
                <Navigation className="mr-2 h-5 w-5" />
                Navigate to Parking Spot
              </Button>
            </div>
          </CardContent>
        </Card>

        {listing.imageUrl && (
          <Card className="mb-6 overflow-hidden">
            <CardContent className="p-5">
              <h2 className="font-bold text-lg mb-4">What the spot looks like</h2>
              <div className="rounded-xl overflow-hidden">
                <img 
                  src={bgImage} 
                  alt="Parking spot" 
                  className="w-full h-48 object-cover"
                  data-testid="img-parking-spot"
                />
              </div>
            </CardContent>
          </Card>
        )}

        {listing.description && (
          <Card className="mb-6">
            <CardContent className="p-5">
              <h2 className="font-bold text-lg mb-3 flex items-center gap-2">
                <Shield className="h-5 w-5 text-accent" />
                Parking Instructions
              </h2>
              <p className="text-muted-foreground leading-relaxed" data-testid="text-parking-instructions">
                {listing.description}
              </p>
            </CardContent>
          </Card>
        )}

        <Card className="mb-6 bg-primary/5 border-primary/20">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-primary shrink-0" />
              <p className="text-sm" data-testid="text-reminder-message">
                You'll receive a reminder before your parking time starts.
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-3 text-center text-sm text-muted-foreground mb-8">
          <div className="flex items-center justify-center gap-2">
            <CreditCard className="h-4 w-4" />
            <span data-testid="text-stripe-trust">Secure payment processed by Stripe</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <Mail className="h-4 w-4" />
            <span data-testid="text-email-trust">Confirmation sent to your email</span>
          </div>
        </div>

        <Button 
          variant="outline" 
          onClick={() => setLocation("/bookings")} 
          className="w-full h-12"
          data-testid="button-view-my-bookings"
        >
          View My Bookings
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
