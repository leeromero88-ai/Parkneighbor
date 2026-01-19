import { Link } from "wouter";
import logoPath from "@/assets/logo.png";

export function Footer() {
  return (
    <footer className="bg-muted/30 border-t py-8 mt-auto">
      <div className="container px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <img src={logoPath} alt="ParkNeighbor" className="h-8 w-8" />
            <div className="flex flex-col">
              <span className="font-display font-bold text-lg leading-tight">ParkNeighbor</span>
              <span className="text-xs text-muted-foreground italic">Park like a local</span>
            </div>
          </div>
          
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <Link href="/terms" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-terms">
              Terms of Service
            </Link>
            <Link href="/terms#liability" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-liability">
              Liability Disclaimer
            </Link>
            <Link href="/terms#fees" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-fees">
              Service Fees
            </Link>
          </div>
        </div>
        
        <div className="mt-6 pt-6 border-t text-center text-xs text-muted-foreground">
          <p className="mb-2">
            ParkNeighbor is a marketplace platform. We do not own or operate any parking spaces.
          </p>
          <p>
            A $4.00 service fee applies to all bookings. See our <Link href="/terms" className="underline hover:text-foreground">Terms of Service</Link> for details.
          </p>
        </div>
      </div>
    </footer>
  );
}
