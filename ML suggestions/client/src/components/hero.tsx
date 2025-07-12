import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { Plus, Gauge, ArrowRightLeft, Search } from "lucide-react";

export default function Hero() {
  const { isAuthenticated } = useAuth();

  return (
    <section className="relative pt-16 pb-20 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-sage/20 to-forest/30"></div>
      <div className="absolute inset-0 bg-cover bg-center opacity-10" 
           style={{backgroundImage: "url('https://images.unsplash.com/photo-1445205170230-053b83016050?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1920&h=1080')"}}></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <div className="lg:grid lg:grid-cols-2 lg:gap-8 items-center">
          <div className="mb-16 lg:mb-0 animate-fade-in">
            <h1 className="text-4xl md:text-6xl font-bold text-charcoal mb-6">
              Swap, Share, 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-forest to-sage">
                Sustain
              </span>
            </h1>
            <p className="text-xl text-charcoal/80 mb-8 leading-relaxed">
              Transform your wardrobe sustainably. Trade clothes with our community, earn points, and get AI-powered outfit suggestions tailored just for you.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              {isAuthenticated ? (
                <>
                  <Link href="/add-item">
                    <Button className="bg-gradient-to-r from-forest to-sage text-white px-8 py-4 rounded-full font-semibold hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                      <Plus className="w-5 h-5 mr-2" />Start Listing
                    </Button>
                  </Link>
                  <Link href="/dashboard">
                    <Button className="bg-white/80 backdrop-blur-md border border-sage/30 text-forest px-8 py-4 rounded-full font-semibold hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                      <Gauge className="w-5 h-5 mr-2" />My Dashboard
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Button 
                    onClick={() => window.location.href = "/api/login"}
                    className="bg-gradient-to-r from-forest to-sage text-white px-8 py-4 rounded-full font-semibold hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  >
                    <ArrowRightLeft className="w-5 h-5 mr-2" />Start Swapping
                  </Button>
                  <Button className="bg-white/80 backdrop-blur-md border border-sage/30 text-forest px-8 py-4 rounded-full font-semibold hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                    <Search className="w-5 h-5 mr-2" />Browse Items
                  </Button>
                </>
              )}
            </div>
            
            <div className="flex items-center space-x-8">
              <div className="text-center animate-slide-up">
                <div className="text-2xl font-bold text-forest">10K+</div>
                <div className="text-sm text-charcoal/60">Items Swapped</div>
              </div>
              <div className="text-center animate-slide-up">
                <div className="text-2xl font-bold text-forest">5K+</div>
                <div className="text-sm text-charcoal/60">Active Users</div>
              </div>
              <div className="text-center animate-slide-up">
                <div className="text-2xl font-bold text-forest">2.5T</div>
                <div className="text-sm text-charcoal/60">CO2 Saved</div>
              </div>
            </div>
          </div>
          
          <div className="relative animate-fade-in">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/80 backdrop-blur-md rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <img 
                  src="https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=300" 
                  alt="Sustainable fashion style" 
                  className="w-full h-32 object-cover"
                />
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-charcoal">Vintage Blazer</span>
                    <span className="text-gold text-sm">✦ 150 pts</span>
                  </div>
                  <div className="flex items-center text-xs text-charcoal/60">
                    <i className="fas fa-robot mr-1"></i>AI Matched
                  </div>
                </div>
              </div>
              
              <div className="bg-white/80 backdrop-blur-md rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 mt-8">
                <img 
                  src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=300" 
                  alt="Colorful sustainable wardrobe" 
                  className="w-full h-32 object-cover"
                />
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-charcoal">Summer Dress</span>
                    <span className="text-gold text-sm">✦ 120 pts</span>
                  </div>
                  <div className="flex items-center text-xs text-charcoal/60">
                    <i className="fas fa-heart mr-1"></i>Featured
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
