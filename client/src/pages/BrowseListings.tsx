import { useState } from "react";
import { useListings } from "@/hooks/use-listings";
import { ListingCard } from "@/components/ListingCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Loader2, MapPinOff } from "lucide-react";
import { motion } from "framer-motion";

export default function BrowseListings() {
  const [inputValue, setInputValue] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const { data: listings, isLoading, isError } = useListings(searchTerm);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchTerm(inputValue);
  };

  const handleClear = () => {
    setInputValue("");
    setSearchTerm("");
  };

  return (
    <div className="min-h-screen bg-muted/20 pb-20 page-transition">
      {/* Search Header */}
      <div className="bg-background border-b sticky top-16 z-30 shadow-sm">
        <div className="container py-6">
          <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4">
            <div>
              <h1 className="text-2xl font-display font-bold" data-testid="text-find-parking-title">Find Parking</h1>
              <p className="text-muted-foreground">Available spots near Hard Rock Stadium</p>
            </div>
            
            <form onSubmit={handleSearch} className="flex w-full md:w-auto gap-2">
              <div className="relative flex-1 md:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search by address or street..." 
                  className="pl-10 h-11 rounded-xl bg-muted/50 border-transparent focus:bg-background focus:border-primary transition-all"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  data-testid="input-search"
                />
              </div>
              <Button type="submit" size="default" className="h-11 px-5 rounded-xl shadow-sm" data-testid="button-search">
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
              {searchTerm && (
                <Button type="button" variant="ghost" size="default" className="h-11 px-3 rounded-xl" onClick={handleClear} data-testid="button-clear-search">
                  Clear
                </Button>
              )}
            </form>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="container py-8">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-64 gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading spots...</p>
          </div>
        ) : isError ? (
          <div className="text-center py-20 text-destructive">
            Failed to load listings. Please try again later.
          </div>
        ) : listings?.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="bg-muted p-6 rounded-full mb-4">
              <MapPinOff className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-bold font-display">No spots found</h3>
            <p className="text-muted-foreground mt-2 max-w-sm">
              Try adjusting your search terms or check back later for new listings.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings?.map((listing, index) => (
              <motion.div
                key={listing.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <ListingCard listing={listing} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
