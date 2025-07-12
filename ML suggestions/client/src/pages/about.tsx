import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function About() {
  return (
    <div className="min-h-screen bg-warm-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-sage/20 to-forest/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-charcoal mb-6">
            About ReWear
          </h1>
          <p className="text-xl text-charcoal/80 mb-8 leading-relaxed">
            Revolutionizing sustainable fashion through AI-powered community swapping
          </p>
          <div className="flex justify-center items-center space-x-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-forest">2.5T</div>
              <div className="text-sm text-charcoal/60">CO2 Saved</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-forest">5K+</div>
              <div className="text-sm text-charcoal/60">Community Members</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-forest">10K+</div>
              <div className="text-sm text-charcoal/60">Items Swapped</div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-charcoal mb-4">Our Mission</h2>
            <p className="text-xl text-charcoal/80">
              Transforming the fashion industry through sustainable practices and community-driven solutions
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-semibold text-forest mb-4">The Problem We're Solving</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-terracotta rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-charcoal/80">
                    The fashion industry is the 2nd most polluting industry globally, contributing to 10% of global carbon emissions
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-terracotta rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-charcoal/80">
                    85% of textiles end up in landfills each year, with the average garment worn only 7 times
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-terracotta rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-charcoal/80">
                    Fast fashion creates 2,700 liters of water waste per cotton t-shirt produced
                  </p>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-2xl font-semibold text-forest mb-4">Our Solution</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-sage rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-charcoal/80">
                    Create a circular economy where clothes are shared, not wasted
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-sage rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-charcoal/80">
                    Use AI to match clothing items and suggest sustainable outfit combinations
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-sage rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-charcoal/80">
                    Gamify sustainable fashion choices with our points-based reward system
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How Our System Works */}
      <section className="py-16 bg-gradient-to-br from-sage/5 to-forest/5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-charcoal mb-4">How Our System Works</h2>
            <p className="text-xl text-charcoal/80">
              Understanding the technology and philosophy behind ReWear
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-white/80 backdrop-blur-md border-sage/20">
              <CardHeader>
                <CardTitle className="text-forest flex items-center">
                  <i className="fas fa-exchange-alt mr-2"></i>
                  Smart Swapping System
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-charcoal/70 mb-4">
                  Our intelligent swap system eliminates the traditional challenges of bartering:
                </p>
                <ul className="space-y-2 text-sm text-charcoal/70">
                  <li>• Points bridge value gaps between items</li>
                  <li>• AI calculates fair exchange rates</li>
                  <li>• Community feedback ensures quality</li>
                  <li>• Automated matching reduces friction</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-md border-sage/20">
              <CardHeader>
                <CardTitle className="text-forest flex items-center">
                  <i className="fas fa-robot mr-2"></i>
                  AI-Powered Styling
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-charcoal/70 mb-4">
                  Advanced AI analyzes fashion compatibility using:
                </p>
                <ul className="space-y-2 text-sm text-charcoal/70">
                  <li>• Color theory and seasonal trends</li>
                  <li>• Style coherence and occasion matching</li>
                  <li>• Personal preference learning</li>
                  <li>• Sustainable combination suggestions</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-md border-sage/20">
              <CardHeader>
                <CardTitle className="text-forest flex items-center">
                  <i className="fas fa-coins mr-2"></i>
                  Gamified Rewards
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-charcoal/70 mb-4">
                  Our points system incentivizes sustainable behavior:
                </p>
                <ul className="space-y-2 text-sm text-charcoal/70">
                  <li>• +10 points for listing items</li>
                  <li>• +20 points for successful swaps</li>
                  <li>• +20 points for donations</li>
                  <li>• +5 points for community feedback</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Environmental Impact */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-charcoal mb-4">Environmental Impact</h2>
            <p className="text-xl text-charcoal/80">
              Every swap makes a difference for our planet
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="bg-gradient-to-br from-forest/10 to-sage/20 border-sage/30">
              <CardHeader>
                <CardTitle className="text-forest">
                  <i className="fas fa-leaf mr-2"></i>
                  Carbon Footprint Reduction
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-charcoal/70 mb-4">
                  Each clothing swap prevents an average of 0.12kg of CO2 emissions by:
                </p>
                <ul className="space-y-2 text-sm text-charcoal/70">
                  <li>• Reducing demand for new production</li>
                  <li>• Minimizing transportation emissions</li>
                  <li>• Preventing textile waste decomposition</li>
                  <li>• Extending garment lifecycle</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-gold/10 to-terracotta/20 border-terracotta/30">
              <CardHeader>
                <CardTitle className="text-forest">
                  <i className="fas fa-tint mr-2"></i>
                  Water Conservation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-charcoal/70 mb-4">
                  Our platform saves approximately 20L of water per swap through:
                </p>
                <ul className="space-y-2 text-sm text-charcoal/70">
                  <li>• Avoided textile dyeing processes</li>
                  <li>• Reduced cotton cultivation needs</li>
                  <li>• Eliminated manufacturing washing</li>
                  <li>• Decreased chemical runoff</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Future Vision */}
      <section className="py-16 bg-gradient-to-br from-sage/10 to-forest/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-charcoal mb-4">Future Vision</h2>
            <p className="text-xl text-charcoal/80">
              Building the future of sustainable fashion
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-forest mb-4">
                <i className="fas fa-map-marker-alt mr-2"></i>
                Community Drop Points
              </h3>
              <p className="text-charcoal/70 mb-6">
                We're planning to establish physical drop-off locations in major cities, making clothing swaps even more convenient while supporting local communities.
              </p>
              
              <h3 className="text-xl font-semibold text-forest mb-4">
                <i className="fas fa-truck mr-2"></i>
                Delivery Optimization
              </h3>
              <p className="text-charcoal/70">
                Advanced logistics algorithms will optimize delivery routes, further reducing our carbon footprint while ensuring fast, efficient exchanges.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-forest mb-4">
                <i className="fas fa-users mr-2"></i>
                Global Community
              </h3>
              <p className="text-charcoal/70 mb-6">
                Expanding internationally to create a global network of sustainable fashion enthusiasts, sharing styles and cultures across borders.
              </p>
              
              <h3 className="text-xl font-semibold text-forest mb-4">
                <i className="fas fa-industry mr-2"></i>
                Brand Partnerships
              </h3>
              <p className="text-charcoal/70">
                Collaborating with ethical fashion brands to create a hybrid model that promotes both new sustainable production and circular economy principles.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-br from-forest to-sage text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Join the Sustainable Fashion Revolution</h2>
          <p className="text-xl mb-8 opacity-90">
            Every swap, every donation, every conscious choice makes a difference. Together, we can transform the fashion industry.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/api/login">
              <Button className="bg-white text-forest hover:bg-warm-white px-8 py-3 rounded-full font-semibold">
                <i className="fas fa-user-plus mr-2"></i>
                Join ReWear Today
              </Button>
            </Link>
            <Link href="/">
              <Button variant="outline" className="border-white text-white hover:bg-white/10 px-8 py-3 rounded-full font-semibold">
                <i className="fas fa-home mr-2"></i>
                Explore Platform
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}
