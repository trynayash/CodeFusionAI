import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Play, Plus, Trash2, Copy, Download } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ApiRequest {
  id: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS';
  url: string;
  headers: Record<string, string>;
  body?: string;
  name?: string;
}

interface ApiResponse {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  data: any;
  responseTime: number;
}

interface ApiTesterProps {
  serverPort?: number;
  detectedEndpoints?: string[];
  className?: string;
}

export const ApiTester: React.FC<ApiTesterProps> = ({
  serverPort = 3000,
  detectedEndpoints = [],
  className
}) => {
  const [currentRequest, setCurrentRequest] = useState<ApiRequest>({
    id: Date.now().toString(),
    method: 'GET',
    url: `http://localhost:${serverPort}/api`,
    headers: { 'Content-Type': 'application/json' },
    body: ''
  });

  const [response, setResponse] = useState<ApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [requestHistory, setRequestHistory] = useState<ApiRequest[]>([]);
  const [newHeaderKey, setNewHeaderKey] = useState('');
  const [newHeaderValue, setNewHeaderValue] = useState('');

  const handleSendRequest = async () => {
    setIsLoading(true);
    const startTime = Date.now();

    try {
      // Simulate API request (in a real implementation, you'd make actual HTTP requests)
      await new Promise(resolve => setTimeout(resolve, Math.random() * 1000 + 500));

      const mockResponse: ApiResponse = {
        status: 200,
        statusText: 'OK',
        headers: {
          'content-type': 'application/json',
          'access-control-allow-origin': '*'
        },
        data: {
          message: 'Mock response from API tester',
          method: currentRequest.method,
          url: currentRequest.url,
          timestamp: new Date().toISOString()
        },
        responseTime: Date.now() - startTime
      };

      setResponse(mockResponse);
      
      // Add to history
      const requestWithName = {
        ...currentRequest,
        name: currentRequest.name || `${currentRequest.method} ${currentRequest.url}`
      };
      
      setRequestHistory(prev => [requestWithName, ...prev.slice(0, 9)]);
      
    } catch (error) {
      const errorResponse: ApiResponse = {
        status: 500,
        statusText: 'Internal Server Error',
        headers: {},
        data: { error: 'Failed to connect to server' },
        responseTime: Date.now() - startTime
      };
      setResponse(errorResponse);
    } finally {
      setIsLoading(false);
    }
  };

  const addHeader = () => {
    if (newHeaderKey && newHeaderValue) {
      setCurrentRequest(prev => ({
        ...prev,
        headers: {
          ...prev.headers,
          [newHeaderKey]: newHeaderValue
        }
      }));
      setNewHeaderKey('');
      setNewHeaderValue('');
    }
  };

  const removeHeader = (key: string) => {
    setCurrentRequest(prev => {
      const { [key]: removed, ...remaining } = prev.headers;
      return { ...prev, headers: remaining };
    });
  };

  const loadFromHistory = (request: ApiRequest) => {
    setCurrentRequest({ ...request, id: Date.now().toString() });
  };

  const loadDetectedEndpoint = (endpoint: string) => {
    setCurrentRequest(prev => ({
      ...prev,
      url: `http://localhost:${serverPort}${endpoint}`
    }));
  };

  const copyResponse = () => {
    if (response) {
      navigator.clipboard.writeText(JSON.stringify(response.data, null, 2));
    }
  };

  const exportCollection = () => {
    const collection = {
      name: 'API Test Collection',
      requests: requestHistory,
      timestamp: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(collection, null, 2)], {
      type: 'application/json'
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'api-collection.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Card className={cn('h-full', className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm">API Tester</CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={exportCollection}>
              <Download className="h-3 w-3 mr-1" />
              Export
            </Button>
          </div>
        </div>
        {detectedEndpoints.length > 0 && (
          <div className="space-y-2">
            <Label className="text-xs font-medium">Detected Endpoints:</Label>
            <div className="flex flex-wrap gap-1">
              {detectedEndpoints.map((endpoint, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="cursor-pointer text-xs"
                  onClick={() => loadDetectedEndpoint(endpoint)}
                >
                  {endpoint}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs defaultValue="request" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="request">Request</TabsTrigger>
            <TabsTrigger value="response">Response</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>
          
          <TabsContent value="request" className="space-y-4">
            <div className="flex gap-2">
              <Select
                value={currentRequest.method}
                onValueChange={(method) => 
                  setCurrentRequest(prev => ({ ...prev, method: method as any }))
                }
              >
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="GET">GET</SelectItem>
                  <SelectItem value="POST">POST</SelectItem>
                  <SelectItem value="PUT">PUT</SelectItem>
                  <SelectItem value="DELETE">DELETE</SelectItem>
                  <SelectItem value="PATCH">PATCH</SelectItem>
                  <SelectItem value="HEAD">HEAD</SelectItem>
                  <SelectItem value="OPTIONS">OPTIONS</SelectItem>
                </SelectContent>
              </Select>
              
              <Input
                placeholder="Enter URL..."
                value={currentRequest.url}
                onChange={(e) => 
                  setCurrentRequest(prev => ({ ...prev, url: e.target.value }))
                }
                className="flex-1"
              />
              
              <Button onClick={handleSendRequest} disabled={isLoading}>
                <Play className="h-3 w-3 mr-1" />
                {isLoading ? 'Sending...' : 'Send'}
              </Button>
            </div>

            <div className="space-y-3">
              <div>
                <Label className="text-xs font-medium mb-2 block">Headers</Label>
                <div className="space-y-2">
                  {Object.entries(currentRequest.headers).map(([key, value]) => (
                    <div key={key} className="flex gap-2 items-center">
                      <Input value={key} className="flex-1" readOnly />
                      <Input value={value} className="flex-1" readOnly />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeHeader(key)}
                        className="px-2"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                  <div className="flex gap-2 items-center">
                    <Input
                      placeholder="Header name"
                      value={newHeaderKey}
                      onChange={(e) => setNewHeaderKey(e.target.value)}
                      className="flex-1"
                    />
                    <Input
                      placeholder="Header value"
                      value={newHeaderValue}
                      onChange={(e) => setNewHeaderValue(e.target.value)}
                      className="flex-1"
                    />
                    <Button variant="ghost" size="sm" onClick={addHeader} className="px-2">
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>

              {['POST', 'PUT', 'PATCH'].includes(currentRequest.method) && (
                <div>
                  <Label className="text-xs font-medium mb-2 block">Request Body</Label>
                  <Textarea
                    placeholder="Enter JSON body..."
                    value={currentRequest.body}
                    onChange={(e) => 
                      setCurrentRequest(prev => ({ ...prev, body: e.target.value }))
                    }
                    className="font-mono text-sm min-h-[100px]"
                  />
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="response" className="space-y-4">
            {response ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant={response.status < 400 ? "default" : "destructive"}>
                      {response.status} {response.statusText}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {response.responseTime}ms
                    </span>
                  </div>
                  <Button variant="ghost" size="sm" onClick={copyResponse}>
                    <Copy className="h-3 w-3 mr-1" />
                    Copy
                  </Button>
                </div>

                <Separator />

                <div>
                  <Label className="text-xs font-medium mb-2 block">Response Headers</Label>
                  <div className="bg-muted p-2 rounded text-xs font-mono space-y-1">
                    {Object.entries(response.headers).map(([key, value]) => (
                      <div key={key}>
                        <span className="text-blue-600">{key}</span>: {value}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="text-xs font-medium mb-2 block">Response Body</Label>
                  <div className="bg-muted p-4 rounded font-mono text-xs overflow-auto max-h-[200px]">
                    <pre>{JSON.stringify(response.data, null, 2)}</pre>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center text-muted-foreground text-sm py-8">
                No response yet. Send a request to see the response here.
              </div>
            )}
          </TabsContent>

          <TabsContent value="history" className="space-y-2">
            {requestHistory.length > 0 ? (
              requestHistory.map((request) => (
                <div
                  key={request.id}
                  className="p-3 border rounded cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => loadFromHistory(request)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {request.method}
                      </Badge>
                      <span className="text-sm font-medium truncate">
                        {request.name}
                      </span>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1 truncate">
                    {request.url}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-muted-foreground text-sm py-8">
                No request history yet. Send some requests to see them here.
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};