import express from 'express';
import cors from 'cors';
import crypto from 'crypto';

const app = express();
app.use(cors());
app.use(express.json());

// Simulated PhonePe payment link creation
app.post('/api/phonepe/start', async (req, res) => {
  try {
    const { amountInINR, courseId, courseTitle, userName, userEmail } = req.body || {};
    if (!amountInINR || !courseId) {
      return res.status(400).json({ error: 'amountInINR and courseId are required' });
    }

    // In real-world: call your server integration with PhonePe to create a transaction
    // For now, produce a mock redirect URL to simulate payment and return callback
    const baseUrl = process.env.PUBLIC_APP_URL || 'http://localhost:8080';
    const successUrl = new URL('/phonepe/callback', baseUrl);
    successUrl.searchParams.set('status', 'success');
    successUrl.searchParams.set('courseId', courseId);

    // Return a URL that would be the PhonePe redirect. Here we immediately go to success for demo.
    return res.json({ redirectUrl: successUrl.toString() });
  } catch (e) {
    return res.status(500).send(typeof e === 'string' ? e : (e as Error).message);
  }
});

// In-memory OTP store (replace with Redis/DB in production)
const otpStore = new Map<string, { code: string; expiresAt: number }>();

app.post('/api/otp/send', (req, res) => {
  const { contact, channel } = req.body || {};
  if (!contact || !channel || !['sms', 'email'].includes(channel)) {
    return res.status(400).json({ error: 'contact and channel (sms|email) required' });
  }
  const code = (Math.floor(100000 + Math.random() * 900000)).toString();
  const key = crypto.createHash('sha256').update(`${channel}:${contact}`).digest('hex');
  otpStore.set(key, { code, expiresAt: Date.now() + 5 * 60 * 1000 });
  // TODO: Integrate real SMS/Email providers. For dev, log the OTP.
  console.log(`[OTP] ${channel} to ${contact}: ${code}`);
  return res.json({ success: true });
});

app.post('/api/otp/verify', (req, res) => {
  const { contact, channel, code } = req.body || {};
  if (!contact || !channel || !code) {
    return res.status(400).json({ error: 'contact, channel, code required' });
  }
  const key = crypto.createHash('sha256').update(`${channel}:${contact}`).digest('hex');
  const record = otpStore.get(key);
  if (!record) return res.status(400).json({ success: false, error: 'OTP not found' });
  if (Date.now() > record.expiresAt) return res.status(400).json({ success: false, error: 'OTP expired' });
  if (record.code !== code) return res.status(400).json({ success: false, error: 'Invalid OTP' });
  otpStore.delete(key);
  return res.json({ success: true });
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server running on http://localhost:${port}`);
});


