import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest } from "@/lib/queryClient";
import Navbar from "@/components/navbar";
import ItemCard from "@/components/item-card";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { Image, ArrowRightLeft, Coins } from "lucide-react";

export default function ItemDetail() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [swapMessage, setSwapMessage] = useState("");
  const [selectedItemId, setSelectedItemId] = useState("");
  const [isSwapDialogOpen, setIsSwapDialogOpen] = useState(false);

  const { data: item, isLoading: itemLoading } = useQuery({
    queryKey: ['/api/items', id],
    enabled: !!id,
  });

  const { data: userItems = [] } = useQuery({
    queryKey: ['/api/users', user?.id, 'items'],
    enabled: !!user?.id,
  });

  const { data: suggestions = { suggestions: [] } } = useQuery({
    queryKey: ['/api/items', id, 'suggestions'],
    enabled: !!id,
  });

  const swapMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest('POST', '/api/swaps', data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Swap Request Sent",
        description: "Your swap request has been sent to the item owner.",
      });
      setIsSwapDialogOpen(false);
      setSwapMessage("");
      setSelectedItemId("");
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
        description: "Failed to send swap request. Please try again.",
        variant: "destructive",
      });
    },
  });

  const donationMutation = useMutation({
    mutationFn: async (itemId: string) => {
      const response = await apiRequest('POST', '/api/donations', { itemId });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Donation Successful",
        description: "Thank you for your donation! You've earned 20 points.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/auth/user'] });
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
        description: "Failed to process donation. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSwapRequest = () => {
    if (!selectedItemId) {
      toast({
        title: "Error",
        description: "Please select an item to swap.",
        variant: "destructive",
      });
      return;
    }

    swapMutation.mutate({
      ownerItemId: id,
      ownerId: item.userId,
      requesterItemId: selectedItemId,
      message: swapMessage,
    });
  };

  if (itemLoading) {
    return (
      <div className="min-h-screen bg-warm-white">
        <Navbar />
        <div className="pt-24 pb-12 flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-forest"></div>
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen bg-warm-white">
        <Navbar />
        <div className="pt-24 pb-12 text-center">
          <h1 className="text-2xl font-bold text-charcoal">Item not found</h1>
        </div>
      </div>
    );
  }

  const isOwner = user?.id === item.userId;
  const canSwap = user && !isOwner && item.status === 'approved';

  return (
    <div className="min-h-screen bg-warm-white">
      <Navbar />
      
      <div className="pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Item Images */}
            <div className="space-y-4">
              <div className="aspect-square rounded-3xl overflow-hidden bg-gradient-to-br from-sage/10 to-forest/10">
                {item.images && item.images.length > 0 ? (
                  <img 
                    src={item.images[0]} 
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <i className="Image text-sage text-6xl"></i>
                  </div>
                )}
              </div>
              
              {item.images && item.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {item.images.slice(1, 5).map((image: string, index: number) => (
                    <div key={index} className="aspect-square rounded-xl overflow-hidden bg-gradient-to-br from-sage/10 to-forest/10">
                      <img 
                        src={image} 
                        alt={`${item.title} ${index + 2}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Item Details */}
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h1 className="text-3xl font-bold text-charcoal">{item.title}</h1>
                  {item.isFeatured && (
                    <Badge className="bg-gradient-to-r from-gold to-terracotta text-white">
                      Featured
                    </Badge>
                  )}
                </div>
                
                <div className="flex flex-wrap gap-2 mb-6">
                  <Badge variant="secondary" className="bg-sage/20 text-forest">
                    {item.category}
                  </Badge>
                  <Badge variant="secondary" className="bg-terracotta/20 text-charcoal">
                    {item.type}
                  </Badge>
                  <Badge variant="secondary" className="bg-rose-gold/20 text-charcoal">
                    Size {item.size}
                  </Badge>
                  <Badge variant="secondary" className="bg-earth/20 text-charcoal">
                    {item.condition}
                  </Badge>
                </div>

                {item.description && (
                  <p className="text-charcoal/80 text-lg leading-relaxed mb-6">
                    {item.description}
                  </p>
                )}

                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <div className="text-2xl font-bold text-gold">
                      ✦ {item.pointsValue} pts
                    </div>
                    <div className="text-charcoal/60">or swap</div>
                  </div>
                  
                  {item.color && (
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-charcoal/60">Color:</span>
                      <span className="font-medium text-charcoal">{item.color}</span>
                    </div>
                  )}
                </div>

                {item.tags && item.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-6">
                    {item.tags.map((tag: string, index: number) => (
                      <Badge key={index} variant="outline" className="border-sage/50 text-sage">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              {canSwap && (
                <div className="space-y-4">
                  <Dialog open={isSwapDialogOpen} onOpenChange={setIsSwapDialogOpen}>
                    <DialogTrigger asChild>
                      <Button 
                        className="w-full gradient-forest-sage text-white py-3 rounded-full hover:shadow-lg transition-all duration-300"
                        size="lg"
                      >
                        <i className="ArrowRightLeft mr-2"></i>
                        Request Swap
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>Request Swap</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="item-select">Select your item to swap</Label>
                          <Select value={selectedItemId} onValueChange={setSelectedItemId}>
                            <SelectTrigger>
                              <SelectValue placeholder="Choose an item" />
                            </SelectTrigger>
                            <SelectContent>
                              {userItems.map((userItem: any) => (
                                <SelectItem key={userItem.id} value={userItem.id}>
                                  {userItem.title} - {userItem.type}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div>
                          <Label htmlFor="message">Message (optional)</Label>
                          <Textarea
                            id="message"
                            placeholder="Add a message to the owner..."
                            value={swapMessage}
                            onChange={(e) => setSwapMessage(e.target.value)}
                          />
                        </div>
                        
                        <Button 
                          onClick={handleSwapRequest}
                          disabled={swapMutation.isPending || !selectedItemId}
                          className="w-full gradient-forest-sage text-white"
                        >
                          {swapMutation.isPending ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                              Sending Request...
                            </>
                          ) : (
                            'Send Swap Request'
                          )}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Button 
                    variant="outline" 
                    className="w-full border-gold text-gold hover:bg-gold/10 py-3 rounded-full transition-all duration-300"
                    size="lg"
                    disabled={!user || (user.points || 0) < item.pointsValue}
                  >
                    <i className="Coins mr-2"></i>
                    Redeem with Points {user && (user.points || 0) < item.pointsValue && '(Insufficient Points)'}
                  </Button>
                </div>
              )}

              {isOwner && (
                <div className="bg-gradient-to-r from-sage/10 to-forest/10 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-charcoal mb-2">
                    <i className="fas fa-user mr-2"></i>
                    Your Item
                  </h3>
                  <p className="text-charcoal/70 mb-4">
                    This is your item. You can view swap requests in your dashboard.
                  </p>
                  <Button 
                    onClick={() => setLocation('/dashboard')}
                    variant="outline" 
                    className="border-forest text-forest hover:bg-forest/10"
                  >
                    View Dashboard
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* AI Suggestions */}
          {suggestions.suggestions.length > 0 && (
            <div className="mt-16">
              <Separator className="mb-12" />
              
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-charcoal mb-4">
                  <i className="fas fa-robot mr-3 text-forest"></i>
                  AI Style Suggestions
                </h2>
                <p className="text-xl text-charcoal/80">
                  Perfect matches for this item, powered by AI
                </p>
              </div>

              <Card className="bg-gradient-to-br from-warm-white to-sage/5 border-sage/20 mb-8">
                <CardHeader>
                  <CardTitle className="text-forest">
                    <i className="fas fa-lightbulb mr-2"></i>
                    AI Styling Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-charcoal/80 mb-4">{suggestions.reasoning}</p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-charcoal mb-2">Color Compatibility</h4>
                      <p className="text-sm text-charcoal/70">{suggestions.colorCompatibility}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-charcoal mb-2">Style Notes</h4>
                      <p className="text-sm text-charcoal/70">{suggestions.styleNotes}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {suggestions.suggestions.map((suggestion: any, index: number) => (
                  <Card key={index} className="hover:shadow-lg transition-all duration-300">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">Match Score</CardTitle>
                        <Badge className="bg-gradient-to-r from-gold to-terracotta text-white">
                          {suggestion.matchScore}%
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-charcoal/70 mb-4">{suggestion.reasoning}</p>
                      <Button 
                        variant="outline" 
                        className="w-full border-sage text-sage hover:bg-sage/10"
                        onClick={() => setLocation(`/item/${suggestion.itemId}`)}
                      >
                        View Item
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
