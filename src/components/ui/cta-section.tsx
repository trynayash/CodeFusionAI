import { Button } from './button';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles, Code, Brain } from "lucide-react";

export function CTASection() {
  const navigate = useNavigate();
  return (
    <section id="pricing" className="py-24 relative overflow-hidden">
      {/* Background with Gradient */}
      <div className="absolute inset-0 gradient-bg opacity-90" />
      
      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 opacity-20">
          <Code className="h-24 w-24 text-white float" />
        </div>
        <div className="absolute top-20 right-20 opacity-20" style={{ animationDelay: '2s' }}>
          <Brain className="h-16 w-16 text-white float" />
        </div>
        <div className="absolute bottom-20 left-1/4 opacity-20" style={{ animationDelay: '4s' }}>
          <Sparkles className="h-20 w-20 text-white float" />
        </div>
      </div>

      <div className="container max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center text-white">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-8">
            <Sparkles className="h-4 w-4" />
            <span className="text-sm font-medium">Limited Time - Forever Free</span>
          </div>

          {/* Main Heading */}
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            Ready to Transform Your
            <br />
            <span className="text-white/90">Coding Journey?</span>
          </h2>

          {/* Description */}
          <p className="text-xl sm:text-2xl text-white/80 mb-8 max-w-3xl mx-auto leading-relaxed">
            Join thousands of developers who are already mastering programming with AI-powered assistance. 
            Start your free journey today—no credit card required.
          </p>

          {/* Features List */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10 max-w-2xl mx-auto">
            <div className="flex items-center justify-center space-x-2">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <span className="text-white/90 text-sm">100% Free Forever</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <span className="text-white/90 text-sm">No Credit Card Needed</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <span className="text-white/90 text-sm">24/7 AI Support</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <Button 
              size="lg" 
              className="group bg-white text-primary hover:bg-white/90 shadow-hero px-8 py-4 text-lg font-semibold rounded-xl"
              onClick={() => navigate('/auth')}
            >
              Start Learning Now
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            
            <Button 
              size="lg" 
              variant="outline" 
              className="group bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white hover:bg-white/20 px-8 py-4 text-lg font-semibold rounded-xl"
            >
              Explore Courses
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="flex items-center justify-center space-x-8 text-white/60 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center">
                <span className="text-xs font-bold">50K+</span>
              </div>
              <span>Active Learners</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center">
                <span className="text-xs font-bold">4.9</span>
              </div>
              <span>Rating</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center">
                <span className="text-xs font-bold">24/7</span>
              </div>
              <span>Support</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}