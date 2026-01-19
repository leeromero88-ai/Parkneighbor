import { useLocation } from "wouter";
import { useVerifyCheckout } from "@/hooks/use-bookings";
import { Loader2, CheckCircle, XCircle, MapPin, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";

export default function BookingSuccess() {
  const searchParams = new URLSearchParams(window.location.search);
  const sessionId = searchParams.get("session_id");
  const [, setLocation] = useLocation();
  
  const { data, isLoading, error } = useVerifyCheckout(sessionId);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <p className="text-lg text-muted-foreground">Confirming your payment...</p>
        </div>
      </div>
    );
  }

  if (error || !data?.success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-8 pb-8 text-center space-y-6">
            <XCircle className="h-16 w-16 text-destructive mx-auto" />
            <div>
              <h1 className="text-2xl font-bold mb-2">Payment Failed</h1>
              <p className="text-muted-foreground">
                {error?.message || "There was an issue processing your payment. Please try again."}
              </p>
            </div>
            <Button onClick={() => setLocation("/browse")} className="w-full" data-testid="button-browse-again">
              Browse Listings
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const booking = data.booking;

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="max-w-md w-full">
        <CardContent className="pt-8 pb-8 text-center space-y-6">
          <CheckCircle className="h-16 w-16 text-primary mx-auto" />
          <div>
            <h1 className="text-2xl font-bold mb-2" data-testid="text-booking-confirmed">Booking Confirmed!</h1>
            <p className="text-muted-foreground">
              Your parking spot has been reserved. See you at the game!
            </p>
          </div>
          
          {booking && (
            <div className="bg-muted/30 rounded-lg p-4 text-left space-y-3">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                <span className="font-medium">
                  {format(new Date(booking.startTime), "MMMM d, yyyy")}
                </span>
              </div>
              <div className="text-sm text-muted-foreground">
                {format(new Date(booking.startTime), "h:mm a")} - {format(new Date(booking.endTime), "h:mm a")}
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={() => setLocation("/browse")} className="flex-1" data-testid="button-browse-more">
              Browse More
            </Button>
            <Button onClick={() => setLocation("/bookings")} className="flex-1" data-testid="button-view-bookings">
              View Bookings
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
