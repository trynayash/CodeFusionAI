import { Code, Sparkles, Github, Twitter, Linkedin, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

const footerLinks = {
  Platform: [
    { name: "Features", href: "#features" },
    { name: "Courses", href: "#courses" },
    { name: "AI Assistant", href: "#ai-assistant" },
    { name: "Pricing", href: "#pricing" }
  ],
  Courses: [
    { name: "Data Structures & Algorithms", href: "#" },
    { name: "Web Development", href: "#" },
    { name: "Python Programming", href: "#" },
    { name: "Full-Stack Development", href: "#" }
  ],
  Resources: [
    { name: "Documentation", href: "#" },
    { name: "Community", href: "#" },
    { name: "Blog", href: "#" },
    { name: "Help Center", href: "#" }
  ],
  Company: [
    { name: "About Us", href: "#" },
    { name: "Careers", href: "#" },
    { name: "Contact", href: "#" },
    { name: "Privacy Policy", href: "#" }
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
    <footer className="bg-muted/30 border-t border-border/30">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Brand Section */}
            <div className="lg:col-span-4">
              <div className="flex items-center space-x-2 mb-4">
                <div className="relative">
                  <Code className="h-8 w-8 text-primary" />
                  <Sparkles className="h-4 w-4 text-accent absolute -top-1 -right-1" />
                </div>
                <h1 className="text-xl font-bold gradient-text">CodeFusion AI</h1>
              </div>
              
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Empowering the next generation of developers through AI-powered learning. 
                Transform your coding journey with personalized guidance and intelligent assistance.
              </p>

              {/* Newsletter Signup */}
              <div className="space-y-3">
                <h3 className="font-semibold text-sm">Stay Updated</h3>
                <div className="flex space-x-2">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 px-3 py-2 bg-background border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                  />
                  <Button size="sm" className="bg-gradient-primary text-primary-foreground">
                    Subscribe
                  </Button>
                </div>
              </div>
            </div>

            {/* Links Sections */}
            <div className="lg:col-span-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {Object.entries(footerLinks).map(([category, links]) => (
                  <div key={category}>
                    <h3 className="font-semibold mb-4 text-sm">{category}</h3>
                    <ul className="space-y-3">
                      {links.map((link) => (
                        <li key={link.name}>
                          <a
                            href={link.href}
                            className="text-sm text-muted-foreground hover:text-primary transition-colors"
                          >
                            {link.name}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="py-6 border-t border-border/30">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            {/* Copyright */}
            <div className="text-sm text-muted-foreground">
              © 2024 CodeFusion AI. All rights reserved. Built with ❤️ for developers worldwide.
            </div>

            {/* Social Links */}
            <div className="flex items-center space-x-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    className="p-2 rounded-lg bg-background hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors"
                    aria-label={social.name}
                  >
                    <Icon className="h-4 w-4" />
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