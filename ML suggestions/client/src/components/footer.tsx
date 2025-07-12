import { Link } from "wouter";
import { Recycle, Instagram, Twitter, Facebook } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-charcoal text-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center mb-6">
              <Recycle className="w-8 h-8 text-sage mr-3" />
              <span className="font-bold text-2xl">ReWear</span>
            </div>
            <p className="text-white/80 mb-6 max-w-md">
              Join the sustainable fashion revolution. Swap, share, and sustain with our AI-powered community marketplace.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="bg-sage/20 hover:bg-sage/30 p-3 rounded-full transition-colors duration-200">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="bg-sage/20 hover:bg-sage/30 p-3 rounded-full transition-colors duration-200">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="bg-sage/20 hover:bg-sage/30 p-3 rounded-full transition-colors duration-200">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="bg-sage/20 hover:bg-sage/30 p-3 rounded-full transition-colors duration-200">
                <Recycle className="w-5 h-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold text-lg mb-4">Company</h4>
            <ul className="space-y-3 text-white/80">
              <li>
                <Link href="/about" className="hover:text-sage transition-colors duration-200">About Us</Link>
              </li>
              <li>
                <a href="#" className="hover:text-sage transition-colors duration-200">How It Works</a>
              </li>
              <li>
                <a href="#" className="hover:text-sage transition-colors duration-200">Sustainability</a>
              </li>
              <li>
                <a href="#" className="hover:text-sage transition-colors duration-200">Press</a>
              </li>
              <li>
                <a href="#" className="hover:text-sage transition-colors duration-200">Careers</a>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-lg mb-4">Support</h4>
            <ul className="space-y-3 text-white/80">
              <li>
                <a href="#" className="hover:text-sage transition-colors duration-200">Help Center</a>
              </li>
              <li>
                <a href="#" className="hover:text-sage transition-colors duration-200">Contact Us</a>
              </li>
              <li>
                <a href="#" className="hover:text-sage transition-colors duration-200">Community Guidelines</a>
              </li>
              <li>
                <a href="#" className="hover:text-sage transition-colors duration-200">Privacy Policy</a>
              </li>
              <li>
                <a href="#" className="hover:text-sage transition-colors duration-200">Terms of Service</a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/20 mt-12 pt-8 text-center text-white/60">
          <p>&copy; 2024 ReWear. All rights reserved. Built with ❤️ for sustainable fashion.</p>
        </div>
      </div>
    </footer>
  );
}
