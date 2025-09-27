import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Header } from '@/components/ui/header';
import { Footer } from '@/components/ui/footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function OTPVerification() {
  const query = useQuery();
  const navigate = useNavigate();
  const { toast } = useToast();
  const courseId = query.get('courseId') || '';
  const next = query.get('next') || `/course/${courseId}/learn`;

  const [channel, setChannel] = useState<'sms' | 'email'>('sms');
  const [contact, setContact] = useState('');
  const [code, setCode] = useState('');
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);

  const sendOtp = async () => {
    if (!contact) {
      toast({ title: 'Enter your mobile or email', variant: 'destructive' });
      return;
    }
    setSending(true);
    try {
      const res = await fetch('/api/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contact, channel }),
      });
      if (!res.ok) throw new Error(await res.text());
      toast({ title: 'OTP sent', description: `Check your ${channel}` });
    } catch (e) {
      toast({ title: 'Failed to send OTP', description: e instanceof Error ? e.message : 'Try again', variant: 'destructive' });
    } finally {
      setSending(false);
    }
  };

  const verifyOtp = async () => {
    if (!code) {
      toast({ title: 'Enter the OTP code', variant: 'destructive' });
      return;
    }
    setVerifying(true);
    try {
      const res = await fetch('/api/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contact, channel, code }),
      });
      const data = await res.json();
      if (!res.ok || !data?.success) throw new Error(data?.error || 'Invalid OTP');
      toast({ title: 'Verification successful' });
      navigate(next);
    } catch (e) {
      toast({ title: 'Verification failed', description: e instanceof Error ? e.message : 'Try again', variant: 'destructive' });
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      <Header />
      <main className="pt-20">
        <section className="py-16">
          <div className="container max-w-xl mx-auto px-4 sm:px-6 lg:px-8">
            <Card>
              <CardHeader>
                <CardTitle>Verify your {channel === 'sms' ? 'mobile' : 'email'}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Button variant={channel === 'sms' ? 'default' : 'outline'} onClick={() => setChannel('sms')}>SMS</Button>
                  <Button variant={channel === 'email' ? 'default' : 'outline'} onClick={() => setChannel('email')}>Email</Button>
                </div>
                <Input placeholder={channel === 'sms' ? 'Mobile number' : 'Email address'} value={contact} onChange={(e) => setContact(e.target.value)} />
                <div className="flex gap-2">
                  <Button onClick={sendOtp} disabled={sending}>{sending ? 'Sending...' : 'Send OTP'}</Button>
                </div>
                <Input placeholder="Enter OTP" value={code} onChange={(e) => setCode(e.target.value)} />
                <Button onClick={verifyOtp} disabled={verifying || !code}>{verifying ? 'Verifying...' : 'Verify & Continue'}</Button>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}


