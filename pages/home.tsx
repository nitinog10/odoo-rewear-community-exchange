import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { fashionPreferencesSchema, type FashionPreferences, type Recommendation } from "@shared/schema";
import { Shirt, User, Star, Heart, Share, RotateCcw, Sparkles, Loader2, Palette } from "lucide-react";

interface RecommendationResponse {
  profile: any;
  recommendations: Recommendation[];
}

export default function Home() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const { toast } = useToast();

  const form = useForm<FashionPreferences>({
    resolver: zodResolver(fashionPreferencesSchema),
    defaultValues: {
      gender: undefined,
      bodyType: "",
      skinTone: undefined,
      occasion: undefined,
      season: undefined,
      colorPreferences: "",
      stylePreferences: "",
    },
  });

  const generateRecommendations = useMutation({
    mutationFn: async (data: FashionPreferences): Promise<RecommendationResponse> => {
      const response = await apiRequest("POST", "/api/recommendations", data);
      return response.json();
    },
    onSuccess: (data) => {
      setRecommendations(data.recommendations);
      toast({
        title: "Recommendations Generated!",
        description: "Your personalized fashion recommendations are ready.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to generate recommendations. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: FashionPreferences) => {
    generateRecommendations.mutate(data);
  };

  const genderOptions = [
    { value: "woman", label: "Woman", icon: "♀" },
    { value: "man", label: "Man", icon: "♂" },
    { value: "non-binary", label: "Non-binary", icon: "⚪" },
  ];

  const seasonOptions = [
    { value: "spring", label: "Spring", icon: "🌱" },
    { value: "summer", label: "Summer", icon: "☀️" },
    { value: "fall", label: "Fall", icon: "🍂" },
    { value: "winter", label: "Winter", icon: "❄️" },
  ];

  const femaleBodyTypes = [
    { value: "pear", label: "Pear - Wider hips than shoulders" },
    { value: "apple", label: "Apple - Fuller midsection" },
    { value: "hourglass", label: "Hourglass - Balanced shoulders and hips" },
    { value: "rectangle", label: "Rectangle - Straight up and down" },
    { value: "inverted-triangle", label: "Inverted Triangle - Broader shoulders" },
    { value: "athletic", label: "Athletic - Muscular build" },
  ];

  const maleBodyTypes = [
    { value: "ectomorph", label: "Ectomorph - Lean and slender" },
    { value: "mesomorph", label: "Mesomorph - Muscular and athletic" },
    { value: "endomorph", label: "Endomorph - Broader and stockier" },
    { value: "rectangle", label: "Rectangle - Straight torso" },
    { value: "inverted-triangle", label: "Inverted Triangle - Broad shoulders" },
    { value: "oval", label: "Oval - Fuller midsection" },
  ];

  const nonBinaryBodyTypes = [
    ...femaleBodyTypes,
    ...maleBodyTypes.filter(type => !femaleBodyTypes.some(f => f.value === type.value))
  ];

  const selectedGender = form.watch("gender");
  const getBodyTypeOptions = () => {
    switch (selectedGender) {
      case "woman": return femaleBodyTypes;
      case "man": return maleBodyTypes;
      case "non-binary": return nonBinaryBodyTypes;
      default: return [];
    }
  };

  const colorOptions = [
    { value: "neutral", label: "Neutral (Black, White, Gray, Beige)" },
    { value: "warm", label: "Warm Tones (Red, Orange, Yellow, Brown)" },
    { value: "cool", label: "Cool Tones (Blue, Green, Purple, Silver)" },
    { value: "earth", label: "Earth Tones (Tan, Olive, Rust, Camel)" },
    { value: "pastels", label: "Pastels (Pink, Lavender, Mint, Cream)" },
    { value: "jewel", label: "Jewel Tones (Emerald, Sapphire, Ruby, Amethyst)" },
    { value: "monochrome", label: "Monochrome (Black & White only)" },
    { value: "bold", label: "Bold & Bright (Neon, Electric colors)" },
    { value: "vintage", label: "Vintage (Mustard, Burgundy, Forest Green)" },
    { value: "seasonal", label: "Seasonal Colors (based on current season)" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Shirt className="w-8 h-8 text-fashion-pink mr-3" />
              <h1 className="text-2xl font-bold text-charcoal">Rewear</h1>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#" className="text-gray-600 hover:text-fashion-pink transition-colors">Home</a>
              <a href="#" className="text-gray-600 hover:text-fashion-pink transition-colors">About</a>
              <a href="#" className="text-gray-600 hover:text-fashion-pink transition-colors">Contact</a>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-charcoal mb-4">Discover Your Perfect Style</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Get personalized fashion recommendations powered by AI. Tell us about yourself and we'll curate the perfect outfits for any occasion.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Style Preferences Form */}
          <Card className="shadow-lg">
            <CardContent className="p-8">
              <h3 className="text-2xl font-semibold text-charcoal mb-6 flex items-center">
                <User className="w-6 h-6 text-fashion-pink mr-3" />
                Your Style Profile
              </h3>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  {/* Gender Selection */}
                  <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700">Gender</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={(value) => {
                              field.onChange(value);
                              // Reset body type when gender changes
                              form.setValue("bodyType", "");
                            }}
                            value={field.value}
                            className="grid grid-cols-3 gap-3"
                          >
                            {genderOptions.map((option) => (
                              <FormItem key={option.value}>
                                <FormControl>
                                  <RadioGroupItem value={option.value} className="sr-only" />
                                </FormControl>
                                <FormLabel className="relative cursor-pointer">
                                  <div className={`border-2 rounded-lg p-4 text-center transition-colors ${
                                    field.value === option.value
                                      ? "border-fashion-pink bg-fashion-pink text-white"
                                      : "border-gray-200 hover:border-fashion-pink"
                                  }`}>
                                    <span className="text-2xl mb-2 block">{option.icon}</span>
                                    <div className="font-medium">{option.label}</div>
                                  </div>
                                </FormLabel>
                              </FormItem>
                            ))}
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Body Type */}
                  <FormField
                    control={form.control}
                    name="bodyType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Body Type</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          value={field.value}
                          disabled={!selectedGender}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue 
                                placeholder={
                                  selectedGender 
                                    ? "Select your body type" 
                                    : "Please select gender first"
                                } 
                              />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {getBodyTypeOptions().map((bodyType) => (
                              <SelectItem key={bodyType.value} value={bodyType.value}>
                                {bodyType.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Skin Tone */}
                  <FormField
                    control={form.control}
                    name="skinTone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Skin Tone</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select your skin tone" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="fair">Fair</SelectItem>
                            <SelectItem value="light">Light</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="olive">Olive</SelectItem>
                            <SelectItem value="tan">Tan</SelectItem>
                            <SelectItem value="dark">Dark</SelectItem>
                            <SelectItem value="deep">Deep</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Occasion */}
                  <FormField
                    control={form.control}
                    name="occasion"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Occasion</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select an occasion" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="casual">Casual Daily Wear</SelectItem>
                            <SelectItem value="work">Work/Professional</SelectItem>
                            <SelectItem value="formal">Formal Event</SelectItem>
                            <SelectItem value="party">Party/Night Out</SelectItem>
                            <SelectItem value="date">Date Night</SelectItem>
                            <SelectItem value="vacation">Vacation/Travel</SelectItem>
                            <SelectItem value="wedding">Wedding Guest</SelectItem>
                            <SelectItem value="exercise">Exercise/Gym</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Season */}
                  <FormField
                    control={form.control}
                    name="season"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700">Season</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            value={field.value}
                            className="grid grid-cols-2 gap-3"
                          >
                            {seasonOptions.map((option) => (
                              <FormItem key={option.value}>
                                <FormControl>
                                  <RadioGroupItem value={option.value} className="sr-only" />
                                </FormControl>
                                <FormLabel className="relative cursor-pointer">
                                  <div className={`border-2 rounded-lg p-3 text-center transition-colors ${
                                    field.value === option.value
                                      ? "border-fashion-pink bg-fashion-pink text-white"
                                      : "border-gray-200 hover:border-fashion-pink"
                                  }`}>
                                    <span className="mb-1 block">{option.icon}</span>
                                    <div className="text-sm font-medium">{option.label}</div>
                                  </div>
                                </FormLabel>
                              </FormItem>
                            ))}
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Color Preferences */}
                  <FormField
                    control={form.control}
                    name="colorPreferences"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Preferred Colors</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select your color preference" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {colorOptions.map((color) => (
                              <SelectItem key={color.value} value={color.value}>
                                {color.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Style Preferences */}
                  <FormField
                    control={form.control}
                    name="stylePreferences"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Style Preferences</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., Minimalist, bohemian, classic, trendy"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={generateRecommendations.isPending}
                    className="w-full bg-gradient-to-r from-fashion-pink to-fashion-purple text-white font-semibold py-3 px-6 rounded-lg hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
                  >
                    {generateRecommendations.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Creating Your Perfect Look...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        Generate My Style Recommendations
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          {/* Recommendations Display */}
          <Card className="shadow-lg">
            <CardContent className="p-8">
              <h3 className="text-2xl font-semibold text-charcoal mb-6 flex items-center">
                <Star className="w-6 h-6 text-fashion-pink mr-3" />
                Your Style Recommendations
              </h3>

              {/* Loading State */}
              {generateRecommendations.isPending && (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-fashion-pink mb-4"></div>
                  <p className="text-gray-600">Creating your personalized recommendations...</p>
                  <p className="text-sm text-gray-500 mt-2">Generating outfit ideas and images - this may take up to 30 seconds</p>
                </div>
              )}

              {/* Empty State */}
              {!generateRecommendations.isPending && recommendations.length === 0 && (
                <div className="text-center py-12">
                  <Palette className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h4 className="text-xl font-medium text-gray-600 mb-2">Ready to Discover Your Style?</h4>
                  <p className="text-gray-500">Fill out your preferences and we'll create personalized fashion recommendations just for you.</p>
                </div>
              )}

              {/* Recommendations Content */}
              {recommendations.length > 0 && (
                <div className="space-y-6">
                  {recommendations.map((recommendation, index) => (
                    <div key={recommendation.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-4">
                        <h4 className="text-lg font-semibold text-charcoal">{recommendation.title}</h4>
                        <div className="flex text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-current" />
                          ))}
                        </div>
                      </div>
                      
                      {/* Image and Details Grid */}
                      <div className="grid lg:grid-cols-2 gap-6">
                        {/* Generated Image */}
                        {recommendation.imageUrl && (
                          <div className="lg:col-span-1">
                            <div className="aspect-[3/4] rounded-lg overflow-hidden bg-gray-100 shadow-md">
                              <img 
                                src={recommendation.imageUrl} 
                                alt={recommendation.title}
                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.style.display = 'none';
                                }}
                              />
                            </div>
                          </div>
                        )}
                        
                        {/* Details and Tips */}
                        <div className={`${recommendation.imageUrl ? 'lg:col-span-1' : 'lg:col-span-2'} space-y-4`}>
                          <div>
                            <h5 className="font-medium text-gray-800 mb-2">Outfit Details:</h5>
                            <ul className="text-sm text-gray-600 space-y-1">
                              {(recommendation.details as string[]).map((detail, detailIndex) => (
                                <li key={detailIndex}>• {detail}</li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h5 className="font-medium text-gray-800 mb-2">Key Styling Tips:</h5>
                            <p className="text-sm text-gray-600 leading-relaxed">
                              {recommendation.tips}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <div className="flex flex-wrap gap-2">
                          {(recommendation.tags as string[]).map((tag, tagIndex) => (
                            <span
                              key={tagIndex}
                              className={`px-3 py-1 rounded-full text-xs font-medium ${
                                tagIndex % 3 === 0
                                  ? "bg-pink-100 text-pink-800"
                                  : tagIndex % 3 === 1
                                  ? "bg-purple-100 text-purple-800"
                                  : "bg-blue-100 text-blue-800"
                              }`}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 mt-6">
                    <Button className="flex-1 bg-fashion-pink text-white font-semibold hover:bg-pink-600">
                      <Heart className="w-4 h-4 mr-2" />
                      Save to Favorites
                    </Button>
                    <Button variant="outline" className="flex-1 border-fashion-pink text-fashion-pink hover:bg-fashion-pink hover:text-white">
                      <Share className="w-4 h-4 mr-2" />
                      Share Look
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => setRecommendations([])}
                    >
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Try Again
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-charcoal text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="col-span-2">
              <div className="flex items-center mb-4">
                <Shirt className="w-8 h-8 text-fashion-pink mr-3" />
                <h3 className="text-xl font-bold">Rewear</h3>
              </div>
              <p className="text-gray-300 mb-4">
                Discover your perfect style with AI-powered fashion recommendations tailored to your unique preferences and lifestyle. Rewear helps you find amazing outfits effortlessly.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#" className="hover:text-fashion-pink transition-colors">How it Works</a></li>
                <li><a href="#" className="hover:text-fashion-pink transition-colors">Style Guide</a></li>
                <li><a href="#" className="hover:text-fashion-pink transition-colors">Trends</a></li>
                <li><a href="#" className="hover:text-fashion-pink transition-colors">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#" className="hover:text-fashion-pink transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-fashion-pink transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-fashion-pink transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-fashion-pink transition-colors">Help Center</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-300">
            <p>&copy; 2024 StyleAI. All rights reserved. Powered by OpenAI.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
