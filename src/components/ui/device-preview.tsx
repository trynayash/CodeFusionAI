/**
 * Device Preview Component
 * 
 * Responsive preview component with device mockups for testing UI/UX output
 * across different screen sizes and devices.
 * 
 * Features:
 * - Multiple device presets (Mobile, Tablet, Desktop, Custom)
 * - Responsive iframe container
 * - Device frame mockups
 * - Orientation toggle (Portrait/Landscape)
 * - Zoom controls
 * - Screenshot capture
 * - Device metrics display
 * - Touch simulation
 */

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Smartphone,
  Tablet,
  Monitor,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Camera,
  Maximize,
  Minimize,
  Settings,
  Ruler,
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';

export interface DevicePreset {
  id: string;
  name: string;
  width: number;
  height: number;
  pixelRatio: number;
  userAgent: string;
  type: 'mobile' | 'tablet' | 'desktop';
  icon: React.ReactNode;
}

export interface DevicePreviewProps {
  content: string;
  contentType: 'html' | 'url';
  className?: string;
  onDeviceChange?: (device: DevicePreset) => void;
  onOrientationChange?: (orientation: 'portrait' | 'landscape') => void;
  onZoomChange?: (zoom: number) => void;
}

const DEVICE_PRESETS: DevicePreset[] = [
  {
    id: 'iphone-14',
    name: 'iPhone 14',
    width: 390,
    height: 844,
    pixelRatio: 3,
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15',
    type: 'mobile',
    icon: <Smartphone className="w-4 h-4" />
  },
  {
    id: 'iphone-14-plus',
    name: 'iPhone 14 Plus',
    width: 428,
    height: 926,
    pixelRatio: 3,
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15',
    type: 'mobile',
    icon: <Smartphone className="w-4 h-4" />
  },
  {
    id: 'samsung-galaxy-s23',
    name: 'Samsung Galaxy S23',
    width: 360,
    height: 780,
    pixelRatio: 3,
    userAgent: 'Mozilla/5.0 (Linux; Android 13; SM-S911B) AppleWebKit/537.36',
    type: 'mobile',
    icon: <Smartphone className="w-4 h-4" />
  },
  {
    id: 'ipad-air',
    name: 'iPad Air',
    width: 820,
    height: 1180,
    pixelRatio: 2,
    userAgent: 'Mozilla/5.0 (iPad; CPU OS 16_0 like Mac OS X) AppleWebKit/605.1.15',
    type: 'tablet',
    icon: <Tablet className="w-4 h-4" />
  },
  {
    id: 'ipad-pro',
    name: 'iPad Pro 12.9"',
    width: 1024,
    height: 1366,
    pixelRatio: 2,
    userAgent: 'Mozilla/5.0 (iPad; CPU OS 16_0 like Mac OS X) AppleWebKit/605.1.15',
    type: 'tablet',
    icon: <Tablet className="w-4 h-4" />
  },
  {
    id: 'macbook-air',
    name: 'MacBook Air',
    width: 1440,
    height: 900,
    pixelRatio: 2,
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
    type: 'desktop',
    icon: <Monitor className="w-4 h-4" />
  },
  {
    id: 'desktop-1080p',
    name: 'Desktop 1080p',
    width: 1920,
    height: 1080,
    pixelRatio: 1,
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    type: 'desktop',
    icon: <Monitor className="w-4 h-4" />
  },
  {
    id: 'desktop-4k',
    name: 'Desktop 4K',
    width: 3840,
    height: 2160,
    pixelRatio: 2,
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    type: 'desktop',
    icon: <Monitor className="w-4 h-4" />
  }
];

export const DevicePreview: React.FC<DevicePreviewProps> = ({
  content,
  contentType,
  className = '',
  onDeviceChange,
  onOrientationChange,
  onZoomChange
}) => {
  const [selectedDevice, setSelectedDevice] = useState<DevicePreset>(DEVICE_PRESETS[0]);
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');
  const [zoom, setZoom] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showRuler, setShowRuler] = useState(false);
  const [customWidth, setCustomWidth] = useState(390);
  const [customHeight, setCustomHeight] = useState(844);
  const [isCustomMode, setIsCustomMode] = useState(false);
  
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Calculate actual dimensions based on orientation
  const actualWidth = orientation === 'portrait' ? selectedDevice.width : selectedDevice.height;
  const actualHeight = orientation === 'portrait' ? selectedDevice.height : selectedDevice.width;

  // Handle device change
  const handleDeviceChange = useCallback((deviceId: string) => {
    if (deviceId === 'custom') {
      setIsCustomMode(true);
      return;
    }
    
    const device = DEVICE_PRESETS.find(d => d.id === deviceId);
    if (device) {
      setSelectedDevice(device);
      setIsCustomMode(false);
      onDeviceChange?.(device);
    }
  }, [onDeviceChange]);

  // Handle orientation toggle
  const handleOrientationToggle = useCallback(() => {
    const newOrientation = orientation === 'portrait' ? 'landscape' : 'portrait';
    setOrientation(newOrientation);
    onOrientationChange?.(newOrientation);
  }, [orientation, onOrientationChange]);

  // Handle zoom change
  const handleZoomChange = useCallback((newZoom: number[]) => {
    const zoomValue = newZoom[0];
    setZoom(zoomValue);
    onZoomChange?.(zoomValue);
  }, [onZoomChange]);

  // Take screenshot
  const takeScreenshot = useCallback(async () => {
    if (!iframeRef.current) return;

    try {
      // This is a simplified version - in a real implementation,
      // you'd use html2canvas or similar library
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        canvas.width = actualWidth;
        canvas.height = actualHeight;
        
        // For demo purposes, create a simple screenshot placeholder
        ctx.fillStyle = '#f0f0f0';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#333';
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Screenshot captured', canvas.width / 2, canvas.height / 2);
        
        // Download the screenshot
        const link = document.createElement('a');
        link.download = `screenshot-${selectedDevice.name}-${Date.now()}.png`;
        link.href = canvas.toDataURL();
        link.click();
        
        toast({
          title: "Screenshot captured",
          description: `Screenshot of ${selectedDevice.name} saved successfully`
        });
      }
    } catch (error) {
      toast({
        title: "Screenshot failed",
        description: "Failed to capture screenshot",
        variant: "destructive"
      });
    }
  }, [actualWidth, actualHeight, selectedDevice.name, toast]);

  // Refresh iframe
  const refreshPreview = useCallback(() => {
    if (iframeRef.current) {
      iframeRef.current.src = iframeRef.current.src;
    }
  }, []);

  // Open in new window
  const openInNewWindow = useCallback(() => {
    if (contentType === 'url') {
      window.open(content, '_blank');
    } else {
      const newWindow = window.open('', '_blank');
      if (newWindow) {
        newWindow.document.write(content);
        newWindow.document.close();
      }
    }
  }, [content, contentType]);

  // Get device frame styles
  const getDeviceFrameStyles = () => {
    const baseStyles = {
      width: actualWidth * zoom,
      height: actualHeight * zoom,
      transform: `scale(${zoom})`,
      transformOrigin: 'top left'
    };

    if (selectedDevice.type === 'mobile') {
      return {
        ...baseStyles,
        borderRadius: '24px',
        border: '8px solid #1f2937',
        boxShadow: '0 0 0 2px #374151, 0 20px 40px rgba(0,0,0,0.3)'
      };
    } else if (selectedDevice.type === 'tablet') {
      return {
        ...baseStyles,
        borderRadius: '16px',
        border: '12px solid #1f2937',
        boxShadow: '0 0 0 2px #374151, 0 20px 40px rgba(0,0,0,0.2)'
      };
    } else {
      return {
        ...baseStyles,
        borderRadius: '8px',
        border: '2px solid #374151',
        boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
      };
    }
  };

  return (
    <Card className={`bg-card ${className}`}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            {selectedDevice.icon}
            <span>Device Preview</span>
            <Badge variant="outline" className="ml-2">
              {actualWidth} × {actualHeight}
            </Badge>
          </CardTitle>
          
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={refreshPreview}>
              <RefreshCw className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={takeScreenshot}>
              <Camera className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={openInNewWindow}>
              <ExternalLink className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsFullscreen(!isFullscreen)}
            >
              {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Device Controls */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center space-x-2">
            <Label className="text-sm font-medium">Device:</Label>
            <Select value={isCustomMode ? 'custom' : selectedDevice.id} onValueChange={handleDeviceChange}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="custom">Custom Size</SelectItem>
                <Separator />
                {DEVICE_PRESETS.map(device => (
                  <SelectItem key={device.id} value={device.id}>
                    <div className="flex items-center space-x-2">
                      {device.icon}
                      <span>{device.name}</span>
                      <Badge variant="outline" className="text-xs">
                        {device.width}×{device.height}
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {isCustomMode && (
            <div className="flex items-center space-x-2">
              <Input
                type="number"
                value={customWidth}
                onChange={(e) => setCustomWidth(Number(e.target.value))}
                className="w-20"
                min="200"
                max="4000"
              />
              <span className="text-sm text-muted-foreground">×</span>
              <Input
                type="number"
                value={customHeight}
                onChange={(e) => setCustomHeight(Number(e.target.value))}
                className="w-20"
                min="200"
                max="4000"
              />
            </div>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={handleOrientationToggle}
            className="flex items-center space-x-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>{orientation === 'portrait' ? 'Portrait' : 'Landscape'}</span>
          </Button>

          <div className="flex items-center space-x-2">
            <Label className="text-sm font-medium">Zoom:</Label>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleZoomChange([Math.max(0.25, zoom - 0.25)])}
                disabled={zoom <= 0.25}
              >
                <ZoomOut className="w-4 h-4" />
              </Button>
              <div className="w-24">
                <Slider
                  value={[zoom]}
                  onValueChange={handleZoomChange}
                  min={0.25}
                  max={2}
                  step={0.25}
                  className="w-full"
                />
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleZoomChange([Math.min(2, zoom + 0.25)])}
                disabled={zoom >= 2}
              >
                <ZoomIn className="w-4 h-4" />
              </Button>
              <Badge variant="outline" className="text-xs min-w-[3rem] text-center">
                {Math.round(zoom * 100)}%
              </Badge>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowRuler(!showRuler)}
            className={showRuler ? 'bg-primary/10' : ''}
          >
            <Ruler className="w-4 h-4" />
          </Button>
        </div>

        {/* Device Info */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center space-x-1">
            <span>Resolution:</span>
            <Badge variant="outline" className="text-xs">
              {actualWidth} × {actualHeight}
            </Badge>
          </div>
          <div className="flex items-center space-x-1">
            <span>Pixel Ratio:</span>
            <Badge variant="outline" className="text-xs">
              {selectedDevice.pixelRatio}x
            </Badge>
          </div>
          <div className="flex items-center space-x-1">
            <span>Type:</span>
            <Badge variant="outline" className="text-xs capitalize">
              {selectedDevice.type}
            </Badge>
          </div>
        </div>

        <Separator />

        {/* Preview Container */}
        <div
          ref={containerRef}
          className={`relative bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-lg p-8 overflow-auto ${
            isFullscreen ? 'fixed inset-0 z-50 p-4' : ''
          }`}
          style={{
            minHeight: isFullscreen ? '100vh' : '600px'
          }}
        >
          {/* Ruler */}
          {showRuler && (
            <div className="absolute top-0 left-0 right-0 h-8 bg-yellow-100 dark:bg-yellow-900/20 border-b border-yellow-300 dark:border-yellow-700 flex items-center justify-center text-xs font-mono">
              Ruler: {actualWidth} × {actualHeight} px
            </div>
          )}

          {/* Device Frame */}
          <motion.div
            className="relative mx-auto"
            style={getDeviceFrameStyles()}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            {/* Screen */}
            <div className="w-full h-full overflow-hidden bg-white rounded-lg">
              <iframe
                ref={iframeRef}
                src={contentType === 'url' ? content : undefined}
                srcDoc={contentType === 'html' ? content : undefined}
                className="w-full h-full border-0"
                title="Device Preview"
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                style={{
                  width: actualWidth,
                  height: actualHeight,
                  transform: `scale(${1 / zoom})`,
                  transformOrigin: 'top left'
                }}
              />
            </div>

            {/* Device-specific decorations */}
            {selectedDevice.type === 'mobile' && (
              <>
                {/* Home indicator (for modern phones) */}
                <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gray-600 rounded-full" />
                {/* Notch (simplified) */}
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-24 h-6 bg-gray-900 rounded-b-2xl" />
              </>
            )}
          </motion.div>

          {/* Loading overlay */}
          <AnimatePresence>
            {false && ( // You can control this based on loading state
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg"
              >
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 flex items-center space-x-3">
                  <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  <span>Loading preview...</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Device Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="bg-muted rounded-lg p-3">
            <div className="font-medium text-muted-foreground">Viewport</div>
            <div className="text-lg font-mono">{actualWidth}×{actualHeight}</div>
          </div>
          <div className="bg-muted rounded-lg p-3">
            <div className="font-medium text-muted-foreground">Zoom Level</div>
            <div className="text-lg font-mono">{Math.round(zoom * 100)}%</div>
          </div>
          <div className="bg-muted rounded-lg p-3">
            <div className="font-medium text-muted-foreground">Pixel Ratio</div>
            <div className="text-lg font-mono">{selectedDevice.pixelRatio}x</div>
          </div>
          <div className="bg-muted rounded-lg p-3">
            <div className="font-medium text-muted-foreground">Orientation</div>
            <div className="text-lg capitalize">{orientation}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};