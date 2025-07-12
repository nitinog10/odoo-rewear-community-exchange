import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/navbar";
import ItemCard from "@/components/item-card";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Link } from "wouter";

export default function Dashboard() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
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
  }, [isAuthenticated, isLoading, toast]);

  const { data: userItems = [] } = useQuery({
    queryKey: ['/api/users', user?.id, 'items'],
    enabled: !!user?.id,
  });

  const { data: userSwaps = [] } = useQuery({
    queryKey: ['/api/users', user?.id, 'swaps'],
    enabled: !!user?.id,
  });

  const { data: userDonations = [] } = useQuery({
    queryKey: ['/api/users', user?.id, 'donations'],
    enabled: !!user?.id,
  });

  const { data: recommendations = { outfits: [], personalizedTips: [] } } = useQuery({
    queryKey: ['/api/users', user?.id, 'ai-recommendations'],
    enabled: !!user?.id,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-warm-white">
        <Navbar />
        <div className="pt-24 pb-12 flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-forest"></div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const points = user?.points || 0;
  const nextLevel = Math.ceil((points + 1) / 500) * 500;
  const pointsProgress = (points / nextLevel) * 100;

  return (
    <div className="min-h-screen bg-warm-white">
      <Navbar />
      
      <div className="pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-charcoal mb-4">
              Welcome back, {user?.firstName || 'Fashion Pioneer'}!
            </h1>
            <p className="text-xl text-charcoal/80">
              Manage your wardrobe, track your impact, and discover new styles
            </p>
          </div>

          {/* Stats Overview */}
          <div className="grid md:grid-cols-4 gap-6 mb-12">
            <Card className="bg-gradient-to-br from-forest/10 to-sage/20 border-sage/30">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-forest mb-2">{points}</div>
                <div className="text-sm text-charcoal/70">Total Points</div>
                <Progress value={pointsProgress} className="mt-2" />
                <div className="text-xs text-charcoal/60 mt-1">
                  Next level: {nextLevel} pts
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-gold/10 to-terracotta/20 border-terracotta/30">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-terracotta mb-2">{userItems.length}</div>
                <div className="text-sm text-charcoal/70">Items Listed</div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-rose-gold/10 to-terracotta/20 border-rose-gold/30">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-rose-gold mb-2">{userSwaps.length}</div>
                <div className="text-sm text-charcoal/70">Swaps Made</div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-sage/10 to-forest/20 border-sage/30">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-sage mb-2">{userDonations.length}</div>
                <div className="text-sm text-charcoal/70">Donations Made</div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Link href="/add-item">
              <Card className="bg-gradient-to-br from-forest to-sage text-white hover:shadow-lg transition-all duration-300 cursor-pointer">
                <CardContent className="p-6 text-center">
                  <i className="fas fa-plus text-3xl mb-4"></i>
                  <h3 className="text-lg font-semibold mb-2">List New Item</h3>
                  <p className="text-sm opacity-90">Add clothes to your wardrobe</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/add-item">
              <Card className="bg-gradient-to-br from-gold to-terracotta text-white hover:shadow-lg transition-all duration-300 cursor-pointer">
                <CardContent className="p-6 text-center">
                  <i className="fas fa-heart text-3xl mb-4"></i>
                  <h3 className="text-lg font-semibold mb-2">Donate Item</h3>
                  <p className="text-sm opacity-90">Help others in need</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/">
              <Card className="bg-gradient-to-br from-rose-gold to-terracotta text-white hover:shadow-lg transition-all duration-300 cursor-pointer">
                <CardContent className="p-6 text-center">
                  <i className="fas fa-search text-3xl mb-4"></i>
                  <h3 className="text-lg font-semibold mb-2">Browse Items</h3>
                  <p className="text-sm opacity-90">Find your next favorite</p>
                </CardContent>
              </Card>
            </Link>
          </div>

          {/* Main Content */}
          <Tabs defaultValue="items" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="items">My Items</TabsTrigger>
              <TabsTrigger value="swaps">Swaps</TabsTrigger>
              <TabsTrigger value="ai">AI Suggestions</TabsTrigger>
              <TabsTrigger value="impact">Impact</TabsTrigger>
            </TabsList>

            <TabsContent value="items">
              <Card>
                <CardHeader>
                  <CardTitle className="text-forest">
                    <i className="fas fa-tshirt mr-2"></i>
                    My Items ({userItems.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {userItems.length === 0 ? (
                    <div className="text-center py-12">
                      <i className="fas fa-plus text-sage text-6xl mb-4"></i>
                      <h3 className="text-xl font-semibold text-charcoal mb-2">No items yet</h3>
                      <p className="text-charcoal/70 mb-6">Start by adding your first item to the community</p>
                      <Link href="/add-item">
                        <Button className="gradient-forest-sage text-white">
                          <i className="fas fa-plus mr-2"></i>
                          Add Your First Item
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {userItems.map((item: any) => (
                        <div key={item.id} className="relative">
                          <ItemCard item={item} />
                          <Badge 
                            className={`absolute top-2 right-2 ${
                              item.status === 'approved' ? 'bg-green-500' :
                              item.status === 'pending' ? 'bg-yellow-500' :
                              'bg-red-500'
                            } text-white`}
                          >
                            {item.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="swaps">
              <Card>
                <CardHeader>
                  <CardTitle className="text-forest">
                    <i className="fas fa-exchange-alt mr-2"></i>
                    My Swaps ({userSwaps.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {userSwaps.length === 0 ? (
                    <div className="text-center py-12">
                      <i className="fas fa-exchange-alt text-sage text-6xl mb-4"></i>
                      <h3 className="text-xl font-semibold text-charcoal mb-2">No swaps yet</h3>
                      <p className="text-charcoal/70 mb-6">Start swapping to build your sustainable wardrobe</p>
                      <Link href="/">
                        <Button className="gradient-forest-sage text-white">
                          <i className="fas fa-search mr-2"></i>
                          Browse Items to Swap
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {userSwaps.map((swap: any) => (
                        <div key={swap.id} className="border border-sage/20 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <i className="fas fa-exchange-alt text-sage"></i>
                              <span className="font-medium">Swap Request</span>
                            </div>
                            <Badge 
                              className={`${
                                swap.status === 'completed' ? 'bg-green-500' :
                                swap.status === 'accepted' ? 'bg-blue-500' :
                                swap.status === 'pending' ? 'bg-yellow-500' :
                                'bg-red-500'
                              } text-white`}
                            >
                              {swap.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-charcoal/70">
                            {swap.message || 'No message provided'}
                          </p>
                          <div className="text-xs text-charcoal/60 mt-2">
                            {new Date(swap.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="ai">
              <Card>
                <CardHeader>
                  <CardTitle className="text-forest">
                    <i className="fas fa-robot mr-2"></i>
                    AI Style Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {recommendations.outfits.length === 0 ? (
                    <div className="text-center py-12">
                      <i className="fas fa-robot text-sage text-6xl mb-4"></i>
                      <h3 className="text-xl font-semibold text-charcoal mb-2">No recommendations yet</h3>
                      <p className="text-charcoal/70 mb-6">Add some items to your wardrobe to get personalized AI suggestions</p>
                      <Link href="/add-item">
                        <Button className="gradient-forest-sage text-white">
                          <i className="fas fa-plus mr-2"></i>
                          Add Items
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {recommendations.outfits.map((outfit: any, index: number) => (
                          <Card key={index} className="bg-gradient-to-br from-warm-white to-sage/10 border-sage/20">
                            <CardHeader>
                              <CardTitle className="text-forest flex items-center">
                                <i className="fas fa-magic mr-2"></i>
                                {outfit.name}
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <p className="text-charcoal/70 mb-4">{outfit.description}</p>
                              <div className="flex flex-wrap gap-2">
                                <Badge variant="secondary" className="bg-sage/20 text-forest">
                                  {outfit.occasion}
                                </Badge>
                                <Badge variant="secondary" className="bg-terracotta/20 text-charcoal">
                                  {outfit.seasonality}
                                </Badge>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                      
                      {recommendations.personalizedTips.length > 0 && (
                        <div className="bg-gradient-to-r from-gold/10 to-terracotta/10 rounded-2xl p-6">
                          <h3 className="text-lg font-semibold text-charcoal mb-4">
                            <i className="fas fa-lightbulb mr-2 text-gold"></i>
                            Personalized Tips
                          </h3>
                          <div className="space-y-3">
                            {recommendations.personalizedTips.map((tip: string, index: number) => (
                              <div key={index} className="flex items-start space-x-3">
                                <div className="w-2 h-2 bg-terracotta rounded-full mt-2 flex-shrink-0"></div>
                                <p className="text-charcoal/80">{tip}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="impact">
              <Card>
                <CardHeader>
                  <CardTitle className="text-forest">
                    <i className="fas fa-leaf mr-2"></i>
                    Your Environmental Impact
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-6 mb-8">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-forest to-sage rounded-full flex items-center justify-center mx-auto mb-4">
                        <i className="fas fa-leaf text-white text-xl"></i>
                      </div>
                      <div className="text-2xl font-bold text-forest mb-2">
                        {(userSwaps.length * 0.12).toFixed(1)}kg
                      </div>
                      <div className="text-sm text-charcoal/70">CO2 Saved</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-gold to-terracotta rounded-full flex items-center justify-center mx-auto mb-4">
                        <i className="fas fa-tint text-white text-xl"></i>
                      </div>
                      <div className="text-2xl font-bold text-forest mb-2">
                        {userSwaps.length * 20}L
                      </div>
                      <div className="text-sm text-charcoal/70">Water Saved</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-rose-gold to-terracotta rounded-full flex items-center justify-center mx-auto mb-4">
                        <i className="fas fa-recycle text-white text-xl"></i>
                      </div>
                      <div className="text-2xl font-bold text-forest mb-2">
                        {userItems.length + userSwaps.length}
                      </div>
                      <div className="text-sm text-charcoal/70">Items Circulated</div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-sage/10 to-forest/10 rounded-2xl p-6">
                    <h3 className="text-lg font-semibold text-charcoal mb-4">
                      <i className="fas fa-trophy mr-2 text-gold"></i>
                      Sustainability Achievements
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-charcoal/80">Eco Warrior</span>
                        <Badge className="bg-forest text-white">
                          {userDonations.length >= 5 ? 'Achieved' : `${userDonations.length}/5`}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-charcoal/80">Swap Master</span>
                        <Badge className="bg-forest text-white">
                          {userSwaps.length >= 10 ? 'Achieved' : `${userSwaps.length}/10`}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-charcoal/80">Community Builder</span>
                        <Badge className="bg-forest text-white">
                          {userItems.length >= 20 ? 'Achieved' : `${userItems.length}/20`}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
