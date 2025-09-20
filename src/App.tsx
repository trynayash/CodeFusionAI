import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useState, useEffect, Suspense, lazy } from "react";
import { LoadingScreen, PageLoadingSpinner } from "@/components/ui/loading-screen";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { SessionProvider } from "@/contexts/SessionContext";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { SessionManager } from "@/components/session/SessionManager";
import { log } from "@/utils/logger";
import { queryClient } from "@/lib/queryClient";
import { initializeSecurity } from "@/utils/security";
import { initializePerformance } from "@/utils/performance";

// Lazy load components for better performance with error boundaries
const Index = lazy(() => import("./pages/Index"));
const Auth = lazy(() => import("./pages/Auth"));
const MagicLinkHandler = lazy(() => import("./pages/MagicLinkHandler"));
const CodeEditor = lazy(() => import("./pages/CodeEditor"));
const UnifiedCodeEditor = lazy(() => import("./pages/UnifiedCodeEditor"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Features = lazy(() => import("./pages/Features"));
const Courses = lazy(() => import("./pages/Courses"));
const CourseDetail = lazy(() => import("./pages/CourseDetail"));
const CourseLearning = lazy(() => import("./pages/CourseLearning"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const NotFound = lazy(() => import("./pages/NotFound"));
const AIAssistant = lazy(() => import("./pages/AIAssistant"));
const Pricing = lazy(() => import("./pages/Pricing"));
const DataStructuresAlgorithms = lazy(() => import("./pages/DataStructuresAlgorithms"));
const WebDevelopment = lazy(() => import("./pages/WebDevelopment"));
const Documentation = lazy(() => import("./pages/Documentation"));
const Community = lazy(() => import("./pages/Community"));
const AboutUs = lazy(() => import("./pages/AboutUs"));
const Careers = lazy(() => import("./pages/Careers"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const Blog = lazy(() => import("./pages/Blog"));
const Help = lazy(() => import("./pages/Help"));
const DesignAssets = lazy(() => import("./pages/DesignAssets"));

// Lazy load editor components for better performance
const EditorComponents = lazy(() => import("./components/editor/DynamicEditor"));


// Page transition wrapper
function PageTransition({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

// App Routes Component
function AppRoutes() {
  return (
    <PageTransition>
      <Suspense fallback={<PageLoadingSpinner />}>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/magic-link-handler" element={<MagicLinkHandler />} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          {/* Code Editor - Main editor route */}
          <Route path="/editor" element={
            <ProtectedRoute>
              <CodeEditor />
            </ProtectedRoute>
          } />
          {/* Unified Code Editor - Advanced project-based editor */}
          <Route path="/editor/:language" element={
            <ProtectedRoute>
              <UnifiedCodeEditor />
            </ProtectedRoute>
          } />
          
          <Route path="/features" element={<Features />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/course/:courseId" element={<CourseDetail />} />
          <Route path="/course/:courseId/learn" element={
            <ProtectedRoute>
              <CourseLearning />
            </ProtectedRoute>
          } />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/ai-assistant" element={<AIAssistant />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/courses/data-structures-algorithms" element={<DataStructuresAlgorithms />} />
          <Route path="/courses/web-development" element={<WebDevelopment />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/help" element={<Help />} />
          <Route path="/design-assets" element={<DesignAssets />} />
          <Route path="/documentation" element={<Documentation />} />
          <Route path="/community" element={<Community />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </PageTransition>
  );
}

const App = () => {
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  useEffect(() => {
    // Initialize logger
    log.info('CodeFusion AI application starting', {
      version: '1.0.0',
      environment: process.env.NODE_ENV,
      timestamp: new Date().toISOString()
    });

    // Initialize security and performance monitoring
    initializeSecurity();
    initializePerformance();

    // Simulate initial app loading
    const timer = setTimeout(() => {
      setIsInitialLoading(false);
      log.info('Application initialization complete');
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (isInitialLoading) {
    return <LoadingScreen message="Initializing CodeFusion AI..." />;
  }

  return (
    <ErrorBoundary
      onError={(error, errorInfo) => {
        log.error('Application-level error caught', error, 'APP_ERROR_BOUNDARY');
        log.error('Error info', errorInfo, 'APP_ERROR_BOUNDARY');
      }}
    >
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <AuthProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <SessionProvider
                  config={{
                    sessionDuration: 15 * 60 * 1000, // 15 minutes
                    warningTime: 1 * 60 * 1000, // 1 minute warning
                    extensionDuration: 10 * 60 * 1000, // 10 minutes extension
                    checkInterval: 30 * 1000, // Check every 30 seconds
                  }}
                >
                  <ErrorBoundary
                    onError={(error, errorInfo) => {
                      log.error('Router-level error caught', error, 'ROUTER_ERROR_BOUNDARY');
                    }}
                  >
                    <AppRoutes />
                    <SessionManager />
                  </ErrorBoundary>
                </SessionProvider>
              </BrowserRouter>
            </TooltipProvider>
          </AuthProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
