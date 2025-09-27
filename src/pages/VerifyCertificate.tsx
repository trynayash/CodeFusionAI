import { useState } from 'react';
import { Header } from '@/components/ui/header';
import { Footer } from '@/components/ui/footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { certificateService } from '@/services/CertificateService';

export default function VerifyCertificate() {
  const [code, setCode] = useState('');
  const [result, setResult] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  const onVerify = async () => {
    setLoading(true);
    const rec = await certificateService.verify(code.trim());
    setResult(rec);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      <Header />
      <main className="pt-20">
        <section className="py-12">
          <div className="container max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <Card>
              <CardHeader>
                <CardTitle>Verify Certificate</CardTitle>
                <CardDescription>Enter a CodeFusionAI certificate ID to verify authenticity</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input placeholder="CF-..." value={code} onChange={(e) => setCode(e.target.value)} />
                  <Button onClick={onVerify} disabled={loading || !code}>{loading ? 'Verifying...' : 'Verify'}</Button>
                </div>
                {result && (
                  <div className="text-sm">
                    <div><span className="font-medium">Status:</span> Valid</div>
                    <div><span className="font-medium">Course:</span> {result.course_id}</div>
                    <div><span className="font-medium">Issued:</span> {new Date(result.issued_at).toLocaleString()}</div>
                  </div>
                )}
                {result === null && code && !loading && (
                  <div className="text-sm text-red-600">Certificate not found</div>
                )}
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}


