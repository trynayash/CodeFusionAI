import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import CodeEditor from "./pages/CodeEditor";
import Dashboard from "./pages/Dashboard";
import Features from "./pages/Features";
import Courses from "./pages/Courses";
import About from "./pages/About";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import AIAssistant from "./pages/AIAssistant";
import Pricing from "./pages/Pricing";
import DataStructuresAlgorithms from "./pages/DataStructuresAlgorithms";
import WebDevelopment from "./pages/WebDevelopment";
import Documentation from "./pages/Documentation";
import Community from "./pages/Community";
import AboutUs from "./pages/AboutUs";
import Careers from "./pages/Careers";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Blog from "./pages/Blog";
import Help from "./pages/Help";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/editor" element={
              <ProtectedRoute>
                <CodeEditor />
              </ProtectedRoute>
            } />
            <Route path="/features" element={<Features />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/ai-assistant" element={<AIAssistant />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/courses/data-structures-algorithms" element={<DataStructuresAlgorithms />} />
            <Route path="/courses/web-development" element={<WebDevelopment />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/help" element={<Help />} />
            <Route path="/documentation" element={<Documentation />} />
            <Route path="/community" element={<Community />} />
            <Route path="/about-us" element={<AboutUs />} />
            <Route path="/careers" element={<Careers />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
