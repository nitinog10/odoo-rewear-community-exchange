import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest } from "@/lib/queryClient";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowRightLeft, Check, X, Clock, Sparkles, MessageSquare } from "lucide-react";
import { Link } from "wouter";

export default function Swap() {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [activeTab, setActiveTab] = useState("received");
  const [isSwapDialogOpen, setIsSwapDialogOpen] = useState(false);
  const [swapMessage, setSwapMessage] = useState("");
  const [selectedUserItem, setSelectedUserItem] = useState("");
  const [selectedTargetItem, setSelectedTargetItem] = useState("");

  // Fetch user's swaps
  const { data: userSwaps = [], isLoading: swapsLoading } = useQuery({
    queryKey: ['/api/users', user?.id, 'swaps'],
    enabled: !!user?.id,
  });

  // Fetch user's items for swapping
  const { data: userItems = [] } = useQuery({
    queryKey: ['/api/users', user?.id, 'items'],
    enabled: !!user?.id,
  });

  // Fetch available items for swapping
  const { data: availableItems = [] } = useQuery({
    queryKey: ['/api/items'],
    enabled: !!user?.id,
  });

  // Create swap mutation
  const createSwapMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest('POST', '/api/swaps', data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Swap Request Sent",
        description: "Your swap request has been sent successfully!",
      });
      setIsSwapDialogOpen(false);
      setSwapMessage("");
      setSelectedUserItem("");
      setSelectedTargetItem("");
      queryClient.invalidateQueries({ queryKey: ['/api/users', user?.id, 'swaps'] });
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

  // Update swap status mutation
  const updateSwapMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const response = await apiRequest('PATCH', `/api/swaps/${id}`, { status });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Swap Updated",
        description: "Swap status has been updated successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/users', user?.id, 'swaps'] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update swap. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleCreateSwap = () => {
    if (!selectedUserItem || !selectedTargetItem || !swapMessage.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields before sending the swap request.",
        variant: "destructive",
      });
      return;
    }

    const targetItem = availableItems.find((item: any) => item.id === selectedTargetItem);
    if (!targetItem) {
      toast({
        title: "Error",
        description: "Selected item not found.",
        variant: "destructive",
      });
      return;
    }

    createSwapMutation.mutate({
      requesterItemId: selectedUserItem,
      ownerItemId: selectedTargetItem,
      ownerId: targetItem.userId,
      message: swapMessage,
    });
  };

  const handleSwapAction = (swapId: string, action: 'accepted' | 'rejected') => {
    updateSwapMutation.mutate({ id: swapId, status: action });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      case 'accepted':
        return <Badge variant="default" className="bg-green-500"><Check className="w-3 h-3 mr-1" />Accepted</Badge>;
      case 'rejected':
        return <Badge variant="destructive"><X className="w-3 h-3 mr-1" />Rejected</Badge>;
      case 'completed':
        return <Badge variant="default" className="bg-blue-500"><Sparkles className="w-3 h-3 mr-1" />Completed</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const receivedSwaps = userSwaps.filter((swap: any) => swap.ownerId === user?.id);
  const sentSwaps = userSwaps.filter((swap: any) => swap.requesterId === user?.id);
  const myItems = availableItems.filter((item: any) => item.userId === user?.id);
  const otherItems = availableItems.filter((item: any) => item.userId !== user?.id && item.status === 'approved');

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-warm-white">
        <Navbar />
        <div className="pt-24 pb-16">
          <div className="max-w-2xl mx-auto px-4 text-center">
            <h1 className="text-3xl font-bold text-charcoal mb-4">Access Denied</h1>
            <p className="text-charcoal/70 mb-8">Please log in to access the swap feature.</p>
            <Button onClick={() => window.location.href = "/api/login"} className="bg-gradient-to-r from-forest to-sage text-white">
              Login
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-warm-white">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-charcoal mb-4">Clothing Swaps</h1>
            <p className="text-xl text-charcoal/70 max-w-2xl mx-auto">
              Exchange clothes with other community members. Discover new styles while giving your items a second life.
            </p>
          </div>

          <div className="mb-8">
            <Button 
              onClick={() => setIsSwapDialogOpen(true)}
              className="bg-gradient-to-r from-forest to-sage text-white hover:shadow-lg transition-all duration-300"
            >
              <ArrowRightLeft className="w-4 h-4 mr-2" />
              Start New Swap
            </Button>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="received">Received ({receivedSwaps.length})</TabsTrigger>
              <TabsTrigger value="sent">Sent ({sentSwaps.length})</TabsTrigger>
              <TabsTrigger value="available">Available Items ({otherItems.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="received" className="space-y-4">
              <h2 className="text-2xl font-semibold text-charcoal mb-4">Swap Requests Received</h2>
              {receivedSwaps.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <ArrowRightLeft className="w-12 h-12 text-charcoal/30 mx-auto mb-4" />
                    <p className="text-charcoal/70">No swap requests received yet.</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4">
                  {receivedSwaps.map((swap: any) => (
                    <Card key={swap.id} className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                              <span className="text-sm text-charcoal/70">Their Item:</span>
                              <span className="font-medium">{swap.requesterItem?.title || "Unknown Item"}</span>
                            </div>
                            <ArrowRightLeft className="w-4 h-4 text-charcoal/50" />
                            <div className="flex items-center space-x-2">
                              <span className="text-sm text-charcoal/70">Your Item:</span>
                              <span className="font-medium">{swap.ownerItem?.title || "Unknown Item"}</span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            {getStatusBadge(swap.status)}
                            {swap.status === 'pending' && (
                              <div className="flex space-x-2">
                                <Button
                                  size="sm"
                                  onClick={() => handleSwapAction(swap.id, 'accepted')}
                                  className="bg-green-500 hover:bg-green-600"
                                  disabled={updateSwapMutation.isPending}
                                >
                                  <Check className="w-3 h-3 mr-1" />
                                  Accept
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleSwapAction(swap.id, 'rejected')}
                                  disabled={updateSwapMutation.isPending}
                                >
                                  <X className="w-3 h-3 mr-1" />
                                  Reject
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                        {swap.message && (
                          <div className="mt-4 p-3 bg-sage/10 rounded-lg">
                            <div className="flex items-center space-x-2 mb-2">
                              <MessageSquare className="w-4 h-4 text-charcoal/70" />
                              <span className="text-sm font-medium text-charcoal/70">Message:</span>
                            </div>
                            <p className="text-charcoal/80">{swap.message}</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="sent" className="space-y-4">
              <h2 className="text-2xl font-semibold text-charcoal mb-4">Swap Requests Sent</h2>
              {sentSwaps.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <ArrowRightLeft className="w-12 h-12 text-charcoal/30 mx-auto mb-4" />
                    <p className="text-charcoal/70">No swap requests sent yet.</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4">
                  {sentSwaps.map((swap: any) => (
                    <Card key={swap.id} className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                              <span className="text-sm text-charcoal/70">Your Item:</span>
                              <span className="font-medium">{swap.requesterItem?.title || "Unknown Item"}</span>
                            </div>
                            <ArrowRightLeft className="w-4 h-4 text-charcoal/50" />
                            <div className="flex items-center space-x-2">
                              <span className="text-sm text-charcoal/70">Their Item:</span>
                              <span className="font-medium">{swap.ownerItem?.title || "Unknown Item"}</span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            {getStatusBadge(swap.status)}
                          </div>
                        </div>
                        {swap.message && (
                          <div className="mt-4 p-3 bg-sage/10 rounded-lg">
                            <div className="flex items-center space-x-2 mb-2">
                              <MessageSquare className="w-4 h-4 text-charcoal/70" />
                              <span className="text-sm font-medium text-charcoal/70">Your Message:</span>
                            </div>
                            <p className="text-charcoal/80">{swap.message}</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="available" className="space-y-4">
              <h2 className="text-2xl font-semibold text-charcoal mb-4">Available Items for Swapping</h2>
              {otherItems.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <ArrowRightLeft className="w-12 h-12 text-charcoal/30 mx-auto mb-4" />
                    <p className="text-charcoal/70">No items available for swapping at the moment.</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {otherItems.map((item: any) => (
                    <Card key={item.id} className="hover:shadow-lg transition-all duration-300">
                      <CardContent className="p-4">
                        <div className="aspect-square bg-sage/10 rounded-lg mb-4 flex items-center justify-center">
                          {item.images && item.images.length > 0 ? (
                            <img 
                              src={item.images[0]} 
                              alt={item.title} 
                              className="w-full h-full object-cover rounded-lg"
                            />
                          ) : (
                            <div className="text-charcoal/40">No Image</div>
                          )}
                        </div>
                        <h3 className="font-medium text-charcoal mb-2">{item.title}</h3>
                        <div className="flex items-center justify-between text-sm text-charcoal/70 mb-3">
                          <span>{item.category}</span>
                          <span>{item.condition}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <Badge variant="secondary">{item.pointsValue} points</Badge>
                          <Link href={`/item/${item.id}`}>
                            <Button size="sm" variant="outline">
                              View Details
                            </Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* New Swap Dialog */}
      <Dialog open={isSwapDialogOpen} onOpenChange={setIsSwapDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Start New Swap</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="user-item">Your Item to Swap</Label>
              <Select value={selectedUserItem} onValueChange={setSelectedUserItem}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your item" />
                </SelectTrigger>
                <SelectContent>
                  {myItems.map((item: any) => (
                    <SelectItem key={item.id} value={item.id}>
                      {item.title} - {item.category} ({item.condition})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="target-item">Item You Want</Label>
              <Select value={selectedTargetItem} onValueChange={setSelectedTargetItem}>
                <SelectTrigger>
                  <SelectValue placeholder="Select item you want" />
                </SelectTrigger>
                <SelectContent>
                  {otherItems.map((item: any) => (
                    <SelectItem key={item.id} value={item.id}>
                      {item.title} - {item.category} ({item.condition})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="message">Message to Owner</Label>
              <Textarea
                id="message"
                placeholder="Tell them why you'd like to swap..."
                value={swapMessage}
                onChange={(e) => setSwapMessage(e.target.value)}
                className="min-h-[100px]"
              />
            </div>

            <div className="flex justify-end space-x-3">
              <Button variant="outline" onClick={() => setIsSwapDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleCreateSwap}
                disabled={createSwapMutation.isPending}
                className="bg-gradient-to-r from-forest to-sage text-white"
              >
                {createSwapMutation.isPending ? "Sending..." : "Send Swap Request"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}