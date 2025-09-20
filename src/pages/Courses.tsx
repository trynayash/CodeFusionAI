 import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, Clock, Users, Star, Trophy, Target, ArrowRight, Play, 
  Filter, Search, Grid, List, ChevronDown, Heart, Share2,
  Award, Infinity, Smartphone, FileText, CheckCircle, IndianRupee
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Header } from '@/components/ui/header';
import { Footer } from '@/components/ui/footer';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { paymentService } from '@/services/PaymentService';
import { coursesData, learningPaths, categories, levels, sortOptions } from '@/data/coursesData';

export default function Courses() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Courses');
  const [selectedLevel, setSelectedLevel] = useState('All Levels');
  const [sortBy, setSortBy] = useState('popular');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [enrolledCourses, setEnrolledCourses] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      loadEnrolledCourses();
    }
  }, [user]);

  const loadEnrolledCourses = async () => {
    try {
      const enrolled = await paymentService.getUserEnrollments();
      setEnrolledCourses(enrolled);
    } catch (error) {
      console.error('Error loading enrolled courses:', error);
    }
  };

  const handleEnrollment = async (courseId: string) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to enroll in courses.",
        variant: "destructive",
      });
      navigate('/auth');
      return;
    }

    const course = coursesData.find(c => c.id === courseId);
    if (!course) return;

    // Check if already enrolled
    if (enrolledCourses.includes(courseId)) {
      navigate(`/course/${courseId}`);
      return;
    }

    setLoading(true);

    try {
      if (course.price === 0) {
        // Free course enrollment
        const result = await paymentService.processPayment(course, {
          name: user.user_metadata?.full_name || user.email || '',
          email: user.email || '',
          phone: user.user_metadata?.phone || ''
        });

        if (result.success) {
          toast({
            title: "Enrollment Successful!",
            description: `You have been enrolled in ${course.title}`,
          });
          setEnrolledCourses([...enrolledCourses, courseId]);
          navigate(`/course/${courseId}`);
        } else {
          toast({
            title: "Enrollment Failed",
            description: result.error || "Something went wrong",
            variant: "destructive",
          });
        }
      } else {
        // Paid course - redirect to payment
        const result = await paymentService.processPayment(course, {
          name: user.user_metadata?.full_name || user.email || '',
          email: user.email || '',
          phone: user.user_metadata?.phone || ''
        });

        if (result.success) {
          toast({
            title: "Payment Successful!",
            description: `Welcome to ${course.title}!`,
          });
          setEnrolledCourses([...enrolledCourses, courseId]);
          navigate(`/course/${courseId}`);
        } else {
          toast({
            title: "Payment Failed",
            description: result.error || "Payment was not completed",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredCourses = coursesData.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All Courses' || course.category === selectedCategory;
    const matchesLevel = selectedLevel === 'All Levels' || course.level === selectedLevel;
    
    return matchesSearch && matchesCategory && matchesLevel;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return b.rating - a.rating;
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'newest':
        return 0; // Would need created_at field
      default:
        return b.students - a.students; // Most popular
    }
  });

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner': return 'bg-emerald-500';
      case 'Intermediate': return 'bg-amber-500';
      case 'Advanced': return 'bg-red-500';
      default: return 'bg-blue-500';
    }
  };

  const formatPrice = (price: number) => {
    if (price === 0) return 'Free';
    return `₹${price.toLocaleString()}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      <Header />
      
      <main className="pt-20">
        {/* Enhanced Hero Section */}
        <section className="py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 relative overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.1%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
          
          <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center text-white"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-6 py-3 mb-8"
              >
                <Trophy className="h-5 w-5" />
                <span className="text-sm font-medium">Expert-Led Courses</span>
              </motion.div>
              
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6"
              >
                Master Programming
                <br />
                <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                  Like a Pro
                </span>
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-xl sm:text-2xl text-white/90 mb-10 max-w-3xl mx-auto"
              >
                Join 50,000+ students learning from industry experts. From beginner to advanced, 
                we've got your coding journey covered with hands-on projects and real-world applications.
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="flex flex-col sm:flex-row items-center justify-center gap-4"
              >
                <Button
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-white/90 shadow-xl hover:shadow-2xl transition-all duration-300"
                  onClick={() => document.getElementById('courses-section')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  <BookOpen className="mr-2 h-5 w-5" />
                  Explore Courses
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-white/10 border-white/30 text-white hover:bg-white/20 backdrop-blur-sm"
                >
                  <Play className="mr-2 h-5 w-5" />
                  Watch Demo
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Enhanced Learning Paths */}
        <section className="py-20 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
          <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
                Choose Your Learning Path
              </h2>
              <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
                Structured career paths designed by industry experts to take you from beginner to job-ready professional.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {learningPaths.map((path, index) => (
                <motion.div
                  key={path.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  whileHover={{ y: -5 }}
                  className="group"
                >
                  <Card className="h-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200/50 dark:border-slate-700/50 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 cursor-pointer">
                    <CardContent className="p-6 text-center">
                      <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                        {path.icon}
                      </div>
                      <h3 className="text-xl font-bold mb-2 text-slate-800 dark:text-slate-200">{path.title}</h3>
                      <p className="text-slate-600 dark:text-slate-400 mb-4">{path.description}</p>
                      <div className="flex justify-between text-sm text-slate-500 dark:text-slate-400 mb-4">
                        <span>{path.courses.length} courses</span>
                        <span>{path.duration}</span>
                      </div>
                      <div className="mb-4">
                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                          {formatPrice(path.price)}
                        </div>
                        {path.originalPrice && (
                          <div className="text-sm text-slate-500 line-through">
                            {formatPrice(path.originalPrice)}
                          </div>
                        )}
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300"
                        onClick={() => navigate(`/learning-path/${path.id}`)}
                      >
                        View Path
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Enhanced Courses Section */}
        <section id="courses-section" className="py-20">
          <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
                Popular Courses
              </h2>
              <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
                Join thousands of students in our most popular programming courses with lifetime access and certificates.
              </p>
            </motion.div>

            {/* Filters and Search */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-slate-200/50 dark:border-slate-700/50"
            >
              <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                <div className="flex flex-col sm:flex-row gap-4 flex-1">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                    <Input
                      placeholder="Search courses..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-white/50 dark:bg-slate-700/50"
                    />
                  </div>
                  
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-full sm:w-48 bg-white/50 dark:bg-slate-700/50">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                    <SelectTrigger className="w-full sm:w-48 bg-white/50 dark:bg-slate-700/50">
                      <SelectValue placeholder="Level" />
                    </SelectTrigger>
                    <SelectContent>
                      {levels.map(level => (
                        <SelectItem key={level} value={level}>{level}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-full sm:w-48 bg-white/50 dark:bg-slate-700/50">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      {sortOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </motion.div>

            {/* Courses Grid/List */}
            <AnimatePresence mode="wait">
              <motion.div
                key={viewMode}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className={viewMode === 'grid' 
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" 
                  : "space-y-6"
                }
              >
                {filteredCourses.map((course, index) => (
                  <motion.div
                    key={course.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 * index }}
                    whileHover={{ y: -5 }}
                    className="group"
                  >
                    <Card className={`h-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200/50 dark:border-slate-700/50 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 cursor-pointer ${
                      course.featured ? 'ring-2 ring-blue-500 ring-opacity-50' : ''
                    } ${viewMode === 'list' ? 'flex flex-row' : ''}`}>
                      {course.featured && (
                        <div className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                          FEATURED
                        </div>
                      )}
                      
                      <div className={viewMode === 'list' ? 'flex-shrink-0 w-32 h-32 p-4 flex items-center justify-center' : ''}>
                        <div className={`text-6xl ${viewMode === 'list' ? '' : 'mb-4'} group-hover:scale-110 transition-transform duration-300`}>
                          {course.image}
                        </div>
                      </div>

                      <div className="flex-1">
                        <CardHeader className={viewMode === 'list' ? 'pb-2' : ''}>
                          <div className="flex items-center justify-between mb-4">
                            <Badge className={`${getLevelColor(course.level)} text-white`}>
                              {course.level}
                            </Badge>
                            <div className="flex items-center space-x-2">
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <Heart className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <Share2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          <CardTitle className="text-xl font-bold group-hover:text-blue-600 transition-colors duration-300">
                            {course.title}
                          </CardTitle>
                          <CardDescription className="text-slate-600 dark:text-slate-400">
                            {course.description}
                          </CardDescription>
                        </CardHeader>
                        
                        <CardContent>
                          <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400 mb-4">
                            <div className="flex items-center space-x-1">
                              <Clock className="h-4 w-4" />
                              <span>{course.duration}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Users className="h-4 w-4" />
                              <span>{course.students.toLocaleString()}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Star className="h-4 w-4 fill-current text-yellow-500" />
                              <span>{course.rating}</span>
                            </div>
                          </div>

                          <div className="mb-4">
                            <p className="text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">What you'll learn:</p>
                            <div className="flex flex-wrap gap-1">
                              {course.skills.slice(0, 3).map((skill, i) => (
                                <Badge key={i} variant="outline" className="text-xs">
                                  {skill}
                                </Badge>
                              ))}
                              {course.skills.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{course.skills.length - 3} more
                                </Badge>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400 mb-4">
                            <div className="flex items-center space-x-4">
                              <div className="flex items-center space-x-1">
                                <Award className="h-4 w-4" />
                                <span>Certificate</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Infinity className="h-4 w-4" />
                                <span>Lifetime</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Smartphone className="h-4 w-4" />
                                <span>Mobile</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                {formatPrice(course.price)}
                              </div>
                              {course.originalPrice && (
                                <div className="text-sm text-slate-500 line-through">
                                  {formatPrice(course.originalPrice)}
                                </div>
                              )}
                            </div>
                            <div className="flex space-x-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => navigate(`/course/${course.id}`)}
                              >
                                View Details
                              </Button>
                              <Button 
                                size="sm" 
                                onClick={() => handleEnrollment(course.id)}
                                disabled={loading}
                                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                              >
                                {enrolledCourses.includes(course.id) ? (
                                  <>
                                    <CheckCircle className="mr-2 h-4 w-4" />
                                    Continue
                                  </>
                                ) : course.price === 0 ? (
                                  'Enroll Free'
                                ) : (
                                  'Enroll Now'
                                )}
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>

            {filteredCourses.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-2">No courses found</h3>
                <p className="text-slate-600 dark:text-slate-400">Try adjusting your search criteria</p>
              </motion.div>
            )}
          </div>
        </section>

        {/* Enhanced Stats Section */}
        <section className="py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 relative overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {[
                { number: '50K+', label: 'Active Students', delay: 0.1 },
                { number: '200+', label: 'Expert Instructors', delay: 0.2 },
                { number: '95%', label: 'Completion Rate', delay: 0.3 },
                { number: '4.8★', label: 'Average Rating', delay: 0.4 }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: stat.delay }}
                  className="text-white"
                >
                  <div className="text-4xl font-bold mb-2">{stat.number}</div>
                  <p className="text-white/80">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Enhanced CTA Section */}
        <section className="py-20 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
          <div className="container max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
                Ready to Start Your Learning Journey?
              </h2>
              <p className="text-xl text-slate-600 dark:text-slate-400 mb-10 max-w-2xl mx-auto">
                Join our community of learners and start building your programming skills today with expert guidance and hands-on projects.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-xl hover:shadow-2xl transition-all duration-300"
                  onClick={() => document.getElementById('courses-section')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  <Target className="mr-2 h-5 w-5" />
                  Start Learning Today
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => navigate('/auth')}
                >
                  Sign Up Free
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}