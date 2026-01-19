import { CreateListingForm } from "@/components/CreateListingForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function CreateListing() {
  return (
    <div className="min-h-screen bg-muted/20 py-12 page-transition">
      <div className="container max-w-2xl px-4">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-display font-bold mb-2">List Your Parking Spot</h1>
          <p className="text-muted-foreground">Earn money by renting your driveway to fans.</p>
        </div>
        
        <Card className="border-border/50 shadow-xl">
          <CardHeader>
            <CardTitle>Listing Details</CardTitle>
          </CardHeader>
          <CardContent>
            <CreateListingForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
