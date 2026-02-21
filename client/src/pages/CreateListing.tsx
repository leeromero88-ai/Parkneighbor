import { CreateListingForm } from "@/components/CreateListingForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { AlertCircle, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

export default function CreateListing() {
  const { isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  const { data: connectStatus } = useQuery({
    queryKey: ["/api/stripe/connect/status"],
    queryFn: async () => {
      const res = await fetch("/api/stripe/connect/status", { credentials: "include" });
      if (res.status === 401) return null;
      if (!res.ok) throw new Error("Failed to get status");
      return res.json();
    },
    enabled: isAuthenticated,
  });

  const payoutsActive = connectStatus?.stripeAccountStatus === "active";

  return (
    <div className="min-h-screen bg-muted/20 py-12 page-transition">
      <div className="container max-w-2xl px-4">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-display font-bold mb-2">List Your Parking Spot</h1>
          <p className="text-muted-foreground">Earn money by renting your driveway to fans.</p>
        </div>

        {isAuthenticated && !payoutsActive && (
          <Card className="mb-6 border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-950/20">
            <CardContent className="p-4 flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <AlertCircle className="h-5 w-5 text-yellow-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-medium text-yellow-800 dark:text-yellow-400">Set up payouts first</p>
                <p className="text-sm text-yellow-600 dark:text-yellow-500">
                  You can create a listing now, but drivers won't be able to book until you connect your bank account.
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="border-yellow-300 hover:bg-yellow-100 dark:border-yellow-700 dark:hover:bg-yellow-900/30 shrink-0"
                onClick={() => setLocation("/host/onboarding")}
                data-testid="button-setup-payouts-banner"
              >
                <ExternalLink className="mr-1.5 h-3.5 w-3.5" /> Set Up Payouts
              </Button>
            </CardContent>
          </Card>
        )}
        
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
