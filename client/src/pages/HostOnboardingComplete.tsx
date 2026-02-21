import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, CheckCircle, AlertCircle, ArrowRight } from "lucide-react";
import { useLocation } from "wouter";

export default function HostOnboardingComplete() {
  const { isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  const { data, isLoading } = useQuery({
    queryKey: ["/api/stripe/connect/verify"],
    queryFn: async () => {
      const res = await fetch("/api/stripe/connect/verify", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to verify");
      return res.json();
    },
    enabled: isAuthenticated,
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      if (status === "active") return false;
      return 5000;
    },
  });

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="animate-spin h-8 w-8 text-primary" />
      </div>
    );
  }

  const isActive = data?.status === "active";
  const isPendingVerification = data?.status === "pending_verification";

  return (
    <div className="min-h-screen bg-muted/20 py-12 page-transition">
      <div className="container max-w-lg px-4">
        <Card className="border-border/50 shadow-xl">
          <CardContent className="p-8 text-center space-y-6">
            {isActive ? (
              <>
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
                <div>
                  <h1 className="text-2xl font-display font-bold mb-2" data-testid="text-onboarding-success">Payout Setup Complete!</h1>
                  <p className="text-muted-foreground">
                    Your bank account is connected. You'll automatically receive payments when drivers book your parking spots.
                  </p>
                </div>
                <Button
                  className="w-full h-12 shadow-lg shadow-primary/20"
                  onClick={() => setLocation("/create-listing")}
                  data-testid="button-go-create-listing"
                >
                  Create Your First Listing <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </>
            ) : isPendingVerification ? (
              <>
                <AlertCircle className="h-16 w-16 text-yellow-500 mx-auto" />
                <div>
                  <h1 className="text-2xl font-display font-bold mb-2" data-testid="text-onboarding-pending">Almost There!</h1>
                  <p className="text-muted-foreground">
                    Stripe is reviewing your information. This usually takes just a few minutes. We'll update your status automatically.
                  </p>
                </div>
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="animate-spin h-4 w-4" /> Checking status...
                </div>
              </>
            ) : (
              <>
                <AlertCircle className="h-16 w-16 text-blue-500 mx-auto" />
                <div>
                  <h1 className="text-2xl font-display font-bold mb-2">Setup Incomplete</h1>
                  <p className="text-muted-foreground">
                    It looks like you haven't finished setting up your payout account. Please complete the setup to start earning.
                  </p>
                </div>
                <Button
                  className="w-full h-12"
                  onClick={() => setLocation("/host/onboarding")}
                  data-testid="button-continue-setup"
                >
                  Continue Setup
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}