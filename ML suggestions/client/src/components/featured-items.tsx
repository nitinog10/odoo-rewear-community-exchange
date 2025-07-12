import { useQuery } from "@tanstack/react-query";
import ItemCard from "./item-card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Shirt, Plus, Search } from "lucide-react";

export default function FeaturedItems() {
  const { data: featuredItems = [], isLoading } = useQuery({
    queryKey: ['/api/items/featured'],
  });

  if (isLoading) {
    return (
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-charcoal mb-4">
              Featured Items
            </h2>
            <p className="text-xl text-charcoal/80">
              Discover amazing pieces from our community
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-sage/20 rounded-3xl h-64 mb-4"></div>
                <div className="bg-sage/20 rounded h-4 mb-2"></div>
                <div className="bg-sage/20 rounded h-4 w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-charcoal mb-4">
            Featured Items
          </h2>
          <p className="text-xl text-charcoal/80">
            Discover amazing pieces from our community
          </p>
        </div>
        
        {featuredItems.length === 0 ? (
          <div className="text-center py-12">
            <Shirt className="w-24 h-24 text-sage mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-charcoal mb-2">No featured items yet</h3>
            <p className="text-charcoal/70 mb-6">Be the first to share your style with the community!</p>
            <Link href="/api/login">
              <Button className="gradient-forest-sage text-white px-8 py-3 rounded-full">
                <Plus className="w-5 h-5 mr-2" />
                Add Your Items
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredItems.slice(0, 8).map((item: any) => (
              <div key={item.id} className="animate-fade-in">
                <ItemCard item={item} />
              </div>
            ))}
          </div>
        )}
        
        {featuredItems.length > 8 && (
          <div className="text-center mt-12">
            <Link href="/">
              <Button 
                variant="outline" 
                className="border-sage text-sage px-8 py-3 rounded-full hover:bg-sage/10 transition-all duration-300"
              >
                <i className="fas fa-search mr-2"></i>
                View All Items
              </Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
