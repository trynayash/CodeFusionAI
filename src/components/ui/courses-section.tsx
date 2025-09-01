import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Users, Star, ArrowRight } from "lucide-react";

const courses = [
  {
    title: "Data Structures & Algorithms",
    description: "Master DSA with comprehensive coverage from basics to advanced topics. Includes 500+ problems and detailed explanations.",
    level: "Beginner to Advanced",
    duration: "12 weeks",
    students: "15,000+",
    rating: 4.9,
    topics: ["Arrays", "Linked Lists", "Trees", "Graphs", "Dynamic Programming"],
    gradient: "from-primary to-secondary",
    popular: true
  },
  {
    title: "Full-Stack Web Development",
    description: "Build modern web applications from scratch. Learn React, Node.js, databases, and deployment strategies.",
    level: "Beginner",
    duration: "16 weeks",
    students: "12,000+",
    rating: 4.8,
    topics: ["HTML/CSS", "JavaScript", "React", "Node.js", "MongoDB"],
    gradient: "from-secondary to-accent"
  },
  {
    title: "Python Programming Mastery",
    description: "Complete Python course covering fundamentals, OOP, web scraping, data analysis, and machine learning basics.",
    level: "Beginner",
    duration: "10 weeks",
    students: "18,000+",
    rating: 4.9,
    topics: ["Python Basics", "OOP", "Web Scraping", "Data Analysis", "APIs"],
    gradient: "from-accent to-primary"
  }
];

export function CoursesSection() {
  return (
    <section id="courses" className="py-24 bg-muted/30">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            Our <span className="gradient-text">Learning Paths</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Structured courses designed to take you from beginner to professional. Each path includes hands-on projects and AI-powered assistance.
          </p>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {courses.map((course, index) => (
            <Card 
              key={index} 
              className="group relative overflow-hidden bg-card border-border/50 hover:border-primary/30 transition-all duration-300 glow-hover"
            >
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between mb-4">
                  <Badge 
                    variant="secondary" 
                    className={`bg-gradient-to-r ${course.gradient} text-white font-medium`}
                  >
                    {course.level}
                  </Badge>
                  {course.popular && (
                    <Badge variant="outline" className="border-accent text-accent">
                      Most Popular
                    </Badge>
                  )}
                </div>
                
                <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                  {course.title}
                </h3>
                
                <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                  {course.description}
                </p>

                {/* Course Stats */}
                <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{course.duration}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="h-4 w-4" />
                    <span>{course.students}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span>{course.rating}</span>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                {/* Topics */}
                <div className="mb-6">
                  <p className="text-sm font-medium mb-2">What you'll learn:</p>
                  <div className="flex flex-wrap gap-2">
                    {course.topics.map((topic, topicIndex) => (
                      <Badge key={topicIndex} variant="outline" className="text-xs">
                        {topic}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* CTA Button */}
                <Button 
                  className="w-full group bg-gradient-primary text-primary-foreground hover:opacity-90"
                >
                  Start Learning Free
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardContent>

              {/* Hover Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Card>
          ))}
        </div>

        {/* View All Courses CTA */}
        <div className="text-center">
          <Button 
            size="lg" 
            variant="outline" 
            className="group bg-background/50 backdrop-blur-sm border-2 border-primary/30 hover:border-primary/50 hover:bg-primary/5"
          >
            View All Courses
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </section>
  );
}