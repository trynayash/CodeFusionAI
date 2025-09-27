import { supabase } from '@/integrations/supabase/client';

export interface CertificateRecord {
  user_id: string;
  course_id: string;
  certificate_id: string;
  issued_at: string;
}

class CertificateService {
  async issue(userId: string, courseId: string): Promise<CertificateRecord> {
    const certificateId = `CF-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    const record: CertificateRecord = {
      user_id: userId,
      course_id: courseId,
      certificate_id: certificateId,
      issued_at: new Date().toISOString(),
    };
    try {
      await supabase.from('certificates').upsert(record);
    } catch {
      // tolerate missing table; still return record for client-side use
    }
    return record;
  }

  async verify(certificateId: string): Promise<CertificateRecord | null> {
    try {
      const { data } = await supabase
        .from('certificates')
        .select('*')
        .eq('certificate_id', certificateId)
        .maybeSingle();
      return (data as CertificateRecord) || null;
    } catch {
      return null;
    }
  }
}

export const certificateService = new CertificateService();
export default CertificateService;


