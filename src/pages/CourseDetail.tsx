import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  BookOpen, Clock, Users, Star, Trophy, Target, ArrowRight, Play, 
  CheckCircle, Award, Infinity, Smartphone, FileText, Download,
  Globe, Calendar, BarChart3, MessageCircle, Share2, Heart,
  ChevronDown, ChevronRight, PlayCircle, Lock, User
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Header } from '@/components/ui/header';
import { Footer } from '@/components/ui/footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { paymentService } from '@/services/PaymentService';
import { coursesData } from '@/data/coursesData';

export default function CourseDetail() {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [course, setCourse] = useState<any>(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [expandedModule, setExpandedModule] = useState<number | null>(0);

  useEffect(() => {
    if (courseId) {
      const foundCourse = coursesData.find(c => c.id === courseId);
      if (foundCourse) {
        setCourse(foundCourse);
        checkEnrollment();
      } else {
        navigate('/courses');
      }
    }
  }, [courseId, navigate]);

  const checkEnrollment = async () => {
    if (user && courseId) {
      const enrolled = await paymentService.isUserEnrolled(courseId);
      setIsEnrolled(enrolled);
    }
  };

  const handleEnrollment = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to enroll in courses.",
        variant: "destructive",
      });
      navigate('/auth');
      return;
    }

    if (!course) return;

    if (isEnrolled) {
      navigate(`/course/${courseId}/learn`);
      return;
    }

    setLoading(true);

    try {
      if (course.price === 0) {
        if (course.category === 'Web Development') {
          navigate(`/verify?courseId=${courseId}&next=/course/${courseId}/learn`);
          return;
        }
        const result = await paymentService.processPayment(course, {
          name: user.user_metadata?.full_name || user.email || '',
          email: user.email || '',
          phone: user.user_metadata?.phone || ''
        });
        if (result.success) {
          toast({ title: "Enrollment Successful!", description: `Welcome to ${course.title}!` });
          setIsEnrolled(true);
          navigate(`/course/${courseId}/learn`);
        } else {
          toast({ title: "Enrollment Failed", description: result.error || "Something went wrong", variant: "destructive" });
        }
      } else {
        // Paid -> go to checkout page
        navigate(`/course/${courseId}/checkout`);
      }
    } catch (error) {
      toast({ title: "Error", description: "Something went wrong. Please try again.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    if (price === 0) return 'Free';
    return `₹${price.toLocaleString()}`;
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner': return 'bg-emerald-500';
      case 'Intermediate': return 'bg-amber-500';
      case 'Advanced': return 'bg-red-500';
      default: return 'bg-blue-500';
    }
  };

  if (!course) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
        <Header />
        <div className="pt-20 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="text-6xl mb-4">📚</div>
            <h2 className="text-2xl font-bold mb-2">Course not found</h2>
            <p className="text-slate-600 dark:text-slate-400 mb-4">The course you're looking for doesn't exist.</p>
            <Button onClick={() => navigate('/courses')}>
              Browse Courses
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      <Header />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-12 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 relative overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
              <div className="lg:col-span-2 text-white">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <div className="flex items-center space-x-4 mb-4">
                    <Badge className={`${getLevelColor(course.level)} text-white`}>
                      {course.level}
                    </Badge>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 fill-current text-yellow-400" />
                      <span className="font-medium">{course.rating}</span>
                      <span className="text-white/80">({course.students.toLocaleString()} students)</span>
                    </div>
                  </div>
                  
                  <h1 className="text-4xl sm:text-5xl font-bold mb-4">
                    {course.title}
                  </h1>
                  
                  <p className="text-xl text-white/90 mb-6 max-w-2xl">
                    {course.description}
                  </p>
                  
                  <div className="flex items-center space-x-6 text-white/80 mb-6">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-5 w-5" />
                      <span>{course.duration}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="h-5 w-5" />
                      <span>{course.students.toLocaleString()} students</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Globe className="h-5 w-5" />
                      <span>{course.language || 'English'}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 mb-6">
                    <div className="flex items-center space-x-1">
                      <User className="h-4 w-4" />
                      <span className="text-sm">Created by</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <img 
                        src={course.instructorImage || '/api/placeholder/32/32'} 
                        alt={course.instructor}
                        className="w-8 h-8 rounded-full"
                      />
                      <span className="font-medium">{course.instructor}</span>
                    </div>
                  </div>
                </motion.div>
              </div>
              
              <div className="lg:col-span-1">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <Card className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm">
                    <CardContent className="p-6">
                      <div className="text-center mb-6">
                        <div className="text-6xl mb-4">{course.image}</div>
                        <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                          {formatPrice(course.price)}
                        </div>
                        {course.originalPrice && (
                          <div className="text-lg text-slate-500 line-through">
                            {formatPrice(course.originalPrice)}
                          </div>
                        )}
                      </div>
                      
                      <Button 
                        className="w-full mb-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                        size="lg"
                        onClick={handleEnrollment}
                        disabled={loading}
                      >
                        {isEnrolled ? (
                          <>
                            <PlayCircle className="mr-2 h-5 w-5" />
                            Continue Learning
                          </>
                        ) : course.price === 0 ? (
                          'Enroll Free'
                        ) : (
                          'Enroll Now'
                        )}
                      </Button>
                      
                      <div className="space-y-3 text-sm">
                        <div className="flex items-center justify-between">
                          <span className="flex items-center space-x-2">
                            <Award className="h-4 w-4" />
                            <span>Certificate</span>
                          </span>
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="flex items-center space-x-2">
                            <Infinity className="h-4 w-4" />
                            <span>Lifetime Access</span>
                          </span>
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="flex items-center space-x-2">
                            <Smartphone className="h-4 w-4" />
                            <span>Mobile Access</span>
                          </span>
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="flex items-center space-x-2">
                            <Download className="h-4 w-4" />
                            <span>Downloadable Resources</span>
                          </span>
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        </div>
                      </div>
                      
                      <div className="flex space-x-2 mt-4">
                        <Button variant="outline" size="sm" className="flex-1">
                          <Heart className="h-4 w-4 mr-1" />
                          Save
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1">
                          <Share2 className="h-4 w-4 mr-1" />
                          Share
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* Course Content */}
        <section className="py-12">
          <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <Tabs defaultValue="overview" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
                    <TabsTrigger value="instructor">Instructor</TabsTrigger>
                    <TabsTrigger value="reviews">Reviews</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="overview" className="mt-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>What you'll learn</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {course.whatYouWillLearn?.map((item: string, index: number) => (
                            <div key={index} className="flex items-start space-x-2">
                              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                              <span className="text-sm">{item}</span>
                            </div>
                          )) || course.skills.map((skill: string, index: number) => (
                            <div key={index} className="flex items-start space-x-2">
                              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                              <span className="text-sm">{skill}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card className="mt-6">
                      <CardHeader>
                        <CardTitle>Prerequisites</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {course.prerequisites?.map((prereq: string, index: number) => (
                            <div key={index} className="flex items-start space-x-2">
                              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                              <span className="text-sm">{prereq}</span>
                            </div>
                          )) || (
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                              No specific prerequisites required. Basic computer knowledge is helpful.
                            </p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card className="mt-6">
                      <CardHeader>
                        <CardTitle>Course Description</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="prose dark:prose-invert max-w-none">
                          <p>{course.description}</p>
                          <p>
                            This comprehensive course is designed to take you from a complete beginner to an advanced level. 
                            You'll learn through hands-on projects, real-world examples, and practical exercises that will 
                            help you build a strong foundation and advance your skills.
                          </p>
                          <p>
                            Our expert instructors have years of industry experience and will guide you through every step 
                            of your learning journey. By the end of this course, you'll have the confidence and skills to 
                            tackle real-world projects and advance your career.
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="curriculum" className="mt-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Course Curriculum</CardTitle>
                        <CardDescription>
                          {course.curriculum?.length || 8} modules • {course.duration} total length
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {(course.curriculum || [
                            {
                              module: "Introduction and Setup",
                              lessons: ["Course Overview", "Environment Setup", "First Program"],
                              duration: "2 hours"
                            },
                            {
                              module: "Fundamentals",
                              lessons: ["Basic Concepts", "Variables and Data Types", "Control Structures"],
                              duration: "4 hours"
                            },
                            {
                              module: "Intermediate Concepts",
                              lessons: ["Functions", "Object-Oriented Programming", "Error Handling"],
                              duration: "6 hours"
                            },
                            {
                              module: "Advanced Topics",
                              lessons: ["Advanced Patterns", "Best Practices", "Performance Optimization"],
                              duration: "4 hours"
                            },
                            {
                              module: "Projects",
                              lessons: ["Project 1", "Project 2", "Final Project"],
                              duration: "8 hours"
                            }
                          ]).map((module: any, index: number) => (
                            <div key={index} className="border rounded-lg">
                              <button
                                className="w-full p-4 text-left flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                                onClick={() => setExpandedModule(expandedModule === index ? null : index)}
                              >
                                <div className="flex items-center space-x-3">
                                  <div className="flex items-center justify-center w-8 h-8 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full text-sm font-medium">
                                    {index + 1}
                                  </div>
                                  <div>
                                    <h3 className="font-medium">{module.module}</h3>
                                    <p className="text-sm text-slate-600 dark:text-slate-400">
                                      {module.lessons.length} lessons • {module.duration}
                                    </p>
                                  </div>
                                </div>
                                {expandedModule === index ? (
                                  <ChevronDown className="h-5 w-5" />
                                ) : (
                                  <ChevronRight className="h-5 w-5" />
                                )}
                              </button>
                              
                              {expandedModule === index && (
                                <div className="px-4 pb-4">
                                  <div className="space-y-2 ml-11">
                                    {module.lessons.map((lesson: string, lessonIndex: number) => (
                                      <div key={lessonIndex} className="flex items-center space-x-3 py-2">
                                        {isEnrolled ? (
                                          <PlayCircle className="h-4 w-4 text-blue-500" />
                                        ) : (
                                          <Lock className="h-4 w-4 text-slate-400" />
                                        )}
                                        <span className="text-sm">{lesson}</span>
                                        <span className="text-xs text-slate-500 ml-auto">
                                          {Math.floor(Math.random() * 20) + 5} min
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="instructor" className="mt-6">
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-start space-x-4">
                          <img 
                            src={course.instructorImage || '/api/placeholder/80/80'} 
                            alt={course.instructor}
                            className="w-20 h-20 rounded-full"
                          />
                          <div className="flex-1">
                            <h3 className="text-xl font-bold mb-2">{course.instructor}</h3>
                            <p className="text-slate-600 dark:text-slate-400 mb-4">
                              Senior Software Engineer & Technical Instructor
                            </p>
                            <div className="grid grid-cols-2 gap-4 mb-4">
                              <div className="text-center">
                                <div className="text-2xl font-bold text-blue-600">4.8</div>
                                <div className="text-sm text-slate-600">Instructor Rating</div>
                              </div>
                              <div className="text-center">
                                <div className="text-2xl font-bold text-blue-600">50K+</div>
                                <div className="text-sm text-slate-600">Students</div>
                              </div>
                            </div>
                            <p className="text-sm text-slate-700 dark:text-slate-300">
                              With over 10 years of industry experience, our instructor has worked with leading 
                              tech companies and has a passion for teaching. They bring real-world expertise 
                              and practical insights to help you succeed in your learning journey.
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="reviews" className="mt-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Student Reviews</CardTitle>
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-1">
                            <Star className="h-5 w-5 fill-current text-yellow-500" />
                            <span className="text-2xl font-bold">{course.rating}</span>
                          </div>
                          <div className="text-slate-600 dark:text-slate-400">
                            ({course.students.toLocaleString()} reviews)
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-6">
                          {[
                            {
                              name: "Sarah Johnson",
                              rating: 5,
                              comment: "Excellent course! The instructor explains everything clearly and the projects are very practical.",
                              date: "2 weeks ago"
                            },
                            {
                              name: "Mike Chen",
                              rating: 5,
                              comment: "This course helped me land my dream job. Highly recommended!",
                              date: "1 month ago"
                            },
                            {
                              name: "Emily Davis",
                              rating: 4,
                              comment: "Great content and well-structured. Would love to see more advanced topics.",
                              date: "2 months ago"
                            }
                          ].map((review, index) => (
                            <div key={index} className="border-b pb-4 last:border-b-0">
                              <div className="flex items-start space-x-3">
                                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-medium">
                                  {review.name.charAt(0)}
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center space-x-2 mb-1">
                                    <span className="font-medium">{review.name}</span>
                                    <div className="flex items-center">
                                      {[...Array(review.rating)].map((_, i) => (
                                        <Star key={i} className="h-4 w-4 fill-current text-yellow-500" />
                                      ))}
                                    </div>
                                    <span className="text-sm text-slate-500">{review.date}</span>
                                  </div>
                                  <p className="text-sm text-slate-700 dark:text-slate-300">
                                    {review.comment}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
              
              <div className="lg:col-span-1">
                <div className="sticky top-24 space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Course Stats</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Students</span>
                          <span className="font-medium">{course.students.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Duration</span>
                          <span className="font-medium">{course.duration}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Level</span>
                          <Badge className={`${getLevelColor(course.level)} text-white`}>
                            {course.level}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Language</span>
                          <span className="font-medium">{course.language || 'English'}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Assignments</span>
                          <span className="font-medium">{course.assignments || 10}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Projects</span>
                          <span className="font-medium">{course.projects || 3}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Skills You'll Gain</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {course.skills.map((skill: string, index: number) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}