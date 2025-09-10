import { Code, Sparkles, Github, Twitter, Linkedin, Mail, Heart, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import logoSvg from '@/assets/logo-cool.png';

// Import official language logos
import javascriptLogo from '@/assets/languages/javascript-official.svg';
import pythonLogo from '@/assets/languages/python-official.svg'; 
import reactLogo from '@/assets/languages/react-official.svg';
import typescriptLogo from '@/assets/languages/typescript-official.svg';
import javaLogo from '@/assets/languages/java-official.svg';
import cppLogo from '@/assets/languages/cplusplus-official.svg';

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
  { name: "GitHub", icon: Github, href: "#" },
  { name: "Twitter", icon: Twitter, href: "#" },
  { name: "LinkedIn", icon: Linkedin, href: "#" },
  { name: "Email", icon: Mail, href: "mailto:hello@codefusion.ai" }
];

export function Footer() {
  return (
    <footer className="relative overflow-hidden">
      {/* Enhanced Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
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
        <div className="py-12 border-b border-white/10">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-white mb-2">Learn Any Language</h3>
            <p className="text-white/70">Master the most popular programming languages with AI assistance</p>
          </div>
          
          <div className="flex flex-wrap justify-center items-center gap-8">
            {programmingLanguages.map((lang, index) => (
              <div
                key={lang.name}
                className="group relative"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="absolute inset-0 rounded-xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-300"
                     style={{ backgroundColor: lang.color }}></div>
                <div className="relative bg-white/5 backdrop-blur-sm p-4 rounded-xl border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-110">
                  <img 
                    src={lang.logo} 
                    alt={lang.name} 
                    className="w-12 h-12 mx-auto mb-2"
                  />
                  <p className="text-white/80 text-sm text-center font-medium">{lang.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Enhanced Brand Section */}
            <div className="lg:col-span-4">
              <div className="flex items-center space-x-3 mb-6">
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary via-accent to-secondary rounded-xl blur-lg group-hover:blur-xl transition-all duration-300 opacity-60"></div>
                  <div className="relative bg-gradient-to-br from-white/10 to-white/5 p-3 rounded-xl backdrop-blur-sm border border-white/20">
                    <img src={logoSvg} alt="CodeFusion AI" className="w-10 h-10" />
                  </div>
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-white via-white to-white/80 bg-clip-text text-transparent">CodeFusion AI</h1>
                  <p className="text-white/60 text-sm">AI-Powered Learning</p>
                </div>
              </div>
              
              <p className="text-white/70 mb-8 leading-relaxed">
                Empowering the next generation of developers through AI-powered learning. 
                Transform your coding journey with personalized guidance and intelligent assistance.
              </p>

              {/* Enhanced Newsletter Signup */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-white">
                  <Zap className="w-4 h-4 text-accent" />
                  <h3 className="font-semibold">Stay Updated</h3>
                </div>
                <div className="flex space-x-2">
                  <div className="flex-1 relative">
                    <input
                      type="email"
                      placeholder="Enter your email"
                      className="w-full px-4 py-3 bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder:text-white/50 focus:ring-2 focus:ring-primary/50 focus:border-primary/50 outline-none transition-all duration-300"
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
                    <h3 className="font-bold mb-6 text-white text-lg">{category}</h3>
                    <ul className="space-y-4">
                      {links.map((link) => (
                        <li key={link.name}>
                          <Link
                            to={link.href}
                            className="text-white/70 hover:text-white transition-all duration-200 hover:translate-x-2 inline-flex items-center group text-sm"
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
        <div className="py-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-6 md:space-y-0">
            {/* Enhanced Copyright */}
            <div className="text-white/60 flex items-center gap-2">
              © 2024 CodeFusion AI. All rights reserved. Built with 
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
                    className="group relative p-3 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 text-white/70 hover:text-white hover:border-white/30 transition-all duration-300 hover:scale-110"
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