import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Header } from '@/components/ui/header';
import { Footer } from '@/components/ui/footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Clock, Users, Star } from 'lucide-react';
import { coursesData, learningPaths } from '@/data/coursesData';

export default function LearningPath() {
  const { pathId } = useParams<{ pathId: string }>();
  const navigate = useNavigate();
  const [path, setPath] = useState<any | null>(null);
  const [courses, setCourses] = useState<any[]>([]);

  useEffect(() => {
    const lp = learningPaths.find((p: any) => p.id === pathId);
    if (!lp) {
      navigate('/courses');
      return;
    }
    setPath(lp);
    const listed = lp.courses
      .map((id: string) => coursesData.find(c => c.id === id))
      .filter(Boolean);
    setCourses(listed as any[]);
  }, [pathId, navigate]);

  if (!path) return null;

  const formatPrice = (price: number) => (price === 0 ? 'Free' : `₹${price.toLocaleString()}`);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      <Header />
      <main className="pt-20">
        <section className="py-12 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white">
          <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl sm:text-5xl font-bold">{path.title}</h1>
                <p className="mt-2 text-white/90 max-w-2xl">{path.description}</p>
              </div>
              <div className="hidden md:block text-right">
                <div className="text-2xl font-bold">{formatPrice(path.price)}</div>
                {path.originalPrice && (
                  <div className="text-white/80 line-through">{formatPrice(path.originalPrice)}</div>
                )}
                <div className="text-sm mt-2">{path.courses.length} courses • {path.duration}</div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <motion.div key={course.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                  <Card className="h-full">
                    <CardHeader>
                      <div className="flex items-center justify-between mb-3">
                        <Badge>{course.level}</Badge>
                        <div className="flex items-center gap-2 text-sm text-slate-500">
                          <div className="flex items-center gap-1"><Clock className="h-4 w-4" />{course.duration}</div>
                          <div className="flex items-center gap-1"><Users className="h-4 w-4" />{course.students.toLocaleString()}</div>
                          <div className="flex items-center gap-1"><Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />{course.rating}</div>
                        </div>
                      </div>
                      <CardTitle>{course.title}</CardTitle>
                      <CardDescription>{course.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex items-center justify-between">
                      <div className="text-blue-600 font-bold">{formatPrice(course.price)}</div>
                      <Button onClick={() => navigate(`/course/${course.id}`)}>
                        View Course <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}


