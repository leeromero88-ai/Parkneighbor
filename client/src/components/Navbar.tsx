import { useState } from "react";
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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Car, Menu, User, LogOut, MapPin, PlusCircle, X, Info, Banknote } from "lucide-react";
import logoUrl from "@/assets/logo.png";

export function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

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
          <Link href="/browse" className={`text-sm font-medium transition-colors hover:text-primary ${location === '/browse' ? 'text-primary' : 'text-muted-foreground'}`} data-testid="link-browse-nav">
            Find Parking
          </Link>
          <Link href="/about" className={`text-sm font-medium transition-colors hover:text-primary ${location === '/about' ? 'text-primary' : 'text-muted-foreground'}`} data-testid="link-about-nav">
            About
          </Link>
          {isAuthenticated && (
            <Link href="/bookings" className={`text-sm font-medium transition-colors hover:text-primary ${location === '/bookings' ? 'text-primary' : 'text-muted-foreground'}`} data-testid="link-bookings-nav">
              My Bookings
            </Link>
          )}
        </div>

        {/* Right side: Auth + Mobile menu */}
        <div className="flex items-center gap-2">
          {/* Desktop Auth */}
          <div className="hidden md:flex items-center gap-4">
            {!isAuthenticated ? (
              <Button onClick={handleLogin} variant="default" className="shadow-lg shadow-primary/20" data-testid="button-login-nav">
                Login
              </Button>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/create-listing">
                  <Button variant="outline" size="sm" className="hidden sm:flex gap-2" data-testid="button-list-spot">
                    <PlusCircle className="h-4 w-4" />
                    List Spot
                  </Button>
                </Link>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full ring-2 ring-border hover:ring-primary/50 transition-all" data-testid="button-user-menu">
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
                        <p className="text-sm font-medium leading-none" data-testid="text-user-name">{user?.firstName} {user?.lastName}</p>
                        <p className="text-xs leading-none text-muted-foreground" data-testid="text-user-email">{user?.email}</p>
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
                    <DropdownMenuItem asChild>
                      <Link href="/host/onboarding" className="cursor-pointer">
                        <Banknote className="mr-2 h-4 w-4" /> Set Up Payouts
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => logout()} className="text-destructive focus:text-destructive cursor-pointer" data-testid="button-logout">
                      <LogOut className="mr-2 h-4 w-4" /> Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Menu */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden" data-testid="button-mobile-menu">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] sm:w-[320px] p-0">
              <SheetHeader className="p-6 pb-4 border-b">
                <SheetTitle className="flex items-center gap-2">
                  <img src={logoUrl} alt="ParkNeighbor" className="h-8 w-8 rounded-lg" />
                  <span className="font-display font-bold text-lg">ParkNeighbor</span>
                </SheetTitle>
              </SheetHeader>

              <div className="flex flex-col py-4">
                {isAuthenticated && user && (
                  <div className="px-6 py-4 mb-2 bg-muted/50">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={user.profileImageUrl || ""} alt={user.firstName || "User"} />
                        <AvatarFallback className="bg-primary/10 text-primary font-bold">
                          {user.firstName?.[0] || <User className="h-4 w-4" />}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium" data-testid="text-mobile-user-name">{user.firstName} {user.lastName}</span>
                        <span className="text-xs text-muted-foreground" data-testid="text-mobile-user-email">{user.email}</span>
                      </div>
                    </div>
                  </div>
                )}

                <SheetClose asChild>
                  <Link href="/browse" className={`flex items-center gap-3 px-6 py-3 text-sm font-medium transition-colors hover:bg-muted ${location === '/browse' ? 'text-primary bg-primary/5' : ''}`} data-testid="link-mobile-browse">
                    <MapPin className="h-5 w-5" />
                    Find Parking
                  </Link>
                </SheetClose>

                <SheetClose asChild>
                  <Link href="/about" className={`flex items-center gap-3 px-6 py-3 text-sm font-medium transition-colors hover:bg-muted ${location === '/about' ? 'text-primary bg-primary/5' : ''}`} data-testid="link-mobile-about">
                    <Info className="h-5 w-5" />
                    About
                  </Link>
                </SheetClose>

                {isAuthenticated && (
                  <>
                    <SheetClose asChild>
                      <Link href="/bookings" className={`flex items-center gap-3 px-6 py-3 text-sm font-medium transition-colors hover:bg-muted ${location === '/bookings' ? 'text-primary bg-primary/5' : ''}`} data-testid="link-mobile-bookings">
                        <Car className="h-5 w-5" />
                        My Bookings
                      </Link>
                    </SheetClose>

                    <SheetClose asChild>
                      <Link href="/create-listing" className={`flex items-center gap-3 px-6 py-3 text-sm font-medium transition-colors hover:bg-muted ${location === '/create-listing' ? 'text-primary bg-primary/5' : ''}`} data-testid="link-mobile-create">
                        <PlusCircle className="h-5 w-5" />
                        List Your Spot
                      </Link>
                    </SheetClose>

                    <SheetClose asChild>
                      <Link href="/host/onboarding" className={`flex items-center gap-3 px-6 py-3 text-sm font-medium transition-colors hover:bg-muted ${location === '/host/onboarding' ? 'text-primary bg-primary/5' : ''}`} data-testid="link-mobile-payouts">
                        <Banknote className="h-5 w-5" />
                        Set Up Payouts
                      </Link>
                    </SheetClose>
                  </>
                )}

                <div className="border-t mt-4 pt-4 px-6">
                  {!isAuthenticated ? (
                    <Button onClick={() => { setMobileOpen(false); handleLogin(); }} variant="default" className="w-full shadow-lg shadow-primary/20" data-testid="button-mobile-login">
                      Login
                    </Button>
                  ) : (
                    <Button onClick={() => { setMobileOpen(false); logout(); }} variant="outline" className="w-full text-destructive hover:text-destructive hover:bg-destructive/10" data-testid="button-mobile-logout">
                      <LogOut className="mr-2 h-4 w-4" />
                      Log out
                    </Button>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
