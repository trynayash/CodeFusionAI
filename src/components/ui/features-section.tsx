import { Card, CardContent } from "@/components/ui/card";
import { Bot, Code, Zap, Users, Trophy, Lightbulb } from "lucide-react";

const features = [
  {
    icon: Bot,
    title: "AI-Powered Learning",
    description: "Get instant code explanations, debugging help, and personalized learning recommendations from our advanced AI assistant.",
    gradient: "from-primary to-secondary"
  },
  {
    icon: Code,
    title: "Interactive Code Editor",
    description: "Practice coding in our browser-based editor with real-time feedback, syntax highlighting, and intelligent autocomplete.",
    gradient: "from-secondary to-accent"
  },
  {
    icon: Zap,
    title: "Instant Debugging",
    description: "Stuck on an error? Our AI analyzes your code and provides clear explanations and fixes for any issues.",
    gradient: "from-accent to-primary"
  },
  {
    icon: Users,
    title: "Community Support",
    description: "Join thousands of learners in our vibrant community. Share projects, ask questions, and learn together.",
    gradient: "from-primary to-accent"
  },
  {
    icon: Trophy,
    title: "Progress Tracking",
    description: "Monitor your learning journey with detailed analytics, achievements, and completion certificates.",
    gradient: "from-secondary to-primary"
  },
  {
    icon: Lightbulb,
    title: "Smart Recommendations",
    description: "Receive personalized course suggestions and learning paths based on your progress and career goals.",
    gradient: "from-accent to-secondary"
  }
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 relative">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            Why Choose <span className="gradient-text">CodeFusion AI</span>?
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Experience the future of coding education with AI-powered features designed to accelerate your learning journey.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card 
                key={index} 
                className="group relative overflow-hidden bg-gradient-card border-border/50 hover:border-primary/30 transition-all duration-300 glow-hover"
              >
                <CardContent className="p-8">
                  {/* Icon with Gradient Background */}
                  <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br ${feature.gradient} mb-6 shadow-lg`}>
                    <Icon className="h-7 w-7 text-white" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>

                {/* Hover Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Card>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <p className="text-lg text-muted-foreground mb-6">
            Ready to experience the future of coding education?
          </p>
          <div className="inline-flex items-center space-x-2 text-primary font-medium cursor-pointer hover:text-primary-dark transition-colors">
            <span>Explore all features</span>
            <svg className="w-5 h-5 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}