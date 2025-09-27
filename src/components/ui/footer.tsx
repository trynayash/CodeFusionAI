import { Code, Sparkles, Github, Twitter, Linkedin, Mail, Heart, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useTheme } from "@/contexts/ThemeContext";
import CodeFusionLogo from '@/components/CodeFusionLogo';

// Import language logos from All_logo_and_pictures-main
import javascriptLogo from '@/assets/All_logo_and_pictures-main/programming languages/javascript.svg';
import pythonLogo from '@/assets/All_logo_and_pictures-main/programming languages/python.svg'; 
import reactLogo from '@/assets/All_logo_and_pictures-main/frameworks/react.svg';
import typescriptLogo from '@/assets/All_logo_and_pictures-main/programming languages/typescript.svg';
import javaLogo from '@/assets/All_logo_and_pictures-main/programming languages/java.svg';
import cppLogo from '@/assets/All_logo_and_pictures-main/programming languages/c++.svg';

const programmingLanguages = [
  { name: "JavaScript", logo: javascriptLogo, color: "#F7DF1E" },
  { name: "Python", logo: pythonLogo, color: "#3776AB" },
  { name: "React", logo: reactLogo, color: "#61DAFB" },
  { name: "TypeScript", logo: typescriptLogo, color: "#3178C6" },
  { name: "Java", logo: javaLogo, color: "#ED8B00" },
  { name: "C++", logo: cppLogo, color: "#00599C" }
];

const footerLinks = {
  Platform: [
    { name: "Features", href: "/features" },
    { name: "Courses", href: "/courses" },
    { name: "AI Assistant", href: "/ai-assistant" },
    { name: "Pricing", href: "/pricing" }
  ],
  Courses: [
    { name: "Data Structures & Algorithms", href: "/courses/data-structures-algorithms" },
    { name: "Web Development", href: "/courses/web-development" },
    { name: "Python Programming", href: "/courses/python" },
    { name: "Full-Stack Development", href: "/courses/fullstack" }
  ],
  Resources: [
    { name: "Documentation", href: "/documentation" },
    { name: "Community", href: "/community" },
    { name: "Blog", href: "/blog" },
    { name: "Help Center", href: "/help" }
  ],
  Company: [
    { name: "About Us", href: "/about-us" },
    { name: "Careers", href: "/careers" },
    { name: "Contact", href: "/contact" },
    { name: "Privacy Policy", href: "/privacy-policy" }
  ]
};

const socialLinks = [
  { name: "GitHub", icon: Github, href: "https://github.com/trynayash" },
  { name: "Twitter", icon: Twitter, href: "https://x.com/yxshsuthar" },
  { name: "LinkedIn", icon: Linkedin, href: "https://linkedin.com/in/yxshsuthar" },
  { name: "Email", icon: Mail, href: "mailto:yashrsuthar90@gmail.com" }
];

export function Footer({ brandSize = 'md' }: { brandSize?: 'sm' | 'md' | 'lg' | 'xl' }) {
  const { theme } = useTheme();
  
  return (
    <footer className="relative overflow-hidden">
      {/* Enhanced Background */}
      <div className={`absolute inset-0 ${theme === 'dark' 
        ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' 
        : 'bg-gradient-to-br from-slate-100 via-slate-50 to-slate-100'
      }`}>
        {/* Animated background patterns */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-0 w-full h-full bg-grid-pattern"></div>
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-3/4 left-1/2 w-48 h-48 bg-secondary/10 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>
      </div>
      
      <div className="relative z-10 container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Programming Languages Showcase */}
        <div className={`py-12 border-b ${theme === 'dark' ? 'border-white/10' : 'border-slate-300/30'}`}>
          <div className="text-center mb-8">
            <h3 className={`text-2xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>
              Learn Any Language
            </h3>
            <p className={`${theme === 'dark' ? 'text-white/70' : 'text-slate-600'}`}>
              Master the most popular programming languages with AI assistance
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center items-center gap-10">
            {programmingLanguages.map((lang) => (
              <div key={lang.name} className="text-center">
                <img src={lang.logo} alt={lang.name} className="w-12 h-12 mx-auto" />
                <p className={`${theme === 'dark' ? 'text-white/80' : 'text-slate-700'} text-sm mt-2 font-medium`}>{lang.name}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Enhanced Brand Section */}
            <div className="lg:col-span-4">
              <div className="mb-6">
                <CodeFusionLogo size={brandSize} animated={true} showText={true} />
                <div className="sr-only brand-text">CodeFusionAI</div>
              </div>
              
              <p className={`mb-8 leading-relaxed ${theme === 'dark' ? 'text-white/70' : 'text-slate-600'}`}>
                Empowering the next generation of developers through AI-powered learning. 
                Transform your coding journey with personalized guidance and intelligent assistance.
              </p>

              {/* Enhanced Newsletter Signup */}
              <div className="space-y-4">
                <div className={`flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>
                  <Zap className="w-4 h-4 text-accent" />
                  <h3 className="font-semibold">Stay Updated</h3>
                </div>
                <div className="flex space-x-2">
                  <div className="flex-1 relative">
                    <input
                      type="email"
                      placeholder="Enter your email"
                      className={`w-full px-4 py-3 backdrop-blur-sm border rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary/50 outline-none transition-all duration-300 ${
                        theme === 'dark'
                          ? 'bg-white/5 border-white/20 text-white placeholder:text-white/50'
                          : 'bg-white/80 border-slate-300 text-slate-800 placeholder:text-slate-500'
                      }`}
                    />
                  </div>
                  <Button className="bg-gradient-to-r from-primary to-accent hover:from-primary-dark hover:to-accent-dark text-white px-6 py-3 rounded-xl transition-all duration-300 hover:scale-105">
                    Subscribe
                  </Button>
                </div>
              </div>
            </div>

            {/* Enhanced Links Sections */}
            <div className="lg:col-span-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {Object.entries(footerLinks).map(([category, links]) => (
                  <div key={category}>
                    <h3 className={`font-bold mb-6 text-lg ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>
                      {category}
                    </h3>
                    <ul className="space-y-4">
                      {links.map((link) => (
                        <li key={link.name}>
                          <Link
                            to={link.href}
                            className={`transition-all duration-200 hover:translate-x-2 inline-flex items-center group text-sm transition-transform hover:translate-x-1 ${
                              theme === 'dark' 
                                ? 'text-white/70 hover:text-white' 
                                : 'text-slate-600 hover:text-slate-800'
                            }`}
                          >
                            <span className="w-1 h-1 bg-accent rounded-full mr-3 group-hover:w-2 transition-all duration-200"></span>
                            {link.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Bottom Footer */}
        <div className={`py-8 border-t ${theme === 'dark' ? 'border-white/10' : 'border-slate-300/30'}`}>
          <div className="flex flex-col md:flex-row items-center justify-between space-y-6 md:space-y-0">
            {/* Enhanced Copyright */}
            <div className={`flex items-center gap-2 ${theme === 'dark' ? 'text-white/60' : 'text-slate-500'}`}>
              © 2025 CodeFusionAI. All rights reserved. Built with 
              <Heart className="w-4 h-4 text-red-400 animate-pulse" fill="currentColor" />
              for developers worldwide.
            </div>

            {/* Enhanced Social Links */}
            <div className="flex items-center space-x-3">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    className={`group relative p-3 rounded-xl backdrop-blur-sm border transition-all duration-300 hover:scale-110 ${
                      theme === 'dark'
                        ? 'bg-white/5 border-white/10 text-white/70 hover:text-white hover:border-white/30'
                        : 'bg-white/50 border-slate-200 text-slate-600 hover:text-slate-800 hover:border-slate-300'
                    }`}
                    aria-label={social.name}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <Icon className="h-5 w-5 relative z-10" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}