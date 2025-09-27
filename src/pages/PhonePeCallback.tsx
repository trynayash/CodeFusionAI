import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Header } from '@/components/ui/header';
import { Footer } from '@/components/ui/footer';
import { paymentService } from '@/services/PaymentService';
import { useToast } from '@/hooks/use-toast';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function PhonePeCallback() {
  const query = useQuery();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const status = query.get('status');
    const courseId = query.get('courseId');
    if (!courseId) {
      navigate('/courses');
      return;
    }
    if (status === 'success') {
      paymentService.markEnrolled(courseId).then(() => {
        toast({ title: 'Enrollment successful', description: 'Redirecting to your course...' });
        navigate(`/course/${courseId}/learn`);
      }).catch(() => {
        toast({ title: 'Enrollment failed', description: 'Please contact support', variant: 'destructive' });
        navigate(`/course/${courseId}`);
      });
    } else {
      toast({ title: 'Payment cancelled', description: 'You can resume anytime' });
      navigate(`/course/${courseId}`);
    }
  }, [navigate, query, toast]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      <Header />
      <main className="pt-20">
        <section className="py-24">
          <div className="container max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="text-2xl font-semibold">Finalizing your enrollment...</div>
            <div className="mt-2 text-slate-600 dark:text-slate-400">Please wait while we redirect you.</div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}


