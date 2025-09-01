import { Button } from "@/components/ui/button";
import { ArrowRight, Play, Sparkles, Code2, Brain } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 gradient-bg opacity-10" />
      
      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 opacity-20">
          <Code2 className="h-16 w-16 text-primary float" />
        </div>
        <div className="absolute top-40 right-20 opacity-20" style={{ animationDelay: '2s' }}>
          <Brain className="h-12 w-12 text-secondary float" />
        </div>
        <div className="absolute bottom-40 left-20 opacity-20" style={{ animationDelay: '4s' }}>
          <Sparkles className="h-20 w-20 text-accent float" />
        </div>
      </div>

      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-5xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 bg-gradient-primary/10 backdrop-blur-sm border border-primary/20 rounded-full px-4 py-2 mb-8 animate-fadeInUp">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">Free AI-Powered Learning</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
            Learn. Build. Debug.{" "}
            <span className="gradient-text">Evolve with AI</span>
          </h1>

          {/* Subheading */}
          <p className="text-xl sm:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed animate-fadeInUp" style={{ animationDelay: '0.4s' }}>
            Master coding from zero to hero with our AI-powered platform. Get personalized learning paths, instant debugging help, and real-time code explanations.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12 animate-fadeInUp" style={{ animationDelay: '0.6s' }}>
            <Button 
              size="xl" 
              variant="hero"
              className="group"
            >
              Start Learning Free
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            
            <Button 
              size="xl" 
              variant="glass" 
              className="group hover:border-primary/50 hover:bg-primary/5"
            >
              <Play className="mr-2 h-5 w-5" />
              Watch Demo
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-2xl mx-auto animate-fadeInUp" style={{ animationDelay: '0.8s' }}>
            <div className="text-center">
              <div className="text-3xl font-bold gradient-text mb-2">100%</div>
              <div className="text-sm text-muted-foreground">Free Forever</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold gradient-text mb-2">24/7</div>
              <div className="text-sm text-muted-foreground">AI Assistant</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold gradient-text mb-2">1000+</div>
              <div className="text-sm text-muted-foreground">Coding Challenges</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}