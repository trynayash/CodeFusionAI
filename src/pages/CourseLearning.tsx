import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  BookOpen, Clock, Users, Star, Trophy, Target, ArrowRight, Play, 
  CheckCircle, Award, Infinity, Smartphone, FileText, Download,
  Globe, Calendar, BarChart3, MessageCircle, Share2, Heart,
  ChevronDown, ChevronRight, PlayCircle, Lock, User, Menu,
  X, Home, List, Settings, HelpCircle, ChevronLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { paymentService } from '@/services/PaymentService';
import { coursesData } from '@/data/coursesData';

export default function CourseLearning() {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [course, setCourse] = useState<any>(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentModule, setCurrentModule] = useState(0);
  const [currentLesson, setCurrentLesson] = useState(0);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (courseId) {
      const foundCourse = coursesData.find(c => c.id === courseId);
      if (foundCourse) {
        setCourse(foundCourse);
        checkEnrollment();
        loadProgress();
      } else {
        navigate('/courses');
      }
    }
  }, [courseId, navigate]);

  const checkEnrollment = async () => {
    if (user && courseId) {
      const enrolled = await paymentService.isUserEnrolled(courseId);
      setIsEnrolled(enrolled);
      if (!enrolled) {
        navigate(`/course/${courseId}`);
      }
    }
  };

  const loadProgress = () => {
    if (user && courseId) {
      const progressKey = `course_progress_${user.id}_${courseId}`;
      const savedProgress = localStorage.getItem(progressKey);
      if (savedProgress) {
        const { completed, currentMod, currentLes, prog } = JSON.parse(savedProgress);
        setCompletedLessons(completed || []);
        setCurrentModule(currentMod || 0);
        setCurrentLesson(currentLes || 0);
        setProgress(prog || 0);
      }
    }
  };

  const saveProgress = (completed: string[], currentMod: number, currentLes: number, prog: number) => {
    if (user && courseId) {
      const progressKey = `course_progress_${user.id}_${courseId}`;
      localStorage.setItem(progressKey, JSON.stringify({
        completed,
        currentMod: currentMod,
        currentLes: currentLes,
        prog
      }));
    }
  };

  const markLessonComplete = (moduleIndex: number, lessonIndex: number) => {
    const lessonKey = `${moduleIndex}-${lessonIndex}`;
    if (!completedLessons.includes(lessonKey)) {
      const newCompleted = [...completedLessons, lessonKey];
      const totalLessons = course.curriculum.reduce((total: number, module: any) => total + module.lessons.length, 0);
      const newProgress = (newCompleted.length / totalLessons) * 100;
      
      setCompletedLessons(newCompleted);
      setProgress(newProgress);
      saveProgress(newCompleted, currentModule, currentLesson, newProgress);
      
      toast({
        title: "Lesson Completed!",
        description: "Great job! Keep up the excellent work.",
      });
    }
  };

  const navigateToLesson = (moduleIndex: number, lessonIndex: number) => {
    setCurrentModule(moduleIndex);
    setCurrentLesson(lessonIndex);
    saveProgress(completedLessons, moduleIndex, lessonIndex, progress);
  };

  const getCurrentLessonContent = () => {
    if (!course || !course.curriculum[currentModule]) return null;
    
    const module = course.curriculum[currentModule];
    const lesson = module.lessons[currentLesson];
    
    return {
      moduleTitle: module.module,
      lessonTitle: lesson,
      content: generateLessonContent(lesson, currentModule, currentLesson)
    };
  };

  const generateLessonContent = (lessonTitle: string, moduleIndex: number, lessonIndex: number) => {
    // This would normally come from a database or CMS
    return {
      video: `https://www.youtube.com/embed/dQw4w9WgXcQ`, // Placeholder video
      description: `In this lesson, you'll learn about ${lessonTitle}. This comprehensive guide will walk you through the concepts step by step with practical examples and hands-on exercises.`,
      objectives: [
        `Understand the fundamentals of ${lessonTitle}`,
        `Apply ${lessonTitle} in real-world scenarios`,
        `Practice with hands-on exercises`,
        `Complete the lesson quiz`
      ],
      resources: [
        { name: 'Lesson Notes', type: 'PDF', url: '#' },
        { name: 'Code Examples', type: 'ZIP', url: '#' },
        { name: 'Additional Reading', type: 'Link', url: '#' }
      ],
      quiz: [
        {
          question: `What is the main concept covered in ${lessonTitle}?`,
          options: ['Option A', 'Option B', 'Option C', 'Option D'],
          correct: 0
        }
      ]
    };
  };

  if (!course || !isEnrolled) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-4">You need to be enrolled in this course to access the content.</p>
          <Button onClick={() => navigate(`/course/${courseId}`)}>
            View Course Details
          </Button>
        </div>
      </div>
    );
  }

  const currentLessonContent = getCurrentLessonContent();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-80' : 'w-16'} transition-all duration-300 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 flex flex-col`}>
        {/* Sidebar Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            {sidebarOpen && (
              <div>
                <h2 className="font-bold text-lg truncate">{course.title}</h2>
                <div className="flex items-center space-x-2 mt-1">
                  <Progress value={progress} className="flex-1" />
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    {Math.round(progress)}%
                  </span>
                </div>
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Navigation */}
        {sidebarOpen && (
          <div className="p-4 border-b border-slate-200 dark:border-slate-700">
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={() => navigate('/dashboard')}>
                <Home className="h-4 w-4 mr-1" />
                Dashboard
              </Button>
              <Button variant="outline" size="sm" onClick={() => navigate(`/course/${courseId}`)}>
                <ChevronLeft className="h-4 w-4 mr-1" />
                Course
              </Button>
            </div>
          </div>
        )}

        {/* Course Content */}
        <div className="flex-1 overflow-y-auto">
          {sidebarOpen && (
            <div className="p-4">
              <div className="space-y-4">
                {course.curriculum.map((module: any, moduleIndex: number) => (
                  <div key={moduleIndex} className="border rounded-lg">
                    <div className="p-3 bg-slate-50 dark:bg-slate-700 rounded-t-lg">
                      <h3 className="font-medium text-sm">{module.module}</h3>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        {module.lessons.length} lessons • {module.duration}
                      </p>
                    </div>
                    <div className="p-2">
                      {module.lessons.map((lesson: string, lessonIndex: number) => {
                        const lessonKey = `${moduleIndex}-${lessonIndex}`;
                        const isCompleted = completedLessons.includes(lessonKey);
                        const isCurrent = currentModule === moduleIndex && currentLesson === lessonIndex;
                        
                        return (
                          <button
                            key={lessonIndex}
                            className={`w-full text-left p-2 rounded text-sm hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors ${
                              isCurrent ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300' : ''
                            }`}
                            onClick={() => navigateToLesson(moduleIndex, lessonIndex)}
                          >
                            <div className="flex items-center space-x-2">
                              {isCompleted ? (
                                <CheckCircle className="h-4 w-4 text-green-500" />
                              ) : isCurrent ? (
                                <PlayCircle className="h-4 w-4 text-blue-500" />
                              ) : (
                                <div className="w-4 h-4 border-2 border-slate-300 rounded-full" />
                              )}
                              <span className={isCompleted ? 'line-through text-slate-500' : ''}>{lesson}</span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold">{currentLessonContent?.lessonTitle}</h1>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Module {currentModule + 1}: {currentLessonContent?.moduleTitle}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => markLessonComplete(currentModule, currentLesson)}
                disabled={completedLessons.includes(`${currentModule}-${currentLesson}`)}
              >
                {completedLessons.includes(`${currentModule}-${currentLesson}`) ? (
                  <>
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Completed
                  </>
                ) : (
                  'Mark Complete'
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Lesson Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Video Player */}
            <Card>
              <CardContent className="p-0">
                <div className="aspect-video bg-slate-900 rounded-lg overflow-hidden">
                  <iframe
                    src={currentLessonContent?.content.video}
                    className="w-full h-full"
                    allowFullScreen
                    title={currentLessonContent?.lessonTitle}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Lesson Description */}
            <Card>
              <CardHeader>
                <CardTitle>About This Lesson</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-700 dark:text-slate-300 mb-4">
                  {currentLessonContent?.content.description}
                </p>
                <div>
                  <h4 className="font-medium mb-2">Learning Objectives:</h4>
                  <ul className="space-y-1">
                    {currentLessonContent?.content.objectives.map((objective, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{objective}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Resources */}
            <Card>
              <CardHeader>
                <CardTitle>Lesson Resources</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {currentLessonContent?.content.resources.map((resource, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer">
                      <FileText className="h-5 w-5 text-blue-500" />
                      <div>
                        <p className="font-medium text-sm">{resource.name}</p>
                        <p className="text-xs text-slate-600 dark:text-slate-400">{resource.type}</p>
                      </div>
                      <Download className="h-4 w-4 text-slate-400 ml-auto" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Navigation */}
            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => {
                  if (currentLesson > 0) {
                    navigateToLesson(currentModule, currentLesson - 1);
                  } else if (currentModule > 0) {
                    const prevModule = course.curriculum[currentModule - 1];
                    navigateToLesson(currentModule - 1, prevModule.lessons.length - 1);
                  }
                }}
                disabled={currentModule === 0 && currentLesson === 0}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous Lesson
              </Button>
              
              <Button
                onClick={() => {
                  const currentModuleLessons = course.curriculum[currentModule].lessons.length;
                  if (currentLesson < currentModuleLessons - 1) {
                    navigateToLesson(currentModule, currentLesson + 1);
                  } else if (currentModule < course.curriculum.length - 1) {
                    navigateToLesson(currentModule + 1, 0);
                  }
                }}
                disabled={
                  currentModule === course.curriculum.length - 1 && 
                  currentLesson === course.curriculum[currentModule].lessons.length - 1
                }
              >
                Next Lesson
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}