import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Header } from '@/components/ui/header';
import { Footer } from '@/components/ui/footer';
import { Button } from '@/components/ui/button';
import { coursesData } from '@/data/coursesData';
import CodeFusionLogo from '@/components/CodeFusionLogo';
import { certificateService } from '@/services/CertificateService';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function CourseCertificate() {
  const { courseId } = useParams<{ courseId: string }>();
  const query = useQuery();
  const navigate = useNavigate();
  const certRef = useRef<HTMLDivElement>(null);

  const course = coursesData.find(c => c.id === courseId);
  const [certificateId, setCertificateId] = useState<string>('');
  const name = query.get('name') || 'Learner';

  useEffect(() => {
    if (!course) navigate('/courses');
  }, [course, navigate]);

  if (!course) return null;

  useEffect(() => {
    // Issue a certificate id (idempotent enough for demo) if missing in URL
    const existing = query.get('cert');
    if (existing) {
      setCertificateId(existing);
      return;
    }
    const userName = name || 'Learner';
    // Note: we don't have user id here; issuance will fallback if supabase is unavailable
    certificateService.issue('local', course.id).then(rec => setCertificateId(rec.certificate_id));
  }, [course?.id, name, query]);

  const printCert = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900">
      <Header />
      <main className="pt-20">
        <section className="py-10">
          <div className="container max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div ref={certRef} className="bg-white rounded-xl shadow-2xl p-8 border relative">
              <div className="absolute inset-0 pointer-events-none border-4 border-dashed border-blue-200 rounded-xl" />
              <div className="flex items-center justify-between mb-8">
                <CodeFusionLogo size="lg" animated={false} />
                <div className="text-right">
                  <div className="text-xs text-slate-500">Certificate ID:</div>
                  <div className="text-sm font-medium">{certificateId || 'Generating...'}</div>
                </div>
              </div>
              <div className="text-center">
                <div className="text-slate-500 uppercase tracking-widest text-xs">Certificate of Completion</div>
                <h1 className="text-4xl font-extrabold mt-2 brand-font">CodeFusionAI</h1>
                <p className="mt-6 text-slate-600">This is to certify that</p>
                <div className="text-3xl font-bold mt-2">{name}</div>
                <p className="mt-4 text-slate-600">has successfully completed the course</p>
                <div className="text-2xl font-semibold mt-1">{course.title}</div>
                <p className="mt-2 text-slate-500 text-sm">with distinction, demonstrating proficiency in the skills covered.</p>
              </div>
              <div className="mt-8 grid grid-cols-2 gap-6">
                <div>
                  <div className="text-xs text-slate-500">Skills</div>
                  <div className="text-sm">{course.skills.slice(0,6).join(', ')}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-slate-500">Duration</div>
                  <div className="text-sm">{course.duration}</div>
                </div>
              </div>
              <div className="mt-10 flex items-center justify-between">
                <div className="text-left">
                  <div className="text-xs text-slate-500">Issued by</div>
                  <div className="font-semibold">CodeFusionAI</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-slate-500">Date</div>
                  <div className="font-semibold">{new Date().toLocaleDateString()}</div>
                </div>
              </div>
            </div>
            <div className="flex justify-center gap-3 mt-6">
              <Button onClick={() => navigate(`/course/${courseId}/learn`)} variant="outline">Back to Course</Button>
              <Button onClick={printCert}>Download / Print</Button>
              {certificateId && (
                <Button variant="outline" onClick={() => navigate(`/verify-certificate`)}>Verify Certificate</Button>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}


