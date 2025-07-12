import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";
import { Brain, Palette, Sparkles, Wand2, RefreshCw } from "lucide-react";

export default function AISuggestions() {
  const { user, isAuthenticated } = useAuth();
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Fetch AI recommendations for the user
  const { data: recommendations, isLoading: recommendationsLoading, refetch } = useQuery({
    queryKey: ['/api/users', user?.id, 'ai-recommendations', refreshTrigger],
    enabled: !!user?.id && isAuthenticated,
  });

  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
    refetch();
  };

  return (
    <section className="py-20 bg-gradient-to-br from-sage/10 to-forest/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-charcoal mb-4">
            AI-Powered Style Matching
          </h2>
          <p className="text-xl text-charcoal/80 max-w-3xl mx-auto">
            Our intelligent system analyzes colors, styles, and trends to suggest perfect outfit combinations from our community marketplace.
          </p>
          
          {isAuthenticated && (
            <div className="mt-8 flex justify-center">
              <Button 
                onClick={handleRefresh}
                disabled={recommendationsLoading}
                className="bg-gradient-to-r from-forest to-sage text-white hover:shadow-lg transition-all duration-300"
              >
                {recommendationsLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Generating AI Suggestions...
                  </>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4 mr-2" />
                    Get My AI Style Recommendations
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          <Card className="bg-white/80 backdrop-blur-md border-sage/20 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <CardHeader>
              <div className="w-16 h-16 bg-gradient-to-br from-forest to-sage rounded-2xl flex items-center justify-center mb-4">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-charcoal">Smart Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-charcoal/70 mb-4">
                Advanced AI analyzes color theory, seasonal trends, and style compatibility to suggest perfect matches.
              </p>
              <div className="text-sm text-forest font-medium">Powered by OpenAI</div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/80 backdrop-blur-md border-sage/20 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <CardHeader>
              <div className="w-16 h-16 bg-gradient-to-br from-gold to-terracotta rounded-2xl flex items-center justify-center mb-4">
                <Palette className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-charcoal">Color Coordination</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-charcoal/70 mb-4">
                Intelligent color matching ensures every outfit combination looks professionally styled.
              </p>
              <div className="text-sm text-forest font-medium">Real-time Suggestions</div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/80 backdrop-blur-md border-sage/20 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <CardHeader>
              <div className="w-16 h-16 bg-gradient-to-br from-rose-gold to-terracotta rounded-2xl flex items-center justify-center mb-4">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-charcoal">Personal Style</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-charcoal/70 mb-4">
                Learn your preferences and suggest items that match your unique style and body type.
              </p>
              <div className="text-sm text-forest font-medium">Personalized AI</div>
            </CardContent>
          </Card>
        </div>

        {/* AI Recommendations Section */}
        {isAuthenticated && (
          <div className="mt-16">
            <div className="text-center mb-12">
              <h3 className="text-2xl font-bold text-charcoal mb-4">
                <Sparkles className="w-6 h-6 mr-2 text-gold inline" />
                Your Personalized AI Recommendations
              </h3>
            </div>
            
            {recommendationsLoading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Card key={i} className="bg-white/80 backdrop-blur-md border-sage/20">
                    <CardContent className="p-6">
                      <Skeleton className="h-6 w-full mb-4" />
                      <Skeleton className="h-4 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-1/2" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : recommendations?.outfits?.length > 0 ? (
              <div className="space-y-8">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {recommendations.outfits.slice(0, 3).map((outfit: any, index: number) => (
                    <Card key={index} className="bg-white/80 backdrop-blur-md border-sage/20 shadow-lg hover:shadow-xl transition-all duration-300">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg text-charcoal">{outfit.name}</CardTitle>
                          <Badge className="bg-gradient-to-r from-gold to-terracotta text-white">
                            AI Pick
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-charcoal/70 mb-4">{outfit.description}</p>
                        <div className="space-y-2">
                          <div className="text-sm">
                            <span className="font-medium text-charcoal">Occasion:</span>
                            <span className="text-charcoal/80 ml-2">{outfit.occasion}</span>
                          </div>
                          <div className="text-sm">
                            <span className="font-medium text-charcoal">Season:</span>
                            <span className="text-charcoal/80 ml-2">{outfit.season}</span>
                          </div>
                          <div className="text-sm">
                            <span className="font-medium text-charcoal">Style:</span>
                            <span className="text-charcoal/80 ml-2">{outfit.style}</span>
                          </div>
                        </div>
                        <div className="mt-4">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="w-full border-forest text-forest hover:bg-forest/10"
                          >
                            View Similar Items
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                
                {recommendations.personalizedTips && recommendations.personalizedTips.length > 0 && (
                  <Card className="bg-gradient-to-br from-warm-white to-sage/10 border-sage/20">
                    <CardHeader>
                      <CardTitle className="text-forest flex items-center">
                        <Brain className="w-5 h-5 mr-2" />
                        Personalized Style Tips
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {recommendations.personalizedTips.map((tip: string, index: number) => (
                          <div key={index} className="flex items-start space-x-3">
                            <div className="w-2 h-2 bg-gold rounded-full mt-2 flex-shrink-0"></div>
                            <p className="text-charcoal/80">{tip}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            ) : (
              <Card className="bg-white/80 backdrop-blur-md border-sage/20">
                <CardContent className="p-8 text-center">
                  <Wand2 className="w-12 h-12 text-charcoal/30 mx-auto mb-4" />
                  <p className="text-charcoal/70 mb-4">
                    Add some items to your wardrobe to get personalized AI recommendations!
                  </p>
                  <Link href="/add-item">
                    <Button className="bg-gradient-to-r from-forest to-sage text-white">
                      Add Your First Item
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </div>
        )}
        
        {/* AI Demo Section */}
        <Card className="bg-white/50 backdrop-blur-md border-sage/20 shadow-lg mt-16">
          <CardContent className="p-8">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl font-bold text-charcoal mb-4">
                  <Sparkles className="w-6 h-6 mr-2 text-forest inline" />
                  See AI in Action
                </h3>
                <p className="text-charcoal/80 mb-6">
                  Watch how our AI analyzes a white button-down shirt and suggests complementary pieces from our community.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-forest rounded-full"></div>
                    <span className="text-charcoal/80">Analyzes color and style</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-sage rounded-full"></div>
                    <span className="text-charcoal/80">Suggests matching bottoms</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-gold rounded-full"></div>
                    <span className="text-charcoal/80">Recommends accessories</span>
                  </div>
                </div>
                <div className="mt-6">
                  {!isAuthenticated ? (
                    <Link href="/api/login">
                      <Button className="bg-gradient-to-r from-forest to-sage text-white px-6 py-3 rounded-full hover:shadow-lg transition-all duration-300">
                        <Brain className="w-4 h-4 mr-2" />
                        Try AI Styling
                      </Button>
                    </Link>
                  ) : (
                    <Link href="/swap">
                      <Button className="bg-gradient-to-r from-forest to-sage text-white px-6 py-3 rounded-full hover:shadow-lg transition-all duration-300">
                        <Brain className="w-4 h-4 mr-2" />
                        Start Swapping
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-warm-white to-sage/10 rounded-2xl p-6">
                <div className="text-center mb-4">
                  <div className="text-sm text-charcoal/60 mb-2">AI Analysis Result</div>
                  <div className="text-lg font-semibold text-forest">White Button-Down Shirt</div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-white rounded-xl p-3 shadow-sm">
                    <img 
                      src="https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=200&h=150" 
                      alt="White button-down shirt" 
                      className="w-full h-16 object-cover rounded-lg"
                    />
                    <div className="text-xs text-center mt-2 text-charcoal/70">Original Item</div>
                  </div>
                  <div className="bg-white rounded-xl p-3 shadow-sm">
                    <img 
                      src="https://images.unsplash.com/photo-1542272604-787c3835535d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=200&h=150" 
                      alt="Dark blue jeans" 
                      className="w-full h-16 object-cover rounded-lg"
                    />
                    <div className="text-xs text-center mt-2 text-charcoal/70">AI Match</div>
                  </div>
                  <div className="bg-white rounded-xl p-3 shadow-sm">
                    <img 
                      src="https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=200&h=150" 
                      alt="Brown leather belt" 
                      className="w-full h-16 object-cover rounded-lg"
                    />
                    <div className="text-xs text-center mt-2 text-charcoal/70">Accessory</div>
                  </div>
                </div>
                <div className="mt-4 text-center">
                  <div className="text-sm text-forest font-medium">✓ 95% Style Match</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
