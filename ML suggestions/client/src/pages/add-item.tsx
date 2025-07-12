import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { z } from "zod";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest } from "@/lib/queryClient";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  category: z.string().min(1, "Category is required"),
  type: z.string().min(1, "Type is required"),
  size: z.string().min(1, "Size is required"),
  condition: z.string().min(1, "Condition is required"),
  color: z.string().optional(),
  brand: z.string().optional(),
  tags: z.array(z.string()).optional(),
  isDonation: z.boolean().default(false),
});

type FormData = z.infer<typeof formSchema>;

export default function AddItem() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [newTag, setNewTag] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "",
      type: "",
      size: "",
      condition: "",
      color: "",
      brand: "",
      tags: [],
      isDonation: false,
    },
  });

  const analyzeMutation = useMutation({
    mutationFn: async (data: { title: string; description: string }) => {
      const response = await apiRequest('POST', '/api/items/analyze', data);
      return response.json();
    },
    onSuccess: (data) => {
      form.setValue('category', data.suggestedCategory);
      form.setValue('type', data.suggestedType);
      form.setValue('color', data.suggestedColor);
      form.setValue('tags', data.suggestedTags);
      
      toast({
        title: "AI Analysis Complete",
        description: `Confidence: ${Math.round(data.confidence * 100)}%`,
      });
    },
    onError: (error) => {
      console.error('Analysis error:', error);
      toast({
        title: "Analysis Failed",
        description: "Unable to analyze item. Please fill in details manually.",
        variant: "destructive",
      });
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await apiRequest('POST', '/api/items', data);
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Item Listed Successfully",
        description: `You've earned 10 points! ${data.isDonation ? 'Thank you for your donation!' : 'Your item is pending approval.'}`,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/auth/user'] });
      setLocation('/dashboard');
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to create item. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleAIAnalysis = async () => {
    const title = form.getValues('title');
    const description = form.getValues('description');
    
    if (!title && !description) {
      toast({
        title: "Error",
        description: "Please enter a title or description first.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    await analyzeMutation.mutateAsync({ title, description });
    setIsAnalyzing(false);
  };

  const addTag = () => {
    if (newTag.trim()) {
      const currentTags = form.getValues('tags') || [];
      form.setValue('tags', [...currentTags, newTag.trim()]);
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    const currentTags = form.getValues('tags') || [];
    form.setValue('tags', currentTags.filter(tag => tag !== tagToRemove));
  };

  const onSubmit = (data: FormData) => {
    createMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-warm-white">
      <Navbar />
      
      <div className="pt-24 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-charcoal mb-4">
              List Your Item
            </h1>
            <p className="text-xl text-charcoal/80">
              Share your style with the community and earn points
            </p>
          </div>

          <Card className="bg-white shadow-lg border-sage/20">
            <CardHeader>
              <CardTitle className="text-2xl text-forest">
                <i className="fas fa-plus mr-2"></i>
                Add New Item
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  {/* AI Analysis Section */}
                  <div className="bg-gradient-to-r from-sage/10 to-forest/10 rounded-2xl p-6">
                    <h3 className="text-lg font-semibold text-charcoal mb-4">
                      <i className="fas fa-robot mr-2 text-forest"></i>
                      AI-Powered Analysis
                    </h3>
                    <p className="text-charcoal/70 mb-4">
                      Let our AI help categorize your item and suggest tags based on the title and description.
                    </p>
                    <Button
                      type="button"
                      onClick={handleAIAnalysis}
                      disabled={isAnalyzing || analyzeMutation.isPending}
                      className="gradient-forest-sage text-white"
                    >
                      {isAnalyzing || analyzeMutation.isPending ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-magic mr-2"></i>
                          Analyze Item
                        </>
                      )}
                    </Button>
                  </div>

                  {/* Basic Information */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title *</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Vintage Leather Jacket" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="brand"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Brand</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Zara, H&M, Nike" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Describe your item's style, fit, and any special features..."
                            rows={4}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Category and Type */}
                  <div className="grid md:grid-cols-3 gap-6">
                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category *</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Men">Men</SelectItem>
                              <SelectItem value="Women">Women</SelectItem>
                              <SelectItem value="Kids">Kids</SelectItem>
                              <SelectItem value="Unisex">Unisex</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Type *</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Shirt">Shirt</SelectItem>
                              <SelectItem value="T-Shirt">T-Shirt</SelectItem>
                              <SelectItem value="Blouse">Blouse</SelectItem>
                              <SelectItem value="Dress">Dress</SelectItem>
                              <SelectItem value="Pants">Pants</SelectItem>
                              <SelectItem value="Jeans">Jeans</SelectItem>
                              <SelectItem value="Shorts">Shorts</SelectItem>
                              <SelectItem value="Skirt">Skirt</SelectItem>
                              <SelectItem value="Jacket">Jacket</SelectItem>
                              <SelectItem value="Coat">Coat</SelectItem>
                              <SelectItem value="Sweater">Sweater</SelectItem>
                              <SelectItem value="Hoodie">Hoodie</SelectItem>
                              <SelectItem value="Shoes">Shoes</SelectItem>
                              <SelectItem value="Boots">Boots</SelectItem>
                              <SelectItem value="Sneakers">Sneakers</SelectItem>
                              <SelectItem value="Sandals">Sandals</SelectItem>
                              <SelectItem value="Accessories">Accessories</SelectItem>
                              <SelectItem value="Belt">Belt</SelectItem>
                              <SelectItem value="Bag">Bag</SelectItem>
                              <SelectItem value="Hat">Hat</SelectItem>
                              <SelectItem value="Scarf">Scarf</SelectItem>
                              <SelectItem value="Jewelry">Jewelry</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="color"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Color</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select color" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Black">Black</SelectItem>
                              <SelectItem value="White">White</SelectItem>
                              <SelectItem value="Gray">Gray</SelectItem>
                              <SelectItem value="Navy">Navy</SelectItem>
                              <SelectItem value="Blue">Blue</SelectItem>
                              <SelectItem value="Red">Red</SelectItem>
                              <SelectItem value="Pink">Pink</SelectItem>
                              <SelectItem value="Green">Green</SelectItem>
                              <SelectItem value="Yellow">Yellow</SelectItem>
                              <SelectItem value="Orange">Orange</SelectItem>
                              <SelectItem value="Purple">Purple</SelectItem>
                              <SelectItem value="Brown">Brown</SelectItem>
                              <SelectItem value="Beige">Beige</SelectItem>
                              <SelectItem value="Cream">Cream</SelectItem>
                              <SelectItem value="Multicolor">Multicolor</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Size and Condition */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="size"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Size *</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., S, M, L, XL, 32, 8" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="condition"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Condition *</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select condition" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="New">New</SelectItem>
                              <SelectItem value="Like New">Like New</SelectItem>
                              <SelectItem value="Good">Good</SelectItem>
                              <SelectItem value="Fair">Fair</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Tags */}
                  <div>
                    <FormLabel>Tags</FormLabel>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {(form.getValues('tags') || []).map((tag, index) => (
                        <Badge 
                          key={index} 
                          variant="secondary" 
                          className="bg-sage/20 text-forest cursor-pointer"
                          onClick={() => removeTag(tag)}
                        >
                          {tag} ×
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Input 
                        placeholder="Add a tag..." 
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                      />
                      <Button type="button" onClick={addTag} variant="outline" className="border-sage text-sage">
                        Add
                      </Button>
                    </div>
                  </div>

                  {/* Donation Toggle */}
                  <div className="bg-gradient-to-r from-gold/10 to-terracotta/10 rounded-2xl p-6">
                    <FormField
                      control={form.control}
                      name="isDonation"
                      render={({ field }) => (
                        <FormItem className="flex items-center space-x-3">
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="flex-1">
                            <FormLabel className="text-lg font-semibold text-charcoal">
                              <i className="fas fa-heart mr-2 text-rose-gold"></i>
                              Donate this item
                            </FormLabel>
                            <p className="text-sm text-charcoal/70 mt-1">
                              Make this item available for free to help others in need. You'll earn 20 points for your generosity!
                            </p>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="flex gap-4 pt-6">
                    <Button
                      type="submit"
                      disabled={createMutation.isPending}
                      className="flex-1 gradient-forest-sage text-white py-3 rounded-full hover:shadow-lg transition-all duration-300"
                      size="lg"
                    >
                      {createMutation.isPending ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          Creating Item...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-plus mr-2"></i>
                          {form.getValues('isDonation') ? 'Donate Item' : 'List Item'}
                        </>
                      )}
                    </Button>
                    
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setLocation('/dashboard')}
                      className="border-sage text-sage hover:bg-sage/10"
                      size="lg"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
