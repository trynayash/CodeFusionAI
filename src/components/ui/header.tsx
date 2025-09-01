import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Code, Sparkles } from "lucide-react";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border/30">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Code className="h-8 w-8 text-primary" />
              <Sparkles className="h-4 w-4 text-accent absolute -top-1 -right-1" />
            </div>
            <h1 className="text-xl font-bold gradient-text">CodeFusion AI</h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-foreground/80 hover:text-primary transition-colors">
              Features
            </a>
            <a href="#courses" className="text-foreground/80 hover:text-primary transition-colors">
              Courses
            </a>
            <a href="#ai-assistant" className="text-foreground/80 hover:text-primary transition-colors">
              AI Assistant
            </a>
            <a href="#pricing" className="text-foreground/80 hover:text-primary transition-colors">
              Pricing
            </a>
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="glass" className="text-foreground/80 hover:text-primary">
              Sign In
            </Button>
            <Button variant="gradient" className="glow-hover">
              Get Started Free
            </Button>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border/30">
            <nav className="flex flex-col space-y-3">
              <a href="#features" className="text-foreground/80 hover:text-primary transition-colors px-4 py-2">
                Features
              </a>
              <a href="#courses" className="text-foreground/80 hover:text-primary transition-colors px-4 py-2">
                Courses
              </a>
              <a href="#ai-assistant" className="text-foreground/80 hover:text-primary transition-colors px-4 py-2">
                AI Assistant
              </a>
              <a href="#pricing" className="text-foreground/80 hover:text-primary transition-colors px-4 py-2">
                Pricing
              </a>
              <div className="flex flex-col space-y-2 px-4 pt-4 border-t border-border/30">
                <Button variant="glass" className="justify-start">
                  Sign In
                </Button>
                <Button variant="gradient" className="justify-start">
                  Get Started Free
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}