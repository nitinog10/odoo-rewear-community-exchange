import { useEffect, useState } from "react";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export default function Admin() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

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

  const { data: allItems = [], isLoading: itemsLoading } = useQuery({
    queryKey: ['/api/admin/items'],
    enabled: !!user?.id,
  });

  const updateItemMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: any }) => {
      const response = await apiRequest('PATCH', `/api/admin/items/${id}`, updates);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Item Updated",
        description: "Item status has been updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/items'] });
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
        description: "Failed to update item. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleApprove = (itemId: string) => {
    updateItemMutation.mutate({
      id: itemId,
      updates: { status: 'approved' }
    });
  };

  const handleReject = (itemId: string) => {
    updateItemMutation.mutate({
      id: itemId,
      updates: { status: 'rejected' }
    });
  };

  const handleFeatureToggle = (itemId: string, isFeatured: boolean) => {
    updateItemMutation.mutate({
      id: itemId,
      updates: { isFeatured }
    });
  };

  if (isLoading || itemsLoading) {
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

  // Filter items based on search and status
  const filteredItems = allItems.filter((item: any) => {
    const matchesSearch = !searchTerm || 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || item.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const pendingCount = allItems.filter((item: any) => item.status === 'pending').length;
  const approvedCount = allItems.filter((item: any) => item.status === 'approved').length;
  const rejectedCount = allItems.filter((item: any) => item.status === 'rejected').length;
  const featuredCount = allItems.filter((item: any) => item.isFeatured).length;

  return (
    <div className="min-h-screen bg-warm-white">
      <Navbar />
      
      <div className="pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-charcoal mb-4">
              <i className="fas fa-shield-alt mr-3 text-forest"></i>
              Admin Dashboard
            </h1>
            <p className="text-xl text-charcoal/80">
              Manage items, moderate content, and oversee the ReWear community
            </p>
          </div>

          {/* Stats Overview */}
          <div className="grid md:grid-cols-4 gap-6 mb-12">
            <Card className="bg-gradient-to-br from-gold/10 to-terracotta/20 border-terracotta/30">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-terracotta mb-2">{pendingCount}</div>
                <div className="text-sm text-charcoal/70">Pending Approval</div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-forest/10 to-sage/20 border-sage/30">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-forest mb-2">{approvedCount}</div>
                <div className="text-sm text-charcoal/70">Approved Items</div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-rose-gold/10 to-terracotta/20 border-rose-gold/30">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-rose-gold mb-2">{rejectedCount}</div>
                <div className="text-sm text-charcoal/70">Rejected Items</div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-sage/10 to-forest/20 border-sage/30">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-sage mb-2">{featuredCount}</div>
                <div className="text-sm text-charcoal/70">Featured Items</div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-forest">
                <i className="fas fa-filter mr-2"></i>
                Filter Items
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="search">Search Items</Label>
                  <Input
                    id="search"
                    placeholder="Search by title or description..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="status">Status Filter</Label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Items</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-end">
                  <Button 
                    onClick={() => {
                      setSearchTerm("");
                      setStatusFilter("all");
                    }}
                    variant="outline"
                    className="border-sage text-sage hover:bg-sage/10"
                  >
                    <i className="fas fa-times mr-2"></i>
                    Clear Filters
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Items Management */}
          <Tabs defaultValue="all" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">All Items</TabsTrigger>
              <TabsTrigger value="pending">Pending ({pendingCount})</TabsTrigger>
              <TabsTrigger value="approved">Approved</TabsTrigger>
              <TabsTrigger value="featured">Featured</TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              <Card>
                <CardHeader>
                  <CardTitle className="text-forest">
                    <i className="fas fa-list mr-2"></i>
                    All Items ({filteredItems.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {filteredItems.length === 0 ? (
                    <div className="text-center py-12">
                      <i className="fas fa-inbox text-sage text-6xl mb-4"></i>
                      <h3 className="text-xl font-semibold text-charcoal mb-2">No items found</h3>
                      <p className="text-charcoal/70">
                        {searchTerm || statusFilter !== "all" 
                          ? "Try adjusting your filters" 
                          : "No items have been submitted yet"}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredItems.map((item: any) => (
                        <div key={item.id} className="border border-sage/20 rounded-lg p-4 hover:bg-sage/5 transition-colors">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-2">
                                <h3 className="text-lg font-semibold text-charcoal">{item.title}</h3>
                                <Badge 
                                  className={`${
                                    item.status === 'approved' ? 'bg-green-500' :
                                    item.status === 'pending' ? 'bg-yellow-500' :
                                    'bg-red-500'
                                  } text-white`}
                                >
                                  {item.status}
                                </Badge>
                                {item.isFeatured && (
                                  <Badge className="bg-gradient-to-r from-gold to-terracotta text-white">
                                    Featured
                                  </Badge>
                                )}
                                {item.isDonation && (
                                  <Badge className="bg-rose-gold text-white">
                                    Donation
                                  </Badge>
                                )}
                              </div>
                              
                              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                                <div>
                                  <div className="text-sm text-charcoal/60">Category</div>
                                  <div className="font-medium">{item.category}</div>
                                </div>
                                <div>
                                  <div className="text-sm text-charcoal/60">Type</div>
                                  <div className="font-medium">{item.type}</div>
                                </div>
                                <div>
                                  <div className="text-sm text-charcoal/60">Size</div>
                                  <div className="font-medium">{item.size}</div>
                                </div>
                                <div>
                                  <div className="text-sm text-charcoal/60">Points Value</div>
                                  <div className="font-medium text-gold">✦ {item.pointsValue}</div>
                                </div>
                              </div>
                              
                              {item.description && (
                                <p className="text-charcoal/70 mb-4">{item.description}</p>
                              )}
                              
                              <div className="text-sm text-charcoal/60">
                                Created: {new Date(item.createdAt).toLocaleDateString()} • 
                                Updated: {new Date(item.updatedAt).toLocaleDateString()}
                              </div>
                            </div>
                            
                            <div className="flex flex-col space-y-2 ml-4">
                              {item.status === 'pending' && (
                                <>
                                  <Button
                                    onClick={() => handleApprove(item.id)}
                                    disabled={updateItemMutation.isPending}
                                    className="gradient-forest-sage text-white"
                                    size="sm"
                                  >
                                    <i className="fas fa-check mr-1"></i>
                                    Approve
                                  </Button>
                                  <Button
                                    onClick={() => handleReject(item.id)}
                                    disabled={updateItemMutation.isPending}
                                    variant="destructive"
                                    size="sm"
                                  >
                                    <i className="fas fa-times mr-1"></i>
                                    Reject
                                  </Button>
                                </>
                              )}
                              
                              {item.status === 'approved' && (
                                <div className="flex items-center space-x-2">
                                  <Switch
                                    checked={item.isFeatured}
                                    onCheckedChange={(checked) => handleFeatureToggle(item.id, checked)}
                                    disabled={updateItemMutation.isPending}
                                  />
                                  <Label className="text-sm">Featured</Label>
                                </div>
                              )}
                              
                              <Button
                                variant="outline"
                                size="sm"
                                className="border-sage text-sage hover:bg-sage/10"
                              >
                                <i className="fas fa-eye mr-1"></i>
                                View
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="pending">
              <Card>
                <CardHeader>
                  <CardTitle className="text-forest">
                    <i className="fas fa-clock mr-2"></i>
                    Pending Approval ({pendingCount})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {pendingCount === 0 ? (
                    <div className="text-center py-12">
                      <i className="fas fa-check-circle text-sage text-6xl mb-4"></i>
                      <h3 className="text-xl font-semibold text-charcoal mb-2">All caught up!</h3>
                      <p className="text-charcoal/70">No items are waiting for approval</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {allItems.filter((item: any) => item.status === 'pending').map((item: any) => (
                        <div key={item.id} className="border border-yellow-200 rounded-lg p-4 bg-yellow-50">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="text-lg font-semibold text-charcoal mb-2">{item.title}</h3>
                              <div className="grid md:grid-cols-3 gap-4 mb-4">
                                <div>
                                  <div className="text-sm text-charcoal/60">Category</div>
                                  <div className="font-medium">{item.category} • {item.type}</div>
                                </div>
                                <div>
                                  <div className="text-sm text-charcoal/60">Size & Condition</div>
                                  <div className="font-medium">{item.size} • {item.condition}</div>
                                </div>
                                <div>
                                  <div className="text-sm text-charcoal/60">Points Value</div>
                                  <div className="font-medium text-gold">✦ {item.pointsValue}</div>
                                </div>
                              </div>
                              {item.description && (
                                <p className="text-charcoal/70 mb-2">{item.description}</p>
                              )}
                              <div className="text-sm text-charcoal/60">
                                Submitted: {new Date(item.createdAt).toLocaleDateString()}
                              </div>
                            </div>
                            
                            <div className="flex space-x-2 ml-4">
                              <Button
                                onClick={() => handleApprove(item.id)}
                                disabled={updateItemMutation.isPending}
                                className="gradient-forest-sage text-white"
                                size="sm"
                              >
                                <i className="fas fa-check mr-1"></i>
                                Approve
                              </Button>
                              <Button
                                onClick={() => handleReject(item.id)}
                                disabled={updateItemMutation.isPending}
                                variant="destructive"
                                size="sm"
                              >
                                <i className="fas fa-times mr-1"></i>
                                Reject
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="approved">
              <Card>
                <CardHeader>
                  <CardTitle className="text-forest">
                    <i className="fas fa-check-circle mr-2"></i>
                    Approved Items ({approvedCount})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {allItems.filter((item: any) => item.status === 'approved').map((item: any) => (
                      <div key={item.id} className="border border-green-200 rounded-lg p-4 bg-green-50">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="text-lg font-semibold text-charcoal">{item.title}</h3>
                              {item.isFeatured && (
                                <Badge className="bg-gradient-to-r from-gold to-terracotta text-white">
                                  Featured
                                </Badge>
                              )}
                            </div>
                            <div className="grid md:grid-cols-3 gap-4 mb-2">
                              <div>
                                <div className="text-sm text-charcoal/60">Category</div>
                                <div className="font-medium">{item.category} • {item.type}</div>
                              </div>
                              <div>
                                <div className="text-sm text-charcoal/60">Size & Condition</div>
                                <div className="font-medium">{item.size} • {item.condition}</div>
                              </div>
                              <div>
                                <div className="text-sm text-charcoal/60">Points Value</div>
                                <div className="font-medium text-gold">✦ {item.pointsValue}</div>
                              </div>
                            </div>
                            <div className="text-sm text-charcoal/60">
                              Approved: {new Date(item.updatedAt).toLocaleDateString()}
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-4 ml-4">
                            <div className="flex items-center space-x-2">
                              <Switch
                                checked={item.isFeatured}
                                onCheckedChange={(checked) => handleFeatureToggle(item.id, checked)}
                                disabled={updateItemMutation.isPending}
                              />
                              <Label className="text-sm">Featured</Label>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-sage text-sage hover:bg-sage/10"
                            >
                              <i className="fas fa-eye mr-1"></i>
                              View
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="featured">
              <Card>
                <CardHeader>
                  <CardTitle className="text-forest">
                    <i className="fas fa-star mr-2"></i>
                    Featured Items ({featuredCount})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {featuredCount === 0 ? (
                    <div className="text-center py-12">
                      <i className="fas fa-star text-sage text-6xl mb-4"></i>
                      <h3 className="text-xl font-semibold text-charcoal mb-2">No featured items</h3>
                      <p className="text-charcoal/70">Feature items to showcase them on the homepage</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {allItems.filter((item: any) => item.isFeatured).map((item: any) => (
                        <div key={item.id} className="border border-gold/30 rounded-lg p-4 bg-gradient-to-r from-gold/5 to-terracotta/5">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-2">
                                <h3 className="text-lg font-semibold text-charcoal">{item.title}</h3>
                                <Badge className="bg-gradient-to-r from-gold to-terracotta text-white">
                                  Featured
                                </Badge>
                              </div>
                              <div className="grid md:grid-cols-3 gap-4 mb-2">
                                <div>
                                  <div className="text-sm text-charcoal/60">Category</div>
                                  <div className="font-medium">{item.category} • {item.type}</div>
                                </div>
                                <div>
                                  <div className="text-sm text-charcoal/60">Size & Condition</div>
                                  <div className="font-medium">{item.size} • {item.condition}</div>
                                </div>
                                <div>
                                  <div className="text-sm text-charcoal/60">Points Value</div>
                                  <div className="font-medium text-gold">✦ {item.pointsValue}</div>
                                </div>
                              </div>
                              <div className="text-sm text-charcoal/60">
                                Featured since: {new Date(item.updatedAt).toLocaleDateString()}
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-4 ml-4">
                              <Switch
                                checked={item.isFeatured}
                                onCheckedChange={(checked) => handleFeatureToggle(item.id, checked)}
                                disabled={updateItemMutation.isPending}
                              />
                              <Button
                                variant="outline"
                                size="sm"
                                className="border-sage text-sage hover:bg-sage/10"
                              >
                                <i className="fas fa-eye mr-1"></i>
                                View
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
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
