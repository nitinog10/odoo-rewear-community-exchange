import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/components/navbar";
import ItemCard from "@/components/item-card";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { ArrowRightLeft, Plus, Sparkles, TrendingUp } from "lucide-react";

export default function Home() {
  const { user } = useAuth();

  const { data: featuredItems = [] } = useQuery({
    queryKey: ['/api/items/featured'],
  });

  const { data: recentItems = [] } = useQuery({
    queryKey: ['/api/items'],
  });

  const { data: recommendations = { outfits: [], personalizedTips: [] } } = useQuery({
    queryKey: ['/api/users', user?.id, 'ai-recommendations'],
    enabled: !!user?.id,
  });

  return (
    <div className="min-h-screen bg-warm-white">
      <Navbar />
      
      {/* Welcome Section */}
      <section className="pt-24 pb-12 bg-gradient-to-br from-sage/20 to-forest/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-charcoal mb-4">
              Welcome back, {user?.firstName || 'Fashion Pioneer'}!
            </h1>
            <p className="text-xl text-charcoal/80 mb-8">
              Your sustainable fashion journey continues. Discover new styles and share your favorites.
            </p>
            
            <div className="flex justify-center items-center space-x-8 mb-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-forest">{user?.points || 0}</div>
                <div className="text-sm text-charcoal/60">Points</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-forest">23</div>
                <div className="text-sm text-charcoal/60">Items Swapped</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-forest">2.8kg</div>
                <div className="text-sm text-charcoal/60">CO2 Saved</div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/add-item">
                <Button className="bg-gradient-to-r from-forest to-sage text-white px-8 py-3 rounded-full hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                  <Plus className="w-4 h-4 mr-2" />
                  List New Item
                </Button>
              </Link>
              <Link href="/swap">
                <Button className="bg-gradient-to-r from-gold to-terracotta text-white px-8 py-3 rounded-full hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                  <ArrowRightLeft className="w-4 h-4 mr-2" />
                  Start Swapping
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="outline" className="border-sage text-forest px-8 py-3 rounded-full hover:bg-sage/10 transition-all duration-300">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  View Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* AI Recommendations */}
      {recommendations.outfits.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-charcoal mb-4">
                AI Style Recommendations
              </h2>
              <p className="text-xl text-charcoal/80">
                Personalized outfit combinations from your wardrobe
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {recommendations.outfits.slice(0, 3).map((outfit, index) => (
                <Card key={index} className="bg-gradient-to-br from-warm-white to-sage/10 border-sage/20 hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="text-forest flex items-center">
                      <i className="fas fa-robot mr-2"></i>
                      {outfit.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-charcoal/70 mb-4">{outfit.description}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <Badge variant="secondary" className="bg-sage/20 text-forest">
                        {outfit.occasion}
                      </Badge>
                      <Badge variant="secondary" className="bg-terracotta/20 text-charcoal">
                        {outfit.seasonality}
                      </Badge>
                    </div>
                    <div className="text-sm text-charcoal/60">
                      {outfit.items.length} items • AI matched
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {recommendations.personalizedTips.length > 0 && (
              <div className="bg-gradient-to-r from-gold/10 to-terracotta/10 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-charcoal mb-4">
                  <i className="fas fa-lightbulb mr-2 text-gold"></i>
                  Personalized Style Tips
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {recommendations.personalizedTips.map((tip, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-terracotta rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-charcoal/80">{tip}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Featured Items */}
      {featuredItems.length > 0 && (
        <section className="py-16 bg-gradient-to-br from-sage/5 to-forest/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-charcoal mb-4">
                Featured Items
              </h2>
              <p className="text-xl text-charcoal/80">
                Curated picks from our community
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredItems.slice(0, 8).map((item: any) => (
                <ItemCard key={item.id} item={item} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Recent Items */}
      {recentItems.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-charcoal mb-4">
                Recently Added
              </h2>
              <p className="text-xl text-charcoal/80">
                Fresh styles from our community
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {recentItems.slice(0, 8).map((item: any) => (
                <ItemCard key={item.id} item={item} />
              ))}
            </div>
            
            <div className="text-center mt-12">
              <Button variant="outline" className="border-sage text-forest px-8 py-3 rounded-full hover:bg-sage/10 transition-all duration-300">
                <i className="fas fa-search mr-2"></i>
                Browse All Items
              </Button>
            </div>
          </div>
        </section>
      )}
      
      <Footer />
    </div>
  );
}
