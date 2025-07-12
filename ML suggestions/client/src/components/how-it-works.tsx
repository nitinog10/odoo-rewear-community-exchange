import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";
import { Plus, ArrowRightLeft, Heart, Rocket } from "lucide-react";

export default function HowItWorks() {
  return (
    <section className="py-20 bg-gradient-to-br from-forest/5 to-sage/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-charcoal mb-4">
            How ReWear Works
          </h2>
          <p className="text-xl text-charcoal/80">
            Join the sustainable fashion revolution in three simple steps
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center animate-fade-in">
            <div className="w-24 h-24 bg-gradient-to-br from-forest to-sage rounded-full flex items-center justify-center mx-auto mb-6">
              <Plus className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-charcoal mb-4">1. List Your Items</h3>
            <p className="text-charcoal/70 mb-6">
              Upload photos of clothes you no longer wear. Our AI helps categorize and optimize your listings for maximum visibility.
            </p>
            <Card className="bg-white/80 backdrop-blur-md border-sage/20 shadow-sm">
              <CardContent className="p-4">
                <div className="text-sm text-forest font-medium mb-2">Earn Points</div>
                <div className="text-2xl font-bold text-gold">+10 pts</div>
                <div className="text-xs text-charcoal/60">per item listed</div>
              </CardContent>
            </Card>
          </div>
          
          <div className="text-center animate-fade-in">
            <div className="w-24 h-24 bg-gradient-to-br from-gold to-terracotta rounded-full flex items-center justify-center mx-auto mb-6">
              <ArrowRightLeft className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-charcoal mb-4">2. Swap or Buy</h3>
            <p className="text-charcoal/70 mb-6">
              Browse items and make swap requests, or use your points to get items directly. Our AI suggests perfect matches for your style.
            </p>
            <Card className="bg-white/80 backdrop-blur-md border-sage/20 shadow-sm">
              <CardContent className="p-4">
                <div className="text-sm text-forest font-medium mb-2">Complete Swap</div>
                <div className="text-2xl font-bold text-gold">+20 pts</div>
                <div className="text-xs text-charcoal/60">+ positive feedback</div>
              </CardContent>
            </Card>
          </div>
          
          <div className="text-center animate-fade-in">
            <div className="w-24 h-24 bg-gradient-to-br from-rose-gold to-terracotta rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-charcoal mb-4">3. Give Back</h3>
            <p className="text-charcoal/70 mb-6">
              Donate items to help others in need. Track your environmental impact and see how much CO2 you've saved.
            </p>
            <Card className="bg-white/80 backdrop-blur-md border-sage/20 shadow-sm">
              <CardContent className="p-4">
                <div className="text-sm text-forest font-medium mb-2">Make Donation</div>
                <div className="text-2xl font-bold text-gold">+20 pts</div>
                <div className="text-xs text-charcoal/60">+ community impact</div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        <div className="text-center mt-12">
          <Link href="/api/login">
            <Button className="gradient-forest-sage text-white px-8 py-4 rounded-full font-semibold hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <i className="fas fa-rocket mr-2"></i>
              Get Started Today
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
