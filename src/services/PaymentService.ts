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
    lessons: string[];
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

  constructor() {
    // In production, store this in environment variables
    this.razorpayKey = 'rzp_test_your_key_here'; // Replace with actual Razorpay key
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
        name: 'CodeFusion AI',
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

  // Verify payment on backend
  private async verifyPayment(paymentResponse: any, courseId: string): Promise<void> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      // In production, verify payment signature on backend
      const enrollmentData: EnrollmentData = {
        userId: user.id,
        courseId,
        paymentId: paymentResponse.razorpay_payment_id,
        orderId: paymentResponse.razorpay_order_id,
        amount: paymentResponse.amount / 100, // Convert from paise to rupees
        enrolledAt: new Date().toISOString(),
        status: 'enrolled',
      };

      const { error } = await supabase
        .from('enrollments')
        .insert(enrollmentData);

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error('Payment verification error:', error);
      throw error;
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
}

export const paymentService = new PaymentService();
export default PaymentService;