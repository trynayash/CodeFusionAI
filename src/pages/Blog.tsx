import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, User, ArrowRight, Clock, Tag } from 'lucide-react';
import { Header } from '@/components/ui/header';
import { Footer } from '@/components/ui/footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import CodeFusionLogo from '@/components/CodeFusionLogo';

const blogPosts = [
  {
    id: 1,
    title: "The Future of AI-Powered Code Learning",
    excerpt: "Discover how artificial intelligence is revolutionizing the way developers learn and write code, making programming more accessible than ever.",
    author: "Sarah Chen",
    date: "Mar 8, 2025",
    readTime: "5 min read",
    category: "AI & Development",
    image: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=500&h=300&fit=crop",
    featured: true
  },
  {
    id: 2,
    title: "Best Practices for Learning Data Structures",
    excerpt: "Master the fundamentals with our comprehensive guide to understanding and implementing common data structures effectively.",
    author: "Mike Johnson",
    date: "April 6, 2025",
    readTime: "8 min read",
    category: "Data Structures",
    image: "https://images.unsplash.com/photo-1518932945647-7a1c969f8be2?w=500&h=300&fit=crop"
  },
  {
    id: 3,
    title: "Building Your First Full-Stack Application",
    excerpt: "Step-by-step tutorial on creating a complete web application from frontend to backend deployment.",
    author: "Emily Rodriguez",
    date: "July 4, 2025",
    readTime: "12 min read",
    category: "Full-Stack",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&h=300&fit=crop"
  },
  {
    id: 4,
    title: "JavaScript ES2025: New Features You Should Know",
    excerpt: "Explore the latest JavaScript features and how they can improve your code quality and developer experience.",
    author: "David Kim",
    date: "January 2, 2025",
    readTime: "6 min read",
    category: "JavaScript",
    image: "https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=500&h=300&fit=crop"
  },
  {
    id: 5,
    title: "Code Review Best Practices for Teams",
    excerpt: "Learn how to conduct effective code reviews that improve code quality while fostering team collaboration.",
    author: "Lisa Wang",
    date: "August 30, 2025",
    readTime: "7 min read",
    category: "Team Management",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=500&h=300&fit=crop"
  }
];

const categories = ["All", "AI & Development", "Data Structures", "Full-Stack", "JavaScript", "Team Management"];

export default function Blog() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = React.useState("All");

  const filteredPosts = selectedCategory === "All" 
    ? blogPosts 
    : blogPosts.filter(post => post.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gradientBased on my analysis, you have a solid foundation with **4 completed pages/components** out of **37 total needed pages** (10.8% complete). You have the core UI components and blog functionality, but you're missing the main platform pages.

**Most Critical Missing Pages:**
1. **Home/Landing Page** - Your main entry point
2. **Code Editor** - Core functionality with 20+ language support
3. **Authentication** - User login/signup
4. **Dashboard** - User's main hub
5. **Courses** - Learning content

I've configured **20+ programming languages** with compiler endpoints, syntax highlighting, and default code templates. Each language includes:
- Compilation/execution endpoints
- Syntax highlighting
- Default starter code
- Framework information
- Use case descriptions

Would you like me to start implementing any specific pages? I'd recommend starting with:
1. **Home/Landing Page** - Showcase your platform
2. **Code Editor Page** - The core compiler functionality
3. **Authentication Page** - User management

Which page would you like me to build first?src/
├── components/
│   ├── ui/ (✅ Basic components done)
│   ├── layout/ (Header ✅, Footer ✅)
│   ├── editor/ (Code editor components)
│   ├── course/ (Learning components)
│   ├── community/ (Social components)
│   └── dashboard/ (User dashboard components)
├── pages/ (Blog ✅, need 30+ more)
├── hooks/ (Custom React hooks)
├── services/ (API calls, compiler integration)
├── config/ (Language config ✅)
└── utils/ (Helper functions)# CodeFusion AI - Page Structure Analysis & Implementation Plan

## 🎯 Current Status Analysis

### ✅ **Completed Pages/Components**
1. **Header Component** (`src/components/ui/header.tsx`) - ✅ Complete
   - Navigation menu with all major sections
   - Authentication buttons
   - Theme toggle
   - Mobile responsive hamburger menu

2. **Footer Component** (`src/components/ui/footer.tsx`) - ✅ Complete
   - Programming languages showcase
   - Newsletter signup
   - Social links
   - Comprehensive footer links

3. **Blog Page** (`src/pages/Blog.tsx`) - ✅ Complete
   - Category filtering
   - Featured posts
   - Responsive grid layout
   - Individual blog post cards

4. **UI Components** - ✅ Complete
   - Button component with multiple variants
   - Card component
   - Basic UI foundation

### 🚧 **Pages Referenced in Header but Missing**
Based on the header navigation, these pages need to be created:

1. **Home/Landing Page** (`/`) - ❌ Missing
2. **Courses/Tutorials Page** (`/courses`) - ❌ Missing  
3. **Code Editor Page** (`/editor`) - ❌ Missing
4. **AI Assistant Page** (`/ai-assistant`) - ❌ Missing
5. **Features Page** (`/features`) - ❌ Missing
6. **Pricing Page** (`/pricing`) - ❌ Missing
7. **Community Page** (`/community`) - ❌ Missing
8. **Help Page** (`/help`) - ❌ Missing
9. **Authentication Page** (`/auth`) - ❌ Missing
10. **Dashboard Page** (`/dashboard`) - ❌ Missing

### 🎯 **Additional Pages Needed for Complete Platform**

#### Core Learning Platform
11. **Course Detail Page** (`/courses/:id`) - ❌ Missing
12. **Lesson Page** (`/courses/:courseId/lessons/:lessonId`) - ❌ Missing
13. **Practice Challenges** (`/challenges`) - ❌ Missing
14. **Challenge Detail** (`/challenges/:id`) - ❌ Missing
15. **Code Playground** (`/playground`) - ❌ Missing
16. **Project Gallery** (`/projects`) - ❌ Missing
17. **Project Detail** (`/projects/:id`) - ❌ Missing

#### User Management
18. **User Profile** (`/profile`) - ❌ Missing
19. **Settings** (`/settings`) - ❌ Missing
20. **Progress Tracking** (`/progress`) - ❌ Missing
21. **Achievements** (`/achievements`) - ❌ Missing

#### Community Features
22. **Forums** (`/forums`) - ❌ Missing
23. **Forum Topic** (`/forums/:topicId`) - ❌ Missing
24. **Code Reviews** (`/code-reviews`) - ❌ Missing
25. **Mentorship** (`/mentorship`) - ❌ Missing

#### Content Management
26. **Blog Post Detail** (`/blog/:id`) - ❌ Missing
27. **Documentation** (`/docs`) - ❌ Missing
28. **API Documentation** (`/docs/api`) - ❌ Missing
29. **Tutorials Hub** (`/tutorials`) - ❌ Missing

#### Administrative
30. **Admin Dashboard** (`/admin`) - ❌ Missing
31. **Content Management** (`/admin/content`) - ❌ Missing
32. **User Management** (`/admin/users`) - ❌ Missing
33. **Analytics** (`/admin/analytics`) - ❌ Missing

#### Legal & Support
34. **Terms of Service** (`/terms`) - ❌ Missing
35. **Privacy Policy** (`/privacy`) - ❌ Missing
36. **Contact** (`/contact`) - ❌ Missing
37. **About** (`/about`) - ❌ Missing

## 🏗️ **Implementation Priority**

### Phase 1: Core Platform (High Priority)
1. **Home/Landing Page** - Entry point, showcases platform
2. **Authentication Page** - User login/signup
3. **Dashboard** - User's main hub after login
4. **Code Editor** - Core functionality for coding
5. **Courses Page** - Learning content discovery

### Phase 2: Learning Experience (High Priority)
6. **Course Detail Page** - Individual course information
7. **Lesson Page** - Actual learning content
8. **Code Playground** - Practice environment
9. **AI Assistant** - AI-powered help
10. **Practice Challenges** - Skill building

### Phase 3: Community & Features (Medium Priority)
11. **Community Page** - User interaction hub
12. **Features Page** - Platform capabilities showcase
13. **User Profile** - Personal information management
14. **Progress Tracking** - Learning analytics
15. **Project Gallery** - Showcase user projects

### Phase 4: Business & Support (Medium Priority)
16. **Pricing Page** - Subscription plans
17. **Help Page** - Support and documentation
18. **Contact Page** - Customer support
19. **About Page** - Company information
20. **Blog Post Detail** - Individual blog posts

### Phase 5: Advanced Features (Low Priority)
21. **Forums** - Community discussions
22. **Code Reviews** - Peer review system
23. **Mentorship** - Expert guidance
24. **Admin Dashboard** - Platform management
25. **Analytics** - Usage insights

## 🛠️ **Technical Architecture Recommendations**

### Routing Structure
```typescript
// Main Routes
/ - Landing Page
/auth - Authentication
/dashboard - User Dashboard
/editor - Code Editor
/courses - Course Listing
/courses/:id - Course Detail
/courses/:courseId/lessons/:lessonId - Lesson View
/playground - Code Playground
/ai-assistant - AI Helper
/challenges - Practice Challenges
/community - Community Hub
/profile - User Profile
/blog - Blog Listing (✅ Done)
/blog/:id - Blog Post Detail-subtle">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4">
        <div className="container max-w-7xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="mb-8 text-muted-foreground hover:text-primary"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold gradient-text mb-6">
              Developer Blog
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Insights, tutorials, and thought leadership from the CodeFusionAI community
            </p>
          </motion.div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="px-4 mb-12">
        <div className="container max-w-7xl mx-auto">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="transition-all duration-200"
              >
                <Tag className="w-4 h-4 mr-2" />
                {category}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Post */}
      {selectedCategory === "All" && (
        <section className="px-4 mb-16">
          <div className="container max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="overflow-hidden bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
                <div className="grid lg:grid-cols-2 gap-0">
                  <div className="relative overflow-hidden">
                    <img 
                      src={blogPosts[0].image} 
                      alt={blogPosts[0].title}
                      className="w-full h-64 lg:h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent"></div>
                  </div>
                  
                  <div className="p-8 lg:p-12 flex flex-col justify-center">
                    <div className="flex items-center gap-4 mb-4">
                      <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                        Featured
                      </span>
                      <span className="text-sm text-muted-foreground">{blogPosts[0].category}</span>
                    </div>
                    
                    <h2 className="text-3xl font-bold mb-4 hover:text-primary transition-colors cursor-pointer">
                      {blogPosts[0].title}
                    </h2>
                    
                    <p className="text-muted-foreground mb-6 leading-relaxed">
                      {blogPosts[0].excerpt}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          {blogPosts[0].author}
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          {blogPosts[0].date}
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          {blogPosts[0].readTime}
                        </div>
                      </div>
                      
                      <Button variant="outline" className="hover-scale">
                        Read More <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </section>
      )}

      {/* Blog Grid */}
      <section className="px-4 pb-20">
        <div className="container max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.slice(selectedCategory === "All" ? 1 : 0).map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
              >
                <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 hover-scale">
                  <div className="relative">
                    <img 
                      src={post.image} 
                      alt={post.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="px-2 py-1 bg-background/80 backdrop-blur-sm text-xs font-medium rounded-full">
                        {post.category}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-3 hover:text-primary transition-colors cursor-pointer line-clamp-2">
                      {post.title}
                    </h3>
                    
                    <p className="text-muted-foreground mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                    
                    <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        {post.author}
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        {post.readTime}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">{post.date}</span>
                      <Button variant="ghost" size="sm" className="hover:text-primary">
                        Read More <ArrowRight className="w-4 h-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}