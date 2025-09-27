import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Header } from '@/components/ui/header';
import { Footer } from '@/components/ui/footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Award, Infinity, Smartphone, FileText, IndianRupee, Star, Users, Clock } from 'lucide-react';
import { coursesData } from '@/data/coursesData';
import { paymentService } from '@/services/PaymentService';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export default function CourseCheckout() {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!courseId) return;
    const found = coursesData.find(c => c.id === courseId);
    if (!found) {
      navigate('/courses');
      return;
    }
    // If course is free, skip checkout
    if (found.price === 0) {
      navigate(`/course/${courseId}`);
      return;
    }
    setCourse(found);
  }, [courseId, navigate]);

  const handlePhonePe = async () => {
    if (!user) {
      toast({ title: 'Sign in required', description: 'Please sign in to continue', variant: 'destructive' });
      navigate('/auth');
      return;
    }
    if (!course) return;
    setLoading(true);
    try {
      await paymentService.startPhonePePayment({
        amountInINR: course.price,
        courseId: course.id,
        courseTitle: course.title,
        userName: user.user_metadata?.full_name || user.email || 'User',
        userEmail: user.email || '',
      });
    } catch (e) {
      toast({ title: 'Payment init failed', description: e instanceof Error ? e.message : 'Try again', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  if (!course) return null;

  const formatPrice = (price: number) => `₹${price.toLocaleString()}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      <Header />
      <main className="pt-20">
        <section className="py-12">
          <div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <Card className="bg-white/90 dark:bg-slate-800/90">
                  <CardHeader>
                    <CardTitle className="text-2xl">{course.title}</CardTitle>
                    <CardDescription>{course.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-6 text-slate-600 dark:text-slate-300 mb-6">
                      <div className="flex items-center gap-2"><Star className="h-4 w-4 text-yellow-500" /><span>{course.rating}</span></div>
                      <div className="flex items-center gap-2"><Users className="h-4 w-4" /><span>{course.students.toLocaleString()} students</span></div>
                      <div className="flex items-center gap-2"><Clock className="h-4 w-4" /><span>{course.duration}</span></div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {[
                        { icon: <Award className="h-4 w-4" />, text: 'Certificate of completion' },
                        { icon: <Infinity className="h-4 w-4" />, text: 'Lifetime access' },
                        { icon: <Smartphone className="h-4 w-4" />, text: 'Mobile friendly' },
                        { icon: <FileText className="h-4 w-4" />, text: `${course.assignments || 10} assignments` },
                      ].map((b, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          {b.icon}
                          <span>{b.text}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="lg:col-span-1">
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                  <Card className="bg-white/95 dark:bg-slate-800/95">
                    <CardContent className="p-6">
                      <div className="text-center mb-4">
                        <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 flex items-center justify-center gap-2">
                          <IndianRupee className="h-6 w-6" />
                          {formatPrice(course.price)}
                        </div>
                        {course.originalPrice && (
                          <div className="text-slate-500 line-through">{formatPrice(course.originalPrice)}</div>
                        )}
                      </div>

                      <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600" size="lg" onClick={handlePhonePe} disabled={loading}>
                        Proceed with PhonePe
                      </Button>

                      <div className="mt-4 text-xs text-slate-500 text-center">
                        You will be redirected to PhonePe Business secure payment.
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}


