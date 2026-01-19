import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Car, Menu, User, LogOut, MapPin, PlusCircle } from "lucide-react";
import logoUrl from "@/assets/logo.png";

export function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const [location] = useLocation();

  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 transition-transform hover:scale-105">
          <img src={logoUrl} alt="ParkNeighbor" className="h-10 w-10 rounded-lg shadow-lg" />
          <div className="hidden sm:flex flex-col">
            <span className="font-display font-bold text-xl tracking-tight leading-tight">
              ParkNeighbor
            </span>
            <span className="text-xs text-muted-foreground italic">Park like a local</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          <Link href="/browse" className={`text-sm font-medium transition-colors hover:text-primary ${location === '/browse' ? 'text-primary' : 'text-muted-foreground'}`}>
            Find Parking
          </Link>
          <Link href="/about" className={`text-sm font-medium transition-colors hover:text-primary ${location === '/about' ? 'text-primary' : 'text-muted-foreground'}`} data-testid="link-about-nav">
            About
          </Link>
          {isAuthenticated && (
            <Link href="/bookings" className={`text-sm font-medium transition-colors hover:text-primary ${location === '/bookings' ? 'text-primary' : 'text-muted-foreground'}`}>
              My Bookings
            </Link>
          )}
        </div>

        {/* Auth Buttons */}
        <div className="flex items-center gap-4">
          {!isAuthenticated ? (
            <Button onClick={handleLogin} variant="default" className="shadow-lg shadow-primary/20">
              Login
            </Button>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/create-listing">
                <Button variant="outline" size="sm" className="hidden sm:flex gap-2">
                  <PlusCircle className="h-4 w-4" />
                  List Spot
                </Button>
              </Link>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full ring-2 ring-border hover:ring-primary/50 transition-all">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user?.profileImageUrl || ""} alt={user?.firstName || "User"} />
                      <AvatarFallback className="bg-primary/10 text-primary font-bold">
                        {user?.firstName?.[0] || <User className="h-4 w-4" />}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 rounded-xl shadow-xl border-border/50">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user?.firstName} {user?.lastName}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/browse" className="cursor-pointer">
                      <MapPin className="mr-2 h-4 w-4" /> Browse Spots
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/bookings" className="cursor-pointer">
                      <Car className="mr-2 h-4 w-4" /> My Bookings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/create-listing" className="cursor-pointer">
                      <PlusCircle className="mr-2 h-4 w-4" /> Create Listing
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => logout()} className="text-destructive focus:text-destructive cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" /> Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
