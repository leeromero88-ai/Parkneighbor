import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { ArrowRight, MapPin, ShieldCheck, DollarSign } from "lucide-react";
import { motion } from "framer-motion";
import logoUrl from "@/assets/logo.png";
import heroParkingUrl from "@/assets/hero-parking.jpg";

export default function Landing() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-background pt-16 md:pt-20 lg:pt-32 pb-16">
        <div className="container px-4 md:px-6 relative z-10">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col gap-6"
            >
              <div className="inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium bg-muted/50 backdrop-blur">
                <img src={logoUrl} alt="ParkNeighbor" className="h-5 w-5 mr-2 rounded" />
                ParkNeighbor
              </div>
              <h1 className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl xl:text-7xl">
                Parking near <span className="text-primary">Hard Rock</span> made easy.
              </h1>
              <p className="max-w-[600px] text-muted-foreground text-lg sm:text-xl leading-relaxed">
                Skip the stadium traffic and overpriced lots. Book guaranteed parking spots from trusted neighbors walking distance to the game.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mt-4">
                {isAuthenticated ? (
                  <Link href="/browse">
                    <Button size="lg" className="text-lg px-8 h-14 rounded-xl shadow-xl shadow-primary/20 hover:shadow-2xl hover:translate-y-[-2px] transition-all" data-testid="button-find-parking">
                      Find Parking Now
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                ) : (
                  <Button size="lg" className="text-lg px-8 h-14 rounded-xl shadow-xl shadow-primary/20 hover:shadow-2xl hover:translate-y-[-2px] transition-all" data-testid="button-login-hero" onClick={() => { window.location.href = "/api/login"; }}>
                    Login to Start
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                )}
                {!isAuthenticated && (
                  <Link href="/browse">
                    <Button variant="outline" size="lg" className="text-lg px-8 h-14 rounded-xl">
                      Browse Spots
                    </Button>
                  </Link>
                )}
              </div>
            </motion.div>

            {/* Abstract visual */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative mx-auto aspect-square w-full max-w-[500px] lg:max-w-none"
            >
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-primary to-accent blur-[100px] opacity-20 animate-pulse" />
              {/* Stadium aerial parking lot */}
              <img
                src={heroParkingUrl}
                alt="Parking Lot"
                className="relative rounded-3xl shadow-2xl border-4 border-background object-cover w-full h-full rotate-3 hover:rotate-0 transition-all duration-500"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-muted/30">
        <div className="container px-4 md:px-6">
          <div className="grid gap-8 md:grid-cols-3">
            <FeatureCard 
              icon={<DollarSign className="h-10 w-10 text-primary" />}
              title="Save Money"
              description="Find spots up to 50% cheaper than official stadium parking lots."
            />
            <FeatureCard 
              icon={<ShieldCheck className="h-10 w-10 text-accent" />}
              title="Guaranteed Spot"
              description="Book in advance. Your spot is reserved solely for you."
            />
            <FeatureCard 
              icon={<MapPin className="h-10 w-10 text-destructive" />}
              title="Beat the Traffic"
              description="Park in neighborhoods with easier exit routes after the game."
            />
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="flex flex-col items-center text-center p-6 bg-background rounded-2xl shadow-sm border border-border/50 hover:shadow-lg transition-all">
      <div className="mb-4 p-3 bg-muted rounded-xl">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-2 font-display">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}
