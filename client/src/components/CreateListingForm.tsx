import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertListingSchema } from "@shared/schema";
import { z } from "zod";
import { useCreateListing } from "@/hooks/use-listings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, Loader2, Upload, X, ImageIcon } from "lucide-react";
import { useLocation } from "wouter";
import { useState, useRef } from "react";
import { useToast } from "@/hooks/use-toast";

const formSchema = insertListingSchema.extend({
  price: z.coerce.number().min(1, "Price must be at least $0.01"),
});

type FormValues = z.infer<typeof formSchema>;

export function CreateListingForm() {
  const [, setLocation] = useLocation();
  const { mutate, isPending } = useCreateListing();
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      address: "",
      imageUrl: "",
      price: 0,
      availableFrom: new Date(),
      availableTo: new Date(Date.now() + 86400000),
    },
  });

  const handleImageUpload = async (file: File) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.message || "Failed to upload image");
      }

      const data = await res.json();
      form.setValue("imageUrl", data.imageUrl);
      setPreviewUrl(data.imageUrl);
    } catch (error: any) {
      toast({ title: "Upload Failed", description: error.message, variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const removeImage = () => {
    form.setValue("imageUrl", "");
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const onSubmit = (data: FormValues) => {
    const apiData = {
      ...data,
      price: Math.round(data.price * 100), 
    };
    
    mutate(apiData, {
      onSuccess: () => {
        setLocation("/my-listings");
      },
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Listing Title</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. 5 min walk to Hard Rock" {...field} data-testid="input-listing-title" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price ($)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" placeholder="25.00" {...field} data-testid="input-listing-price" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input placeholder="123 Stadium Dr, Miami Gardens, FL" {...field} data-testid="input-listing-address" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Describe your spot (paved, grass, secure, etc.)" 
                  className="min-h-[100px]"
                  {...field} 
                  data-testid="input-listing-description"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="imageUrl"
          render={() => (
            <FormItem>
              <FormLabel>Photo of Your Spot</FormLabel>
              <FormControl>
                <div>
                  {previewUrl ? (
                    <div className="relative rounded-lg overflow-hidden border">
                      <img src={previewUrl} alt="Parking spot preview" className="w-full h-48 object-cover" />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 h-8 w-8 rounded-full"
                        onClick={removeImage}
                        data-testid="button-remove-image"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div
                      className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 hover:bg-muted/30 transition-colors"
                      onClick={() => fileInputRef.current?.click()}
                      data-testid="button-upload-image"
                    >
                      {uploading ? (
                        <div className="flex flex-col items-center gap-2">
                          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                          <p className="text-sm text-muted-foreground">Uploading...</p>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-2">
                          <ImageIcon className="h-8 w-8 text-muted-foreground" />
                          <p className="text-sm font-medium">Click to upload a photo</p>
                          <p className="text-xs text-muted-foreground">JPEG, PNG, WebP or GIF (max 5MB)</p>
                        </div>
                      )}
                    </div>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleImageUpload(file);
                    }}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="availableFrom"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Available From</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="availableTo"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Available To</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button 
          type="submit" 
          disabled={isPending || uploading}
          className="w-full bg-gradient-to-r from-primary to-primary/90 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30"
          data-testid="button-create-listing"
        >
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating Listing...
            </>
          ) : (
            "Create Listing"
          )}
        </Button>
      </form>
    </Form>
  );
}
