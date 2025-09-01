import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle, Zap, Brain, Code, ArrowRight } from "lucide-react";

const assistantFeatures = [
  {
    icon: MessageCircle,
    title: "Instant Code Explanations",
    description: "Ask questions about any code snippet and get clear, beginner-friendly explanations in seconds."
  },
  {
    icon: Zap,
    title: "Smart Debugging",
    description: "Stuck on an error? Our AI identifies the issue and provides step-by-step solutions."
  },
  {
    icon: Brain,
    title: "Personalized Learning",
    description: "Get custom study plans and recommendations based on your progress and learning style."
  },
  {
    icon: Code,
    title: "Code Optimization",
    description: "Learn best practices with AI-powered suggestions to improve your code quality and performance."
  }
];

export function AIAssistantSection() {
  return (
    <section id="ai-assistant" className="py-24 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
      
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div>
            <div className="inline-flex items-center space-x-2 bg-gradient-primary/10 backdrop-blur-sm border border-primary/20 rounded-full px-4 py-2 mb-6">
              <Brain className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">AI-Powered Assistant</span>
            </div>

            <h2 className="text-4xl sm:text-5xl font-bold mb-6">
              Your Personal <span className="gradient-text">Coding Mentor</span>
            </h2>
            
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Meet your 24/7 coding companion. Our advanced AI understands your learning journey and provides personalized guidance, instant help, and smart recommendations.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
              {assistantFeatures.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <Button 
              size="lg" 
              className="group bg-gradient-primary text-primary-foreground hover:opacity-90 glow-hover"
            >
              Try AI Assistant Free
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>

          {/* Right Content - Chat Interface Mockup */}
          <div className="relative">
            <Card className="bg-gradient-card border-border/50 shadow-hero">
              <CardContent className="p-6">
                {/* Chat Header */}
                <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-border/30">
                  <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center">
                    <Brain className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold">CodeFusion AI Assistant</h3>
                    <p className="text-xs text-muted-foreground">Online • Ready to help</p>
                  </div>
                </div>

                {/* Sample Chat Messages */}
                <div className="space-y-4 mb-6">
                  {/* User Message */}
                  <div className="flex justify-end">
                    <div className="bg-primary text-primary-foreground rounded-2xl rounded-br-md px-4 py-3 max-w-xs">
                      <p className="text-sm">Can you explain how binary search works?</p>
                    </div>
                  </div>

                  {/* AI Response */}
                  <div className="flex justify-start">
                    <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-3 max-w-sm">
                      <p className="text-sm mb-2">Great question! Binary search is like looking up a word in a dictionary...</p>
                      <div className="bg-card rounded-lg p-3 mt-2 font-mono text-xs">
                        <div className="text-blue-600">def</div>
                        <div className="ml-2">binary_search(arr, target):</div>
                        <div className="ml-4 text-gray-600"># Implementation here</div>
                      </div>
                    </div>
                  </div>

                  {/* Typing Indicator */}
                  <div className="flex justify-start">
                    <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-3">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-primary/50 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-primary/50 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-2 h-2 bg-primary/50 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Input Area */}
                <div className="flex items-center space-x-2 p-3 bg-muted/50 rounded-lg">
                  <div className="flex-1 text-sm text-muted-foreground">
                    Ask anything about code...
                  </div>
                  <Button size="sm" className="bg-gradient-primary text-primary-foreground">
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Floating Elements */}
            <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-primary/20 rounded-full blur-xl"></div>
            <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-secondary/20 rounded-full blur-xl"></div>
          </div>
        </div>
      </div>
    </section>
  );
}