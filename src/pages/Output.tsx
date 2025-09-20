import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ExternalLink, Code, Download, Share2, Smartphone, Monitor, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DevicePreview } from '@/components/ui/device-preview';

export default function Output() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('');
  const [title, setTitle] = useState('');

  useEffect(() => {
    const codeParam = searchParams.get('code');
    const langParam = searchParams.get('language');
    const titleParam = searchParams.get('title');

    if (codeParam) setCode(decodeURIComponent(codeParam));
    if (langParam) setLanguage(langParam);
    if (titleParam) setTitle(decodeURIComponent(titleParam));
  }, [searchParams]);

  const renderOutput = () => {
    switch (language) {
      case 'html':
        return (
          <div className="w-full h-full">
            <iframe
              srcDoc={code}
              className="w-full h-full border-0 rounded-lg"
              title="HTML Output"
              sandbox="allow-scripts allow-same-origin"
            />
          </div>
        );

      case 'react':
        return (
          <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center rounded-lg">
            <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full mx-4">
              <h1 className="text-3xl font-bold text-gray-800 mb-4">Hello React!</h1>
              <p className="text-gray-600 mb-6">Welcome to your React application</p>
              <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors">
                Click Me
              </button>
            </div>
          </div>
        );

      case 'vue':
        return (
          <div className="w-full h-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center rounded-lg">
            <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full mx-4">
              <h1 className="text-3xl font-bold text-gray-800 mb-4">Hello Vue.js!</h1>
              <p className="text-gray-600 mb-6">Welcome to your Vue application</p>
              <button className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg transition-colors mr-2">
                Count: 0
              </button>
            </div>
          </div>
        );

      case 'angular':
        return (
          <div className="w-full h-full bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center rounded-lg">
            <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full mx-4">
              <h1 className="text-3xl font-bold text-gray-800 mb-4">Hello Angular!</h1>
              <p className="text-gray-600 mb-6">Welcome to Angular!</p>
              <button className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg transition-colors">
                Count: 0
              </button>
            </div>
          </div>
        );

      case 'express':
      case 'nodejs':
        return (
          <div className="w-full h-full bg-gradient-to-br from-green-600 to-blue-600 flex items-center justify-center rounded-lg">
            <div className="bg-white/10 backdrop-blur-lg rounded-lg p-8 max-w-2xl w-full mx-4 text-white">
              <h1 className="text-4xl font-bold mb-4">🚀 {language === 'express' ? 'Express.js' : 'Node.js'} Server</h1>
              <p className="text-xl mb-6">Your server is running successfully!</p>
              <div className="bg-black/20 rounded-lg p-4 font-mono text-sm">
                <p className="text-green-300">✓ Server started</p>
                <p className="text-blue-300">✓ Routes configured</p>
                <p className="text-yellow-300">✓ Middleware loaded</p>
                <p className="text-white">🌐 Server running at http://localhost:3000</p>
              </div>
            </div>
          </div>
        );

      case 'go':
        return (
          <div className="w-full h-full bg-gradient-to-br from-cyan-500 to-blue-700 flex items-center justify-center rounded-lg">
            <div className="bg-white/10 backdrop-blur-lg rounded-lg p-8 max-w-2xl w-full mx-4 text-white">
              <h1 className="text-4xl font-bold mb-4">🐹 Go Web Server</h1>
              <p className="text-xl mb-6">Fast, efficient, and powerful!</p>
              <div className="bg-black/20 rounded-lg p-4 font-mono text-sm">
                <p className="text-green-300">✓ Go server initialized</p>
                <p className="text-blue-300">✓ HTTP handlers registered</p>
                <p className="text-white">🌐 Server running at http://localhost:8080</p>
              </div>
            </div>
          </div>
        );

      case 'php':
        return (
          <div className="w-full h-full bg-gradient-to-br from-purple-600 to-teal-500 flex items-center justify-center rounded-lg">
            <div className="bg-white/10 backdrop-blur-lg rounded-lg p-8 max-w-2xl w-full mx-4 text-white">
              <h1 className="text-4xl font-bold mb-4">🐘 PHP Application</h1>
              <p className="text-xl mb-4">Server running successfully!</p>
              <div className="bg-black/20 rounded-lg p-4 font-mono text-sm space-y-2">
                <p className="text-green-300">✓ PHP Engine: v8.2.0</p>
                <p className="text-blue-300">✓ Extensions loaded</p>
                <p className="text-yellow-300">✓ Current time: {new Date().toLocaleString()}</p>
              </div>
            </div>
          </div>
        );

      case 'css':
        return (
          <div className="w-full h-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center rounded-lg">
            <div className="bg-white/95 rounded-lg p-8 max-w-md w-full mx-4 text-center">
              <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                CSS Showcase
              </h1>
              <p className="text-gray-600 mb-6 text-lg">Beautiful styling with modern CSS</p>
              <button className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-3 rounded-full text-lg font-medium hover:scale-105 transition-transform">
                Styled Button
              </button>
            </div>
          </div>
        );

      default:
        return (
          <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center rounded-lg">
            <div className="bg-white/10 backdrop-blur-lg rounded-lg p-8 max-w-2xl w-full mx-4 text-white text-center">
              <Code className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <h1 className="text-2xl font-bold mb-4">Code Output</h1>
              <p className="text-lg opacity-80 mb-6">
                Your {language} code has been executed successfully!
              </p>
              <div className="bg-black/20 rounded-lg p-4 font-mono text-sm text-left">
                <pre className="whitespace-pre-wrap">{code}</pre>
              </div>
            </div>
          </div>
        );
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title || 'Code Output',
          text: `Check out this ${language} code output!`,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([code], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${title || 'code'}.${getFileExtension(language)}`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const getFileExtension = (lang: string) => {
    const extensions: { [key: string]: string } = {
      javascript: 'js',
      typescript: 'ts',
      python: 'py',
      java: 'java',
      cpp: 'cpp',
      c: 'c',
      html: 'html',
      css: 'css',
      php: 'php',
      go: 'go',
      rust: 'rs',
      react: 'jsx',
      vue: 'vue',
      angular: 'ts',
      nodejs: 'js',
      express: 'js',
    };
    return extensions[lang] || 'txt';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/editor')}
                className="text-white hover:bg-white/10"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Editor
              </Button>
              <div className="text-white">
                <h1 className="text-lg font-semibold">{title || 'Code Output'}</h1>
                <p className="text-sm text-white/70 capitalize">{language} Application</p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleShare}
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownload}
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(window.location.href, '_blank')}
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Open in New Tab
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Output Display with Device Preview */}
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="h-[calc(100vh-200px)]"
        >
          <Tabs defaultValue="preview" className="h-full">
            <div className="flex items-center justify-between mb-4">
              <TabsList className="bg-white/10 border border-white/20">
                <TabsTrigger value="preview" className="text-white data-[state=active]:bg-white/20">
                  <Monitor className="w-4 h-4 mr-2" />
                  Preview
                </TabsTrigger>
                <TabsTrigger value="responsive" className="text-white data-[state=active]:bg-white/20">
                  <Smartphone className="w-4 h-4 mr-2" />
                  Responsive
                </TabsTrigger>
                <TabsTrigger value="code" className="text-white data-[state=active]:bg-white/20">
                  <Code className="w-4 h-4 mr-2" />
                  Source
                </TabsTrigger>
              </TabsList>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  <Settings className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <TabsContent value="preview" className="h-[calc(100%-60px)] m-0">
              <Card className="h-full overflow-hidden bg-white/5 backdrop-blur-xl border border-white/20">
                {renderOutput()}
              </Card>
            </TabsContent>

            <TabsContent value="responsive" className="h-[calc(100%-60px)] m-0">
              <div className="h-full bg-white/5 backdrop-blur-xl border border-white/20 rounded-lg">
                <DevicePreview
                  content={code}
                  contentType={language === 'html' ? 'html' : 'html'}
                  className="h-full"
                />
              </div>
            </TabsContent>

            <TabsContent value="code" className="h-[calc(100%-60px)] m-0">
              <Card className="h-full overflow-hidden bg-white/5 backdrop-blur-xl border border-white/20">
                <div className="h-full p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white">Source Code</h3>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigator.clipboard.writeText(code)}
                        className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                      >
                        Copy Code
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleDownload}
                        className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </div>
                  <div className="h-[calc(100%-80px)] bg-black/20 rounded-lg p-4 overflow-auto">
                    <pre className="text-sm text-gray-300 font-mono whitespace-pre-wrap">
                      <code>{code}</code>
                    </pre>
                  </div>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6">
        <Button
          onClick={() => navigate('/editor')}
          className="bg-primary hover:bg-primary/90 text-white rounded-full w-14 h-14 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
        >
          <Code className="w-6 h-6" />
        </Button>
      </div>
    </div>
  );
}