import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Software Engineer at Google",
    avatar: "/api/placeholder/100/100",
    content: "CodeFusionAI completely transformed my learning experience. The AI assistant helped me understand complex algorithms in ways no other platform could. I landed my dream job at Google after completing their DSA course!",
    rating: 5,
    course: "Data Structures & Algorithms"
  },
  {
    name: "Marcus Rodriguez",
    role: "Full-Stack Developer",
    avatar: "/api/placeholder/100/100",
    content: "As someone who struggled with traditional learning methods, the personalized AI guidance was a game-changer. The instant debugging help saved me countless hours of frustration.",
    rating: 5,
    course: "Full-Stack Web Development"
  },
  {
    name: "Priya Patel",
    role: "Data Scientist at Microsoft",
    avatar: "/api/placeholder/100/100",
    content: "The Python course with AI assistance helped me transition from finance to tech. The explanations were clear, and the AI always knew exactly what I was struggling with. Now I'm working at Microsoft!",
    rating: 5,
    course: "Python Programming Mastery"
  },
  {
    name: "Alex Thompson",
    role: "Frontend Developer",
    avatar: "/api/placeholder/100/100",
    content: "I've tried many coding platforms, but CodeFusionAI's personalized approach is unmatched. The AI doesn't just give answers—it teaches you to think like a programmer.",
    rating: 5,
    course: "Web Development Foundations"
  },
  {
    name: "Elena Kowalski",
    role: "Tech Lead at Startup",
    avatar: "/api/placeholder/100/100",
    content: "The community and AI support made learning enjoyable rather than overwhelming. I went from complete beginner to leading a development team in just 8 months.",
    rating: 5,
    course: "Full-Stack Development"
  },
  {
    name: "David Kim",
    role: "Backend Developer",
    avatar: "/api/placeholder/100/100",
    content: "The AI assistant's debugging capabilities are incredible. It doesn't just find errors—it explains why they happened and how to prevent them. This platform made me a better programmer.",
    rating: 5,
    course: "Advanced Programming"
  }
];

export function TestimonialsSection() {
  return (
    <section className="py-24 bg-muted/20">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            Success Stories from <span className="gradient-text">Our Learners</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Join thousands of developers who transformed their careers with CodeFusionAI. Here's what they have to say about their journey.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card 
              key={index} 
              className="group relative overflow-hidden bg-card border-border/50 hover:border-primary/30 transition-all duration-300 glow-hover"
            >
              <CardContent className="p-6">
                {/* Quote Icon */}
                <div className="absolute top-4 right-4 opacity-10">
                  <Quote className="h-12 w-12 text-primary" />
                </div>

                {/* Rating */}
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>

                {/* Content */}
                <p className="text-muted-foreground mb-6 leading-relaxed relative z-10">
                  "{testimonial.content}"
                </p>

                {/* Course Badge */}
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-gradient-primary/10 border border-primary/20 mb-4">
                  <span className="text-xs font-medium text-primary">{testimonial.course}</span>
                </div>

                {/* Author */}
                <div className="flex items-center space-x-3">
                  <Avatar className="h-12 w-12 ring-2 ring-primary/10">
                    <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                    <AvatarFallback className="bg-gradient-primary text-white font-semibold">
                      {testimonial.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-semibold text-sm">{testimonial.name}</h4>
                    <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </CardContent>

              {/* Hover Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Card>
          ))}
        </div>

        {/* Bottom Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-8 mt-16 pt-16 border-t border-border/30">
          <div className="text-center">
            <div className="text-3xl font-bold gradient-text mb-2">50,000+</div>
            <div className="text-sm text-muted-foreground">Happy Learners</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold gradient-text mb-2">4.9/5</div>
            <div className="text-sm text-muted-foreground">Average Rating</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold gradient-text mb-2">85%</div>
            <div className="text-sm text-muted-foreground">Job Placement Rate</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold gradient-text mb-2">24/7</div>
            <div className="text-sm text-muted-foreground">AI Support</div>
          </div>
        </div>
      </div>
    </section>
  );
}