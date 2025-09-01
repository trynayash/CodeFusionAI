import { Header } from "@/components/ui/header";
import { HeroSection } from "@/components/ui/hero-section";
import { FeaturesSection } from "@/components/ui/features-section";
import { CoursesSection } from "@/components/ui/courses-section";
import { AIAssistantSection } from "@/components/ui/ai-assistant-section";
import { TestimonialsSection } from "@/components/ui/testimonials-section";
import { CTASection } from "@/components/ui/cta-section";
import { Footer } from "@/components/ui/footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <FeaturesSection />
        <CoursesSection />
        <AIAssistantSection />
        <TestimonialsSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
