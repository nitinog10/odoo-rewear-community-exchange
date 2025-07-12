import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/components/navbar";
import Hero from "@/components/hero";
import FeaturedItems from "@/components/featured-items";
import HowItWorks from "@/components/how-it-works";
import AISuggestions from "@/components/ai-suggestions";
import Footer from "@/components/footer";
import { Leaf, Droplets, Recycle, Users } from "lucide-react";

export default function Landing() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-warm-white">
      <Navbar />
      <Hero />
      <AISuggestions />
      <FeaturedItems />
      <HowItWorks />
      
      {/* Impact Section */}
      <section className="py-20 bg-gradient-to-br from-forest/10 to-sage/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-charcoal mb-4">
              Our Environmental Impact
            </h2>
            <p className="text-xl text-charcoal/80">
              Together, we're making a difference for our planet
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center animate-fade-in">
              <div className="w-20 h-20 bg-gradient-to-br from-forest to-sage rounded-full flex items-center justify-center mx-auto mb-4">
                <Leaf className="w-8 h-8 text-white" />
              </div>
              <div className="text-3xl font-bold text-forest mb-2">2.5T</div>
              <div className="text-sm text-charcoal/70">CO2 Emissions Saved</div>
            </div>
            
            <div className="text-center animate-fade-in">
              <div className="w-20 h-20 bg-gradient-to-br from-gold to-terracotta rounded-full flex items-center justify-center mx-auto mb-4">
                <Droplets className="w-8 h-8 text-white" />
              </div>
              <div className="text-3xl font-bold text-forest mb-2">450K</div>
              <div className="text-sm text-charcoal/70">Liters of Water Saved</div>
            </div>
            
            <div className="text-center animate-fade-in">
              <div className="w-20 h-20 bg-gradient-to-br from-rose-gold to-terracotta rounded-full flex items-center justify-center mx-auto mb-4">
                <Recycle className="w-8 h-8 text-white" />
              </div>
              <div className="text-3xl font-bold text-forest mb-2">10K+</div>
              <div className="text-sm text-charcoal/70">Items Diverted from Landfill</div>
            </div>
            
            <div className="text-center animate-fade-in">
              <div className="w-20 h-20 bg-gradient-to-br from-sage to-forest rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <div className="text-3xl font-bold text-forest mb-2">5K+</div>
              <div className="text-sm text-charcoal/70">Community Members</div>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}
