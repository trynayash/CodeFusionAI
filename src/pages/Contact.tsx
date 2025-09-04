import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Clock, Send, MessageSquare, HeadphonesIcon, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Header } from '@/components/ui/header';
import { Footer } from '@/components/ui/footer';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export default function Contact() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const contactMethods = [
    {
      icon: Mail,
      title: 'Email Us',
      description: 'Send us an email anytime',
      value: 'hello@codefusion.ai',
      action: 'mailto:hello@codefusion.ai',
      color: 'bg-blue-500'
    },
    {
      icon: Phone,
      title: 'Call Us',
      description: 'Mon-Fri from 8am to 6pm',
      value: '+1 (555) 123-4567',
      action: 'tel:+15551234567',
      color: 'bg-green-500'
    },
    {
      icon: MessageSquare,
      title: 'Live Chat',
      description: '24/7 instant support',
      value: 'Start chatting now',
      action: '#',
      color: 'bg-purple-500'
    },
    {
      icon: MapPin,
      title: 'Visit Us',
      description: 'Come say hello at our HQ',
      value: 'San Francisco, CA',
      action: '#',
      color: 'bg-red-500'
    }
  ];

  const faqItems = [
    {
      question: 'How do I get started with CodeFusion AI?',
      answer: 'Simply sign up for a free account and you can start coding immediately in our browser-based editor.'
    },
    {
      question: 'Is CodeFusion AI free to use?',
      answer: 'Yes! We offer a generous free tier with access to our code editor and basic courses. Premium features are available with our paid plans.'
    },
    {
      question: 'What programming languages are supported?',
      answer: 'We support 50+ programming languages including Python, JavaScript, Java, C++, Go, Rust, and many more.'
    },
    {
      question: 'Can I collaborate with others on projects?',
      answer: 'Absolutely! Our platform includes real-time collaboration features, project sharing, and team workspaces.'
    },
    {
      question: 'Do you offer enterprise solutions?',
      answer: 'Yes, we have enterprise plans with advanced features, SSO, dedicated support, and custom integrations.'
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    toast({
      title: "Message sent!",
      description: "We'll get back to you within 24 hours.",
    });
    
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-20 gradient-bg relative overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center text-white"
            >
              <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-6 py-3 mb-8">
                <HeadphonesIcon className="h-5 w-5" />
                <span className="text-sm font-medium">We're Here to Help</span>
              </div>
              
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6">
                Get in Touch
                <br />
                <span className="text-white/90">With Our Team</span>
              </h1>
              
              <p className="text-xl sm:text-2xl text-white/80 mb-10 max-w-3xl mx-auto">
                Have a question, need support, or want to share feedback? 
                We'd love to hear from you. Our team is here to help you succeed.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Contact Methods */}
        <section className="py-20">
          <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl sm:text-5xl font-bold gradient-text mb-4">
                Multiple Ways to Reach Us
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Choose the method that works best for you. We're available 24/7 to assist you.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {contactMethods.map((method, index) => (
                <motion.div
                  key={method.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                >
                  <Card className="glass glow-hover cursor-pointer" onClick={() => window.open(method.action, '_blank')}>
                    <CardContent className="p-6 text-center">
                      <div className={`w-16 h-16 ${method.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                        <method.icon className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="text-xl font-bold mb-2">{method.title}</h3>
                      <p className="text-muted-foreground mb-3">{method.description}</p>
                      <p className="text-primary font-medium">{method.value}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Form & Info */}
        <section className="py-20 bg-muted/30">
          <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              {/* Contact Form */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Card className="glass">
                  <CardHeader>
                    <CardTitle className="text-2xl font-bold">Send Us a Message</CardTitle>
                    <CardDescription>
                      Fill out the form below and we'll get back to you within 24 hours.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">First Name</Label>
                          <Input id="firstName" placeholder="John" required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName">Last Name</Label>
                          <Input id="lastName" placeholder="Doe" required />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" placeholder="john@example.com" required />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="subject">Subject</Label>
                        <Select required>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a topic" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="general">General Inquiry</SelectItem>
                            <SelectItem value="support">Technical Support</SelectItem>
                            <SelectItem value="billing">Billing Questions</SelectItem>
                            <SelectItem value="partnership">Partnership</SelectItem>
                            <SelectItem value="feedback">Feedback</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="message">Message</Label>
                        <Textarea 
                          id="message" 
                          placeholder="Tell us how we can help you..." 
                          rows={5}
                          required 
                        />
                      </div>
                      
                      <Button 
                        type="submit" 
                        size="lg" 
                        className="w-full glow-hover"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Sending...
                          </>
                        ) : (
                          <>
                            <Send className="mr-2 h-5 w-5" />
                            Send Message
                          </>
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Company Info & Office Hours */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="space-y-8"
              >
                {/* Office Hours */}
                <Card className="glass">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Clock className="h-5 w-5 text-primary" />
                      <span>Office Hours</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span>Monday - Friday</span>
                      <span className="font-medium">8:00 AM - 6:00 PM PST</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Saturday</span>
                      <span className="font-medium">10:00 AM - 4:00 PM PST</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sunday</span>
                      <span className="font-medium">Closed</span>
                    </div>
                    <div className="pt-4 border-t border-border">
                      <p className="text-sm text-muted-foreground">
                        <strong>24/7 Support:</strong> Our AI assistant and community forums are available around the clock.
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Global Offices */}
                <Card className="glass">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Globe className="h-5 w-5 text-primary" />
                      <span>Our Offices</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold">San Francisco, CA (HQ)</h4>
                      <p className="text-muted-foreground">123 Innovation Drive, Suite 100</p>
                    </div>
                    <div>
                      <h4 className="font-semibold">New York, NY</h4>
                      <p className="text-muted-foreground">456 Tech Avenue, Floor 15</p>
                    </div>
                    <div>
                      <h4 className="font-semibold">London, UK</h4>
                      <p className="text-muted-foreground">789 Developer Street, Building C</p>
                    </div>
                    <div>
                      <h4 className="font-semibold">Singapore</h4>
                      <p className="text-muted-foreground">321 Digital Plaza, Level 20</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Stats */}
                <Card className="glass gradient-bg">
                  <CardContent className="p-6 text-white text-center">
                    <h3 className="text-2xl font-bold mb-4">We're Here for You</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-3xl font-bold">&lt; 2hrs</div>
                        <div className="text-sm text-white/80">Avg. Response Time</div>
                      </div>
                      <div>
                        <div className="text-3xl font-bold">98%</div>
                        <div className="text-sm text-white/80">Satisfaction Rate</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20">
          <div className="container max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl sm:text-5xl font-bold gradient-text mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-xl text-muted-foreground">
                Quick answers to common questions about CodeFusion AI.
              </p>
            </motion.div>

            <div className="space-y-6">
              {faqItems.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                >
                  <Card className="glass glow-hover">
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold mb-3">{faq.question}</h3>
                      <p className="text-muted-foreground">{faq.answer}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="text-center mt-12"
            >
              <p className="text-muted-foreground mb-4">
                Still have questions? We're here to help!
              </p>
              <Button onClick={() => navigate('/auth')} className="glow-hover">
                Join Our Community
              </Button>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}