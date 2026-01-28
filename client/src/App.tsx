import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import Landing from "@/pages/Landing";
import BrowseListings from "@/pages/BrowseListings";
import ListingDetails from "@/pages/ListingDetails";
import CreateListing from "@/pages/CreateListing";
import MyBookings from "@/pages/MyBookings";
import BookingSuccess from "@/pages/BookingSuccess";
import BookingConfirmed from "@/pages/BookingConfirmed";
import Terms from "@/pages/Terms";
import About from "@/pages/About";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <Switch>
          <Route path="/" component={Landing} />
          <Route path="/browse" component={BrowseListings} />
          <Route path="/listing/:id" component={ListingDetails} />
          <Route path="/create-listing" component={CreateListing} />
          <Route path="/bookings" component={MyBookings} />
          <Route path="/booking/success" component={BookingSuccess} />
          <Route path="/booking/confirmed" component={BookingConfirmed} />
          <Route path="/terms" component={Terms} />
          <Route path="/about" component={About} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
