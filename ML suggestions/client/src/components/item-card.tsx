import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, Bot } from "lucide-react";

interface ItemCardProps {
  item: {
    id: string;
    title: string;
    category: string;
    type: string;
    size: string;
    condition: string;
    color?: string;
    brand?: string;
    pointsValue: number;
    images?: string[];
    isFeatured?: boolean;
    isDonation?: boolean;
    status: string;
  };
}

export default function ItemCard({ item }: ItemCardProps) {
  const imageUrl = item.images && item.images.length > 0 
    ? item.images[0] 
    : "https://images.unsplash.com/photo-1523381294911-8d3cead13475?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=300";

  return (
    <Card className="bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105">
      <div className="relative">
        <img 
          src={imageUrl}
          alt={item.title}
          className="w-full h-48 object-cover"
        />
        
        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col space-y-2">
          {item.isFeatured && (
            <Badge className="bg-gradient-to-r from-forest to-sage text-white">
              Featured
            </Badge>
          )}
          {item.isDonation && (
            <Badge className="bg-gradient-to-r from-rose-gold to-terracotta text-white">
              Donation
            </Badge>
          )}
        </div>
        
        {/* Heart/Favorite Button */}
        <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-md rounded-full p-2 hover:bg-white transition-colors cursor-pointer">
          <Heart className="w-4 h-4 text-rose-gold" />
        </div>
      </div>
      
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-charcoal mb-2">{item.title}</h3>
        
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge variant="secondary" className="bg-sage/20 text-forest">
            {item.category}
          </Badge>
          <Badge variant="secondary" className="bg-terracotta/20 text-charcoal">
            {item.type}
          </Badge>
          <Badge variant="secondary" className="bg-earth/20 text-charcoal">
            Size {item.size}
          </Badge>
        </div>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <span className="text-gold font-semibold">✦ {item.pointsValue} pts</span>
            <span className="text-charcoal/40">or swap</span>
          </div>
          <div className="text-sm text-charcoal/60">{item.condition}</div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1">
            <Bot className="w-4 h-4 text-sage" />
            <span className="text-sm text-charcoal/60">AI Match</span>
          </div>
          
          <Link href={`/item/${item.id}`}>
            <Button 
              variant="outline" 
              size="sm"
              className="border-sage text-sage hover:bg-sage/10 transition-all duration-300"
            >
              View Details
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
