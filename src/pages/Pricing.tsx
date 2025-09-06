import { motion } from 'framer-motion';
import { Check, Star, Zap, Crown, Rocket } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Header } from '@/components/ui/header';
import { Footer } from '@/components/ui/footer';
import { useNavigate } from 'react-router-dom';

export default function Pricing() {
  const navigate = useNavigate();

  const plans = [
    {
      name: "Free",
      icon: <Star className="w-8 h-8" />,
      price: "$0",
      period: "forever",
      description: "Perfect for getting started with coding",
      features: [
        "5 Code snippets per month",
        "Basic code editor",
        "Community support",
        "Public projects",
        "Basic AI assistance"
      ],
      buttonText: "Get Started Free",
      popular: false,
      color: "from-slate-500 to-slate-600"
    },
    {
      name: "Pro",
      icon: <Zap className="w-8 h-8" />,
      price: "$19",
      period: "per month",
      description: "Best for individual developers",
      features: [
        "Unlimited code snippets",
        "Advanced code editor",
        "Priority support",
        "Private projects",
        "Advanced AI assistance",
        "Code collaboration",
        "Export capabilities"
      ],
      buttonText: "Start Pro Trial",
      popular: true,
      color: "from-primary to-secondary"
    },
    {
      name: "Team",
      icon: <Crown className="w-8 h-8" />,
      price: "$49",
      period: "per month",
      description: "Perfect for development teams",
      features: [
        "Everything in Pro",
        "Team collaboration",
        "Admin dashboard",
        "Team analytics",
        "Custom integrations",
        "SSO authentication",
        "24/7 phone support"
      ],
      buttonText: "Contact Sales",
      popular: false,
      color: "from-accent to-secondary"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-16 gradient-bg">
          <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center text-white"
            >
              <div className="perspective-1000 mb-8">
                <div className="w-24 h-24 mx-auto bg-gradient-to-br from-primary/30 to-accent/30 rounded-2xl transform-3d hover:rotate-y-12 transition-transform duration-300 flex items-center justify-center backdrop-blur-sm border border-white/20">
                  <Rocket className="w-12 h-12 text-white" />
                </div>
              </div>
              <h1 className="text-4xl sm:text-6xl font-bold mb-6">
                Simple, Transparent
                <span className="gradient-text block">Pricing</span>
              </h1>
              <p className="text-xl text-white/80 mb-8 max-w-3xl mx-auto">
                Choose the perfect plan for your coding journey. All plans include access to our powerful code editor and AI assistant.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="py-16 -mt-8">
          <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {plans.map((plan, index) => (
                <motion.div
                  key={plan.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className={plan.popular ? "lg:scale-105" : ""}
                >
                  <Card className={`relative glass glow-hover h-full ${plan.popular ? 'border-primary/50' : ''}`}>
                    {plan.popular && (
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                        <div className="bg-gradient-to-r from-primary to-secondary text-white px-4 py-2 rounded-full text-sm font-medium">
                          Most Popular
                        </div>
                      </div>
                    )}
                    
                    <CardHeader className="text-center pb-8">
                      <div className={`w-16 h-16 mx-auto bg-gradient-to-br ${plan.color} rounded-xl flex items-center justify-center mb-4 text-white`}>
                        {plan.icon}
                      </div>
                      <CardTitle className="text-2xl">{plan.name}</CardTitle>
                      <div className="mt-4">
                        <span className="text-4xl font-bold">{plan.price}</span>
                        <span className="text-muted-foreground ml-2">/{plan.period}</span>
                      </div>
                      <CardDescription className="mt-2 text-base">
                        {plan.description}
                      </CardDescription>
                    </CardHeader>
                    
                    <CardContent className="space-y-6">
                      <ul className="space-y-3">
                        {plan.features.map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-center space-x-3">
                            <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                            <span className="text-sm">{feature}</span>
                          </li>
                        ))}
                      </ul>
                      
                      <Button
                        className={`w-full ${plan.popular ? 'bg-primary hover:bg-primary/90' : 'variant-outline'}`}
                        onClick={() => navigate('/auth')}
                      >
                        {plan.buttonText}
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 bg-muted/30">
          <div className="container max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Frequently Asked Questions
              </h2>
            </motion.div>

            <div className="space-y-6">
              {[
                {
                  question: "Can I upgrade or downgrade my plan anytime?",
                  answer: "Yes, you can change your plan at any time. Changes will be reflected in your next billing cycle."
                },
                {
                  question: "What happens if I exceed my plan limits?",
                  answer: "We'll notify you when you're approaching your limits. You can upgrade your plan or wait for the next billing cycle."
                },
                {
                  question: "Do you offer refunds?",
                  answer: "We offer a 30-day money-back guarantee for all paid plans. Contact our support team for assistance."
                }
              ].map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="glass">
                    <CardHeader>
                      <CardTitle className="text-lg">{faq.question}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{faq.answer}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}