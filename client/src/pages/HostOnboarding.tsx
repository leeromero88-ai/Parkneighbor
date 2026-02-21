import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, CheckCircle, AlertCircle, ExternalLink, Banknote, ShieldCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLocation, useSearch } from "wouter";

export default function HostOnboarding() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const search = useSearch();
  const isRefresh = new URLSearchParams(search).get("refresh") === "true";

  const { data: connectStatus, isLoading: statusLoading, refetch } = useQuery({
    queryKey: ["/api/stripe/connect/status"],
    queryFn: async () => {
      const res = await fetch("/api/stripe/connect/status", { credentials: "include" });
      if (res.status === 401) return null;
      if (!res.ok) throw new Error("Failed to get status");
      return res.json();
    },
    enabled: isAuthenticated,
  });

  const createAccountMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/stripe/connect/create-account", {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.message || "Failed to start onboarding");
      }
      return res.json();
    },
    onSuccess: (data) => {
      if (data.alreadyActive) {
        toast({ title: "Already Set Up", description: "Your payout account is already active." });
        refetch();
      } else if (data.url) {
        window.location.href = data.url;
      }
    },
    onError: (error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  if (authLoading || statusLoading) {
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
          <h1 className="text-2xl font-bold mb-4">Set Up Payouts</h1>
          <p className="text-muted-foreground mb-6">Please log in to set up your payout account.</p>
          <Button onClick={() => window.location.href = "/api/login"} data-testid="button-login-onboarding">
            Log In
          </Button>
        </div>
      </div>
    );
  }

  const status = connectStatus?.stripeAccountStatus || "not_started";

  return (
    <div className="min-h-screen bg-muted/20 py-12 page-transition">
      <div className="container max-w-2xl px-4">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-display font-bold mb-2">Host Payout Setup</h1>
          <p className="text-muted-foreground">
            {isRefresh
              ? "Your onboarding session expired. Please continue setting up your payout account."
              : "Connect your bank account to receive payments when drivers book your parking spot."}
          </p>
        </div>

        <Card className="border-border/50 shadow-xl mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Banknote className="h-5 w-5 text-primary" />
              Payout Account Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
              <span className="font-medium">Account Status</span>
              {status === "active" && (
                <Badge className="bg-green-500/10 text-green-600 border-green-500/20" data-testid="badge-status-active">
                  <CheckCircle className="h-3.5 w-3.5 mr-1" /> Active
                </Badge>
              )}
              {status === "pending_verification" && (
                <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20" data-testid="badge-status-pending">
                  <AlertCircle className="h-3.5 w-3.5 mr-1" /> Pending Verification
                </Badge>
              )}
              {status === "pending" && (
                <Badge variant="secondary" className="bg-blue-500/10 text-blue-600 border-blue-500/20" data-testid="badge-status-incomplete">
                  <AlertCircle className="h-3.5 w-3.5 mr-1" /> Incomplete
                </Badge>
              )}
              {status === "not_started" && (
                <Badge variant="outline" data-testid="badge-status-not-started">Not Started</Badge>
              )}
            </div>

            {status === "active" ? (
              <div className="text-center space-y-4">
                <div className="p-4 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800">
                  <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                  <p className="font-semibold text-green-700 dark:text-green-400">Your payout account is active!</p>
                  <p className="text-sm text-green-600 dark:text-green-500 mt-1">
                    You'll automatically receive payments when drivers book your spots.
                  </p>
                </div>
                <Button variant="outline" onClick={() => setLocation("/create-listing")} data-testid="button-create-listing">
                  Create a Listing
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3 text-sm">
                    <ShieldCheck className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">Secure & Private</p>
                      <p className="text-muted-foreground">Your banking details are handled securely by Stripe. We never see your account numbers.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 text-sm">
                    <Banknote className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">Automatic Payouts</p>
                      <p className="text-muted-foreground">When a driver books your spot, the payment goes directly to your bank account (minus the $4.00 service fee).</p>
                    </div>
                  </div>
                </div>

                <Button
                  className="w-full h-12 text-lg shadow-lg shadow-primary/20 bg-gradient-to-r from-primary to-primary/90"
                  onClick={() => createAccountMutation.mutate()}
                  disabled={createAccountMutation.isPending}
                  data-testid="button-setup-payouts"
                >
                  {createAccountMutation.isPending ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Setting Up...</>
                  ) : status === "pending" ? (
                    <><ExternalLink className="mr-2 h-4 w-4" /> Continue Setup</>
                  ) : (
                    <><ExternalLink className="mr-2 h-4 w-4" /> Set Up Payouts</>
                  )}
                </Button>

                {status === "pending_verification" && (
                  <p className="text-sm text-center text-muted-foreground">
                    Stripe is reviewing your information. This usually takes a few minutes.
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}