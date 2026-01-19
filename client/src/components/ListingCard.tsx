import { Link } from "wouter";
import { format } from "date-fns";
import { MapPin, Calendar, ArrowRight } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Listing } from "@shared/schema";

interface ListingCardProps {
  listing: Listing;
}

export function ListingCard({ listing }: ListingCardProps) {
  // Use Unsplash fallback if no image
  const bgImage = listing.imageUrl || "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=800&auto=format&fit=crop&q=60";

  return (
    <Card className="group overflow-hidden rounded-2xl border-border/50 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      <div className="relative h-48 overflow-hidden">
        {/* Parking lot / Stadium view */}
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
          style={{ backgroundImage: `url(${bgImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        
        <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
          <Badge className="bg-white/90 text-foreground hover:bg-white backdrop-blur-sm font-bold shadow-sm">
            ${(listing.price / 100).toFixed(2)} / game
          </Badge>
        </div>
      </div>

      <CardHeader className="p-5 pb-2">
        <h3 className="font-display text-lg font-bold line-clamp-1 group-hover:text-primary transition-colors">
          {listing.title}
        </h3>
        <div className="flex items-center text-muted-foreground text-sm gap-1.5 pt-1">
          <MapPin className="h-3.5 w-3.5 shrink-0" />
          <span className="truncate">{listing.address}</span>
        </div>
      </CardHeader>

      <CardContent className="p-5 pt-2 pb-4">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {listing.description}
        </p>
        
        <div className="mt-4 flex items-center gap-2 text-xs font-medium text-muted-foreground/80 bg-muted/50 p-2 rounded-lg">
          <Calendar className="h-3.5 w-3.5" />
          <span>Next avail: {format(new Date(listing.availableFrom), "MMM d, h:mm a")}</span>
        </div>
      </CardContent>

      <CardFooter className="p-5 pt-0">
        <Link href={`/listing/${listing.id}`} className="w-full">
          <Button className="w-full shadow-lg shadow-primary/10 group-hover:shadow-primary/20">
            View Details <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
