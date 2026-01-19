import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { MapPin, Car, Shield, DollarSign, Users, Clock, CheckCircle, Mail, Phone, Building } from "lucide-react";
import logoUrl from "@/assets/logo.png";

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      <section className="relative py-20 bg-gradient-to-br from-primary/10 via-background to-accent/10">
        <div className="container px-4 text-center">
          <div className="flex justify-center mb-6">
            <img src={logoUrl} alt="ParkNeighbor" className="h-20 w-20 rounded-2xl shadow-xl" />
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">About ParkNeighbor</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto italic">
            "Park like a local"
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container px-4 max-w-4xl">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-display flex items-center gap-3">
                <Building className="h-6 w-6 text-primary" />
                Our Mission
              </CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground space-y-4 text-lg">
              <p>
                ParkNeighbor is a peer-to-peer parking marketplace that connects drivers attending events 
                at Hard Rock Stadium with local homeowners offering their private parking spaces.
              </p>
              <p>
                We believe parking shouldn't be stressful, overpriced, or inconvenient. By connecting 
                neighbors with visitors, we create a win-win: drivers get affordable, convenient parking 
                while homeowners earn extra income from their unused driveways and parking spaces.
              </p>
              <p>
                Founded in Miami, Florida, ParkNeighbor is committed to building stronger connections 
                between communities and event-goers while providing a seamless, secure parking experience.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="py-16 bg-muted/30">
        <div className="container px-4">
          <h2 className="text-3xl font-display font-bold text-center mb-12">How It Works</h2>
          
          <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            <div>
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Car className="h-5 w-5 text-primary" />
                For Drivers
              </h3>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold">1</div>
                  <div>
                    <h4 className="font-semibold">Browse Available Spots</h4>
                    <p className="text-muted-foreground">Search for parking near Hard Rock Stadium and view available spots with photos, descriptions, and pricing.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold">2</div>
                  <div>
                    <h4 className="font-semibold">Book Securely</h4>
                    <p className="text-muted-foreground">Reserve your spot with our secure payment system. A $4.00 service fee is added to ensure platform quality.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold">3</div>
                  <div>
                    <h4 className="font-semibold">Park & Enjoy</h4>
                    <p className="text-muted-foreground">Arrive at your reserved spot, park with peace of mind, and enjoy the event!</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Users className="h-5 w-5 text-accent" />
                For Hosts
              </h3>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center text-accent font-bold">1</div>
                  <div>
                    <h4 className="font-semibold">List Your Space</h4>
                    <p className="text-muted-foreground">Create a listing with photos and details about your parking spot. Set your own price and availability.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center text-accent font-bold">2</div>
                  <div>
                    <h4 className="font-semibold">Accept Bookings</h4>
                    <p className="text-muted-foreground">Receive booking notifications and prepare your space for arriving drivers.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center text-accent font-bold">3</div>
                  <div>
                    <h4 className="font-semibold">Earn Money</h4>
                    <p className="text-muted-foreground">Get paid securely for each booking. Turn your unused parking space into extra income!</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container px-4">
          <h2 className="text-3xl font-display font-bold text-center mb-12">Why Choose ParkNeighbor?</h2>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="text-center">
              <CardContent className="pt-8">
                <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <DollarSign className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-bold text-lg mb-2">Affordable Prices</h3>
                <p className="text-muted-foreground">Save money compared to official stadium parking. Transparent pricing with no hidden fees.</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-8">
                <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-bold text-lg mb-2">Secure Payments</h3>
                <p className="text-muted-foreground">All transactions are processed securely through Stripe. Your payment info is never stored on our servers.</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-8">
                <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-bold text-lg mb-2">Convenient Location</h3>
                <p className="text-muted-foreground">Park closer to the action in residential areas near the stadium. Skip the crowded parking lots.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-16 bg-muted/30">
        <div className="container px-4 max-w-4xl">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-display flex items-center gap-3">
                <Mail className="h-6 w-6 text-primary" />
                Contact Us
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-muted-foreground text-lg">
                Have questions, feedback, or need support? We're here to help!
              </p>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex items-start gap-4 p-4 rounded-lg bg-background border">
                  <Mail className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <h4 className="font-semibold">Email Support</h4>
                    <p className="text-muted-foreground">support@parkneighbor.com</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 p-4 rounded-lg bg-background border">
                  <MapPin className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <h4 className="font-semibold">Location</h4>
                    <p className="text-muted-foreground">Miami, Florida</p>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <h4 className="font-semibold mb-3">Business Hours</h4>
                <p className="text-muted-foreground">Monday - Friday: 9:00 AM - 6:00 PM EST</p>
                <p className="text-muted-foreground">Game Day Support: Available during all stadium events</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="py-16">
        <div className="container px-4 text-center">
          <h2 className="text-3xl font-display font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Whether you're looking for parking or want to earn money from your driveway, ParkNeighbor makes it easy.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/browse">
              <Button size="lg" className="shadow-lg" data-testid="button-find-parking-cta">
                <Car className="mr-2 h-5 w-5" />
                Find Parking
              </Button>
            </Link>
            <Link href="/create-listing">
              <Button size="lg" variant="outline" data-testid="button-list-space-cta">
                <Users className="mr-2 h-5 w-5" />
                List Your Space
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
