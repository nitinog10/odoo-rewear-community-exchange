import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useIsMobile } from "@/hooks/use-mobile";
import { Recycle } from "lucide-react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [location] = useLocation();
  const { user, isAuthenticated } = useAuth();
  const isMobile = useIsMobile();

  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-sage/20 fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center cursor-pointer">
              <Recycle className="w-8 h-8 text-forest mr-2" />
              <span className="font-bold text-xl text-charcoal">ReWear</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          {!isMobile && (
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                <Link href="/" className={`transition-colors duration-200 ${
                  location === "/" ? "text-forest font-medium" : "text-charcoal hover:text-forest"
                }`}>
                  {isAuthenticated ? "Home" : "Browse"}
                </Link>
                
                {isAuthenticated && (
                  <>
                    <Link href="/dashboard" className={`transition-colors duration-200 ${
                      location === "/dashboard" ? "text-forest font-medium" : "text-charcoal hover:text-forest"
                    }`}>
                      Dashboard
                    </Link>
                    <Link href="/swap" className={`transition-colors duration-200 ${
                      location === "/swap" ? "text-forest font-medium" : "text-charcoal hover:text-forest"
                    }`}>
                      Swap Items
                    </Link>
                  </>
                )}
                
                <Link href="/about" className={`transition-colors duration-200 ${
                  location === "/about" ? "text-forest font-medium" : "text-charcoal hover:text-forest"
                }`}>
                  About Us
                </Link>
                
                {!isAuthenticated && (
                  <a href="#" className="text-charcoal hover:text-forest transition-colors duration-200">
                    How It Works
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Auth Section */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                {/* Points Badge */}
                <div className="flex items-center space-x-2">
                  <Badge className="bg-gradient-to-r from-gold to-terracotta text-white">
                    ✦ {user?.points || 0}
                  </Badge>
                </div>

                {/* User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user?.profileImageUrl || ""} alt={user?.firstName || ""} />
                        <AvatarFallback className="bg-sage/20 text-forest">
                          {user?.firstName?.[0] || "U"}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <div className="flex items-center justify-start gap-2 p-2">
                      <div className="flex flex-col space-y-1 leading-none">
                        <p className="font-medium">{user?.firstName} {user?.lastName}</p>
                        <p className="w-[200px] truncate text-sm text-muted-foreground">
                          {user?.email}
                        </p>
                      </div>
                    </div>
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard">
                        <i className="fas fa-tachometer-alt mr-2"></i>
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/add-item">
                        <i className="fas fa-plus mr-2"></i>
                        Add Item
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/swap">
                        <i className="fas fa-exchange-alt mr-2"></i>
                        Swap Items
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/admin">
                        <i className="fas fa-shield-alt mr-2"></i>
                        Admin Panel
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleLogout}>
                      <i className="fas fa-sign-out-alt mr-2"></i>
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Button
                  onClick={handleLogin}
                  className="bg-gradient-to-r from-forest to-sage text-white px-6 py-2 rounded-full hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                >
                  Login
                </Button>
                <Button
                  onClick={handleLogin}
                  className="bg-gradient-to-r from-gold to-terracotta text-white px-6 py-2 rounded-full hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                >
                  Sign Up
                </Button>
              </div>
            )}

            {/* Mobile Menu Button */}
            {isMobile && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden"
              >
                <i className={`fas ${isMenuOpen ? "fa-times" : "fa-bars"} text-forest`}></i>
              </Button>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobile && isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white/95 backdrop-blur-md border-t border-sage/20">
              <Link href="/" className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                location === "/" ? "text-forest bg-sage/10" : "text-charcoal hover:text-forest hover:bg-sage/5"
              }`}>
                {isAuthenticated ? "Home" : "Browse"}
              </Link>
              
              {isAuthenticated && (
                <>
                  <Link href="/dashboard" className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                    location === "/dashboard" ? "text-forest bg-sage/10" : "text-charcoal hover:text-forest hover:bg-sage/5"
                  }`}>
                    Dashboard
                  </Link>
                  <Link href="/swap" className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                    location === "/swap" ? "text-forest bg-sage/10" : "text-charcoal hover:text-forest hover:bg-sage/5"
                  }`}>
                    Swap Items
                  </Link>
                </>
              )}
              
              <Link href="/about" className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                location === "/about" ? "text-forest bg-sage/10" : "text-charcoal hover:text-forest hover:bg-sage/5"
              }`}>
                About Us
              </Link>
              
              {isAuthenticated && (
                <>
                  <Link href="/add-item" className="block px-3 py-2 rounded-md text-base font-medium text-charcoal hover:text-forest hover:bg-sage/5 transition-colors duration-200">
                    Add Item
                  </Link>
                  
                  <Link href="/swap" className="block px-3 py-2 rounded-md text-base font-medium text-charcoal hover:text-forest hover:bg-sage/5 transition-colors duration-200">
                    Swap Items
                  </Link>
                  
                  <Link href="/admin" className="block px-3 py-2 rounded-md text-base font-medium text-charcoal hover:text-forest hover:bg-sage/5 transition-colors duration-200">
                    Admin Panel
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
