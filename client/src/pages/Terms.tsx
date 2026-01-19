import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function Terms() {
  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container max-w-4xl px-4">
        <h1 className="text-4xl font-display font-bold mb-2">Terms of Service</h1>
        <p className="text-muted-foreground mb-8">Last updated: January 2026</p>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-display">1. Acceptance of Terms</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground space-y-4">
              <p>
                By accessing or using ParkNeighbor ("the Service"), you agree to be bound by these Terms of Service. 
                If you do not agree to these terms, please do not use the Service.
              </p>
              <p>
                ParkNeighbor is a marketplace platform that connects drivers seeking parking spaces with 
                property owners offering their private parking spots near Hard Rock Stadium.
              </p>
            </CardContent>
          </Card>

          <Card id="fees">
            <CardHeader>
              <CardTitle className="text-xl font-display">2. Service Fee Disclosure</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground space-y-4">
              <p>
                <strong className="text-foreground">Transaction Fee:</strong> A $4.00 service fee is added to each 
                parking reservation. This fee covers platform maintenance, payment processing, customer support, 
                and operational costs.
              </p>
              <p>
                The service fee is clearly displayed before you complete your booking. The total amount charged 
                includes both the parking price set by the host and the $4.00 service fee.
              </p>
              <p>
                All payments are processed securely through Stripe. Your payment information is never stored 
                on our servers.
              </p>
            </CardContent>
          </Card>

          <Card id="liability">
            <CardHeader>
              <CardTitle className="text-xl font-display">3. Liability Disclaimer</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground space-y-4">
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                <p className="text-foreground font-semibold mb-2">Important Notice:</p>
                <p>
                  ParkNeighbor acts solely as a marketplace platform connecting drivers with parking space providers. 
                  We do not own, operate, or maintain any parking spaces listed on our platform.
                </p>
              </div>
              
              <Separator />
              
              <div className="space-y-3">
                <h4 className="font-semibold text-foreground">ParkNeighbor is NOT liable for:</h4>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Theft, vandalism, or damage to your vehicle while parked at any listed location</li>
                  <li>Personal injury occurring on host properties</li>
                  <li>Disputes between drivers and parking space hosts</li>
                  <li>Accuracy of listing descriptions, photos, or availability</li>
                  <li>Road conditions, traffic, or access to parking locations</li>
                  <li>Weather-related damage or incidents</li>
                  <li>Violations of local parking ordinances or regulations</li>
                  <li>Towing, fines, or penalties incurred while using the Service</li>
                </ul>
              </div>

              <Separator />

              <p>
                <strong className="text-foreground">Assumption of Risk:</strong> By using ParkNeighbor, you acknowledge 
                that parking your vehicle at a private residence or property involves inherent risks. You assume full 
                responsibility for your vehicle and personal belongings.
              </p>

              <p>
                <strong className="text-foreground">Insurance:</strong> We strongly recommend that all users maintain 
                comprehensive auto insurance. ParkNeighbor does not provide insurance coverage of any kind.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-display">4. User Responsibilities</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground space-y-4">
              <div className="space-y-3">
                <h4 className="font-semibold text-foreground">As a Driver, you agree to:</h4>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Arrive and depart within your reserved time window</li>
                  <li>Respect the host's property and follow any provided instructions</li>
                  <li>Not leave any belongings, trash, or hazardous materials</li>
                  <li>Provide accurate contact and vehicle information</li>
                  <li>Report any issues or damages immediately</li>
                </ul>
              </div>

              <Separator />

              <div className="space-y-3">
                <h4 className="font-semibold text-foreground">As a Host, you agree to:</h4>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Provide accurate descriptions and photos of your parking space</li>
                  <li>Ensure the space is available during listed times</li>
                  <li>Maintain safe and accessible conditions</li>
                  <li>Comply with all local laws and homeowner association rules</li>
                  <li>Not discriminate against any driver</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-display">5. Cancellations and Refunds</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground space-y-4">
              <p>
                Cancellation and refund policies may vary. Please review the specific terms at the time of booking. 
                Service fees may be non-refundable depending on the circumstances of the cancellation.
              </p>
              <p>
                For disputes or refund requests, please contact our support team. We will review each case 
                individually and work to reach a fair resolution.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-display">6. Limitation of Liability</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground space-y-4">
              <p>
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, PARKNEIGHBOR AND ITS AFFILIATES, OFFICERS, DIRECTORS, 
                EMPLOYEES, AND AGENTS SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, 
                OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO LOSS OF PROFITS, DATA, USE, OR OTHER INTANGIBLE 
                LOSSES, RESULTING FROM YOUR USE OF THE SERVICE.
              </p>
              <p>
                In no event shall ParkNeighbor's total liability exceed the amount you paid for the specific 
                transaction giving rise to the claim.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-display">7. Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              <p>
                If you have questions about these Terms of Service, please contact us through the platform 
                or reach out to our support team.
              </p>
            </CardContent>
          </Card>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-12">
          By using ParkNeighbor, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
        </p>
      </div>
    </div>
  );
}
