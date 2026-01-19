import { useBookings } from "@/hooks/use-bookings";
import { Loader2, CalendarClock, MapPin, CheckCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function MyBookings() {
  const { data: bookings, isLoading } = useBookings();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/20 py-12 page-transition">
      <div className="container px-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-display font-bold">My Bookings</h1>
          <Link href="/browse">
            <Button variant="outline">Find More Parking</Button>
          </Link>
        </div>

        {!bookings || bookings.length === 0 ? (
          <div className="text-center py-20 bg-background rounded-3xl border border-dashed">
            <CalendarClock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-bold">No bookings yet</h3>
            <p className="text-muted-foreground mb-6">You haven't reserved any spots yet.</p>
            <Link href="/browse">
              <Button>Browse Available Spots</Button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {bookings.map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function BookingCard({ booking }: { booking: any }) {
  const isPast = new Date(booking.endTime) < new Date();
  
  return (
    <Card className={`overflow-hidden border-l-4 ${isPast ? 'border-l-muted' : 'border-l-primary'} transition-all hover:shadow-lg`}>
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="font-bold text-lg line-clamp-1">{booking.listing.title}</h3>
            <div className="flex items-center text-muted-foreground text-sm mt-1">
              <MapPin className="h-3.5 w-3.5 mr-1" />
              <span className="truncate max-w-[200px]">{booking.listing.address}</span>
            </div>
          </div>
          <Badge variant={isPast ? "secondary" : "default"}>
            {isPast ? "Completed" : "Confirmed"}
          </Badge>
        </div>

        <div className="space-y-3 bg-muted/30 p-4 rounded-xl mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Date</span>
            <span className="font-medium">{format(new Date(booking.startTime), "MMM d, yyyy")}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Time</span>
            <span className="font-medium">
              {format(new Date(booking.startTime), "h:mm a")} - {format(new Date(booking.endTime), "h:mm a")}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex items-center gap-2 text-sm text-green-600 font-medium">
            <CheckCircle className="h-4 w-4" /> Paid
          </div>
          <Link href={`/listing/${booking.listing.id}`}>
            <Button variant="link" size="sm" className="px-0">View Spot Details</Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
