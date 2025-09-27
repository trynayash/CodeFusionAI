// Payment Service with Razorpay Integration
import { supabase } from '@/integrations/supabase/client';

export interface Course {
  id: string;
  title: string;
  description: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  students: number;
  rating: number;
  price: number; // Price in INR, 0 for free courses
  originalPrice?: number;
  image: string;
  skills: string[];
  featured?: boolean;
  instructor: string;
  instructorImage: string;
  curriculum: {
    module: string;
    lessons: (string | { title: string; url?: string; videoId?: string; videoUrl?: string })[];
    duration: string;
  }[];
  prerequisites: string[];
  whatYouWillLearn: string[];
  category: string;
  language: string;
  certificate: boolean;
  lifetime_access: boolean;
  mobile_access: boolean;
  assignments: number;
  projects: number;
  quizzes: number;
}

export interface PaymentResult {
  success: boolean;
  paymentId?: string;
  orderId?: string;
  error?: string;
}

export interface EnrollmentData {
  userId: string;
  courseId: string;
  paymentId?: string;
  orderId?: string;
  amount: number;
  enrolledAt: string;
  status: 'enrolled' | 'pending' | 'failed';
}

class PaymentService {
  private razorpayKey: string;
  private phonePeEndpoint: string;

  constructor() {
    // In production, store this in environment variables
    this.razorpayKey = 'rzp_test_your_key_here'; // Replace with actual Razorpay key
    this.phonePeEndpoint = '/api/phonepe/start'; // Your backend endpoint that creates a PhonePe link
  }

  // Load Razorpay script dynamically
  private loadRazorpayScript(): Promise<boolean> {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  }

  // Create Razorpay order
  private async createOrder(amount: number, courseId: string): Promise<any> {
    try {
      // In a real application, this should be done on your backend
      const response = await fetch('/api/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: amount * 100, // Razorpay expects amount in paise
          currency: 'INR',
          courseId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create order');
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating order:', error);
      // For demo purposes, return a mock order
      return {
        id: `order_${Date.now()}`,
        amount: amount * 100,
        currency: 'INR',
      };
    }
  }

  // Process payment for a course
  async processPayment(
    course: Course,
    userDetails: {
      name: string;
      email: string;
      phone: string;
    }
  ): Promise<PaymentResult> {
    try {
      // Check if course is free
      if (course.price === 0) {
        return await this.enrollInFreeCourse(course.id);
      }

      // Load Razorpay script
      const isScriptLoaded = await this.loadRazorpayScript();
      if (!isScriptLoaded) {
        throw new Error('Failed to load payment gateway');
      }

      // Create order
      const order = await this.createOrder(course.price, course.id);

      // Configure Razorpay options
      const options = {
        key: this.razorpayKey,
        amount: order.amount,
        currency: order.currency,
        name: 'CodeFusionAI',
        description: `Enrollment for ${course.title}`,
        order_id: order.id,
        prefill: {
          name: userDetails.name,
          email: userDetails.email,
          contact: userDetails.phone,
        },
        theme: {
          color: '#3B82F6',
        },
        modal: {
          ondismiss: () => {
            console.log('Payment modal closed');
          },
        },
        handler: async (response: any) => {
          // Payment successful
          await this.verifyPayment(response, course.id);
        },
      };

      // Open Razorpay checkout
      const razorpay = new (window as any).Razorpay(options);
      razorpay.open();

      return new Promise((resolve) => {
        razorpay.on('payment.success', (response: any) => {
          resolve({
            success: true,
            paymentId: response.razorpay_payment_id,
            orderId: response.razorpay_order_id,
          });
        });

        razorpay.on('payment.error', (error: any) => {
          resolve({
            success: false,
            error: error.description || 'Payment failed',
          });
        });
      });
    } catch (error) {
      console.error('Payment processing error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Payment failed',
      };
    }
  }

  // Start PhonePe payment by redirecting to your backend-created URL
  async startPhonePePayment(params: {
    amountInINR: number;
    courseId: string;
    courseTitle: string;
    userName: string;
    userEmail: string;
  }): Promise<void> {
    const response = await fetch(this.phonePeEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(text || 'Failed to initialize PhonePe payment');
    }

    const data = await response.json();
    // Expecting { redirectUrl: string }
    if (!data?.redirectUrl) {
      throw new Error('PhonePe redirect URL not received');
    }
    window.location.href = data.redirectUrl;
  }

  // Enroll in free course
  private async enrollInFreeCourse(courseId: string): Promise<PaymentResult> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      // For now, we'll store enrollments in localStorage since we don't have the table set up
      const enrollments = JSON.parse(localStorage.getItem('user_enrollments') || '[]');
      const enrollmentKey = `${user.id}_${courseId}`;
      
      if (!enrollments.includes(enrollmentKey)) {
        enrollments.push(enrollmentKey);
        localStorage.setItem('user_enrollments', JSON.stringify(enrollments));
      }

      return {
        success: true,
      };
    } catch (error) {
      console.error('Free enrollment error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Enrollment failed',
      };
    }
  }

  // Verify payment (client-side placeholder). In production, do server verification
  private async verifyPayment(paymentResponse: any, courseId: string): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    // Store simple enrollment flag in localStorage
    const enrollments = JSON.parse(localStorage.getItem('user_enrollments') || '[]');
    const enrollmentKey = `${user.id}_${courseId}`;
    if (!enrollments.includes(enrollmentKey)) {
      enrollments.push(enrollmentKey);
      localStorage.setItem('user_enrollments', JSON.stringify(enrollments));
    }
  }

  // Check if user is enrolled in a course
  async isUserEnrolled(courseId: string): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return false;
      }

      // Check localStorage for enrollments
      const enrollments = JSON.parse(localStorage.getItem('user_enrollments') || '[]');
      const enrollmentKey = `${user.id}_${courseId}`;
      
      return enrollments.includes(enrollmentKey);
    } catch (error) {
      console.error('Enrollment check error:', error);
      return false;
    }
  }

  // Get user's enrolled courses
  async getUserEnrollments(): Promise<string[]> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return [];
      }

      // Get enrollments from localStorage
      const enrollments = JSON.parse(localStorage.getItem('user_enrollments') || '[]');
      
      return enrollments
        .filter((enrollment: string) => enrollment.startsWith(`${user.id}_`))
        .map((enrollment: string) => enrollment.split('_')[1]);
    } catch (error) {
      console.error('Get enrollments error:', error);
      return [];
    }
  }

  // Mark enrolled locally (for PhonePe callback success)
  async markEnrolled(courseId: string): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const enrollments = JSON.parse(localStorage.getItem('user_enrollments') || '[]');
    const enrollmentKey = `${user.id}_${courseId}`;
    if (!enrollments.includes(enrollmentKey)) {
      enrollments.push(enrollmentKey);
      localStorage.setItem('user_enrollments', JSON.stringify(enrollments));
    }
  }
}

export const paymentService = new PaymentService();
export default PaymentService;