import { motion } from 'framer-motion';
import { Shield, Lock, Eye, FileText } from 'lucide-react';
import { Header } from '@/components/ui/header';
import { Footer } from '@/components/ui/footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function PrivacyPolicy() {
  const sections = [
    {
      icon: <Shield className="w-8 h-8 text-primary" />,
      title: "Data Protection",
      description: "How we collect, use, and protect your personal information"
    },
    {
      icon: <Lock className="w-8 h-8 text-secondary" />,
      title: "Data Security",
      description: "Security measures we implement to safeguard your data"
    },
    {
      icon: <Eye className="w-8 h-8 text-accent" />,
      title: "Your Rights",
      description: "Your rights regarding your personal data and how to exercise them"
    },
    {
      icon: <FileText className="w-8 h-8 text-primary" />,
      title: "Cookies & Analytics",
      description: "How we use cookies and analytics to improve our services"
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
                  <Shield className="w-12 h-12 text-white" />
                </div>
              </div>
              <h1 className="text-4xl sm:text-6xl font-bold mb-6">
                Privacy
                <span className="gradient-text block">Policy</span>
              </h1>
              <p className="text-xl text-white/80 mb-8 max-w-3xl mx-auto">
                Your privacy is important to us. Learn how we protect and use your information.
              </p>
              <p className="text-sm text-white/60">Last updated: January 2025</p>
            </motion.div>
          </div>
        </section>

        {/* Policy Sections */}
        <section className="py-16">
          <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
              {sections.map((section, index) => (
                <motion.div
                  key={section.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="glass glow-hover h-full">
                    <CardHeader>
                      <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl flex items-center justify-center mb-4">
                        {section.icon}
                      </div>
                      <CardTitle className="text-xl">{section.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-base">
                        {section.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Detailed Policy Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="max-w-4xl mx-auto"
            >
              <Card className="glass">
                <CardContent className="p-8 space-y-8">
                  <div>
                    <h2 className="text-2xl font-bold mb-4">Information We Collect</h2>
                    <p className="text-muted-foreground mb-4">
                      We collect information you provide directly to us, such as when you create an account, 
                      use our services, or contact us for support.
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                      <li>Account information (name, email, username)</li>
                      <li>Code snippets and projects you create</li>
                      <li>Usage data and analytics</li>
                      <li>Device and browser information</li>
                    </ul>
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold mb-4">How We Use Your Information</h2>
                    <p className="text-muted-foreground mb-4">
                      We use the information we collect to provide, maintain, and improve our services.
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                      <li>Provide and maintain our services</li>
                      <li>Personalize your learning experience</li>
                      <li>Send important updates and notifications</li>
                      <li>Improve our AI algorithms and features</li>
                    </ul>
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold mb-4">Data Security</h2>
                    <p className="text-muted-foreground mb-4">
                      We implement appropriate security measures to protect your personal information 
                      against unauthorized access, alteration, disclosure, or destruction.
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                      <li>Encryption of data in transit and at rest</li>
                      <li>Regular security audits and monitoring</li>
                      <li>Access controls and authentication</li>
                      <li>Secure hosting infrastructure</li>
                    </ul>
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold mb-4">Your Rights</h2>
                    <p className="text-muted-foreground mb-4">
                      You have certain rights regarding your personal data:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                      <li>Access and download your data</li>
                      <li>Correct inaccurate information</li>
                      <li>Delete your account and data</li>
                      <li>Opt-out of certain communications</li>
                    </ul>
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
                    <p className="text-muted-foreground">
                      If you have any questions about this Privacy Policy, please contact us at{' '}
                      <a href="mailto:privacy@codefusionai.com" className="text-primary hover:underline">
                        privacy@codefusionai.com
                      </a>
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}