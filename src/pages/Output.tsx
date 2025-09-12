import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Monitor, Smartphone, Code, Download, Share, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Header } from '@/components/ui/header';
import { DevicePreview } from '@/components/ui/device-preview';
import { useToast } from '@/hooks/use-toast';

const sampleHtmlOutput = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Code Output Preview</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .container {
            background: rgba(255, 255, 255, 0.9);
            padding: 2rem;
            border-radius: 20px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            text-align: center;
            max-width: 600px;
            width: 100%;
        }
        h1 {
            color: #333;
            margin-bottom: 1rem;
            font-size: 2.5rem;
        }
        p {
            color: #666;
            font-size: 1.2rem;
            line-height: 1.6;
            margin-bottom: 1.5rem;
        }
        .feature-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1rem;
            margin-top: 2rem;
        }
        .feature-card {
            background: #f8f9fa;
            padding: 1rem;
            border-radius: 10px;
            border: 2px solid #e9ecef;
        }
        .feature-card h3 {
            color: #495057;
            margin-bottom: 0.5rem;
        }
        .feature-card p {
            font-size: 0.9rem;
            margin: 0;
        }
        @media (max-width: 768px) {
            .container {
                margin: 0 1rem;
                padding: 1.5rem;
            }
            h1 {
                font-size: 2rem;
            }
            .feature-grid {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🚀 Code Output Preview</h1>
        <p>Your code has been successfully executed! This is a sample output preview showing how your web applications will appear.</p>
        
        <div class="feature-grid">
            <div class="feature-card">
                <h3>📱 Responsive Design</h3>
                <p>Works perfectly on all devices</p>
            </div>
            <div class="feature-card">
                <h3>⚡ Fast Performance</h3>
                <p>Optimized for speed and efficiency</p>
            </div>
            <div class="feature-card">
                <h3>🎨 Modern UI</h3>
                <p>Beautiful and intuitive interface</p>
            </div>
            <div class="feature-card">
                <h3>🔧 Easy to Use</h3>
                <p>Simple and straightforward</p>
            </div>
        </div>
    </div>
</body>
</html>
`;

const sampleSourceCode = `// Sample React Component
import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [message, setMessage] = useState('Hello, World!');
  const [count, setCount] = useState(0);

  useEffect(() => {
    document.title = \`Count: \${count}\`;
  }, [count]);

  const handleClick = () => {
    setCount(prev => prev + 1);
    setMessage(\`Clicked \${count + 1} times!\`);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>React Output Preview</h1>
        <p>{message}</p>
        <button onClick={handleClick} className="counter-btn">
          Count: {count}
        </button>
      </header>
    </div>
  );
}

export default App;`;

export default function Output() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('preview');
  const [showSourceCode, setShowSourceCode] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleDownload = () => {
    const blob = new Blob([sampleHtmlOutput], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'output.html';
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Download started",
      description: "Your output file is being downloaded.",
    });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Code Output Preview',
        text: 'Check out my code output!',
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied",
        description: "Share link has been copied to clipboard.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Top Navigation */}
      <div className="pt-16 border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/code-editor')}
                className="flex-shrink-0"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Editor
              </Button>
              <Separator orientation="vertical" className="h-6" />
              <div className="flex items-center space-x-2">
                <Eye className="w-5 h-5 text-primary" />
                <span className="font-semibold">Output Preview</span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="hidden sm:inline-flex">
                Web Output
              </Badge>
              <Button variant="outline" size="sm" onClick={handleDownload}>
                <Download className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">Download</span>
              </Button>
              <Button variant="outline" size="sm" onClick={handleShare}>
                <Share className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">Share</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-6 gap-4">
            <TabsList className="grid grid-cols-3 w-full lg:w-auto">
              <TabsTrigger value="preview" className="flex items-center gap-2">
                <Monitor className="w-4 h-4" />
                <span className="hidden sm:inline">Preview</span>
              </TabsTrigger>
              <TabsTrigger value="responsive" className="flex items-center gap-2">
                <Smartphone className="w-4 h-4" />
                <span className="hidden sm:inline">Responsive</span>
              </TabsTrigger>
              <TabsTrigger value="source" className="flex items-center gap-2">
                <Code className="w-4 h-4" />
                <span className="hidden sm:inline">Source</span>
              </TabsTrigger>
            </TabsList>

            {activeTab === 'source' && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowSourceCode(!showSourceCode)}
                className="flex items-center gap-2"
              >
                {showSourceCode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                {showSourceCode ? 'Hide Source' : 'Show Source'}
              </Button>
            )}
          </div>

          <TabsContent value="preview" className="space-y-6">
            <Card className="w-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Monitor className="w-5 h-5" />
                  Standard Preview
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="w-full h-[600px] border rounded-lg overflow-hidden">
                  <iframe
                    srcDoc={sampleHtmlOutput}
                    className="w-full h-full border-none"
                    title="Code Output Preview"
                  />
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="font-medium">Status</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Application is running successfully
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="font-medium">Performance</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Load time: 1.2s | Size: 4.3KB
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                    <span className="font-medium">Technology</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    HTML5, CSS3, JavaScript
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="responsive" className="space-y-6">
            <Card className="w-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Smartphone className="w-5 h-5" />
                  Responsive Device Testing
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="h-[700px]">
                  <DevicePreview
                    content={sampleHtmlOutput}
                    contentType="html"
                  onDeviceChange={(device) => 
                    toast({
                      title: "Device Changed",
                      description: "Switched to " + device.name,
                    })
                  }
                  onOrientationChange={(orientation) =>
                    toast({
                      title: "Orientation Changed", 
                      description: "Switched to " + orientation + " mode",
                    })
                  }
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="source" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="w-5 h-5" />
                  Source Code
                </CardTitle>
              </CardHeader>
              <CardContent>
                {showSourceCode ? (
                  <div className="space-y-4">
                    <div className="p-4 bg-muted rounded-lg">
                      <h4 className="font-medium mb-2">Generated HTML Output</h4>
                      <pre className="text-xs overflow-x-auto whitespace-pre-wrap">
                        <code>{sampleHtmlOutput}</code>
                      </pre>
                    </div>
                    
                    <Separator />
                    
                    <div className="p-4 bg-muted rounded-lg">
                      <h4 className="font-medium mb-2">Original Source Code</h4>
                      <pre className="text-xs overflow-x-auto whitespace-pre-wrap">
                        <code>{sampleSourceCode}</code>
                      </pre>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Code className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-medium mb-2">Source Code Hidden</h3>
                    <p className="text-muted-foreground mb-4">
                      Click "Show Source" to view the generated code and original source.
                    </p>
                    <Button onClick={() => setShowSourceCode(true)}>
                      <Eye className="w-4 h-4 mr-2" />
                      Show Source Code
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}