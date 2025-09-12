import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { 
  Smartphone, 
  Tablet, 
  Monitor, 
  RotateCcw, 
  ZoomIn, 
  ZoomOut, 
  Download,
  Maximize2
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface DevicePreset {
  name: string;
  width: number;
  height: number;
  icon: React.ReactNode;
  category: 'mobile' | 'tablet' | 'desktop';
}

interface DevicePreviewProps {
  content: string;
  contentType: 'html' | 'react' | 'url';
  onDeviceChange?: (device: DevicePreset) => void;
  onOrientationChange?: (orientation: 'portrait' | 'landscape') => void;
  className?: string;
}

const devicePresets: DevicePreset[] = [
  {
    name: 'iPhone 14',
    width: 390,
    height: 844,
    icon: <Smartphone className="h-3 w-3" />,
    category: 'mobile'
  },
  {
    name: 'iPhone 14 Plus',
    width: 428,
    height: 926,
    icon: <Smartphone className="h-3 w-3" />,
    category: 'mobile'
  },
  {
    name: 'Galaxy S23',
    width: 360,
    height: 780,
    icon: <Smartphone className="h-3 w-3" />,
    category: 'mobile'
  },
  {
    name: 'iPad Air',
    width: 820,
    height: 1180,
    icon: <Tablet className="h-3 w-3" />,
    category: 'tablet'
  },
  {
    name: 'iPad Pro',
    width: 1024,
    height: 1366,
    icon: <Tablet className="h-3 w-3" />,
    category: 'tablet'
  },
  {
    name: 'MacBook Air',
    width: 1280,
    height: 832,
    icon: <Monitor className="h-3 w-3" />,
    category: 'desktop'
  },
  {
    name: 'Desktop 1080p',
    width: 1920,
    height: 1080,
    icon: <Monitor className="h-3 w-3" />,
    category: 'desktop'
  }
];

export const DevicePreview: React.FC<DevicePreviewProps> = ({
  content,
  contentType,
  onDeviceChange,
  onOrientationChange,
  className
}) => {
  const [selectedDevice, setSelectedDevice] = useState(devicePresets[0]);
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');
  const [zoom, setZoom] = useState([75]);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleDeviceChange = (deviceName: string) => {
    const device = devicePresets.find(d => d.name === deviceName);
    if (device) {
      setSelectedDevice(device);
      onDeviceChange?.(device);
    }
  };

  const toggleOrientation = () => {
    const newOrientation = orientation === 'portrait' ? 'landscape' : 'portrait';
    setOrientation(newOrientation);
    onOrientationChange?.(newOrientation);
  };

  const handleZoomIn = () => {
    setZoom([Math.min(zoom[0] + 25, 200)]);
  };

  const handleZoomOut = () => {
    setZoom([Math.max(zoom[0] - 25, 25)]);
  };

  const takeScreenshot = () => {
    // In a real implementation, you'd capture the iframe content
    console.log('Taking screenshot...');
  };

  const getDeviceFrameStyle = () => {
    const baseWidth = orientation === 'portrait' ? selectedDevice.width : selectedDevice.height;
    const baseHeight = orientation === 'portrait' ? selectedDevice.height : selectedDevice.width;
    
    const scaledWidth = (baseWidth * zoom[0]) / 100;
    const scaledHeight = (baseHeight * zoom[0]) / 100;

    return {
      width: scaledWidth,
      height: scaledHeight
    };
  };

  const renderDeviceFrame = () => {
    const style = getDeviceFrameStyle();
    
    if (selectedDevice.category === 'mobile') {
      return (
        <div 
          className="relative bg-gray-900 rounded-[2rem] p-2 shadow-2xl"
          style={{ 
            width: style.width + 16, 
            height: style.height + 16 
          }}
        >
          {/* Phone bezel */}
          <div className="absolute top-6 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-gray-700 rounded-full" />
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-gray-800 rounded-full" />
          
          <div 
            className="bg-white rounded-[1.5rem] overflow-hidden"
            style={style}
          >
            {renderContent()}
          </div>
        </div>
      );
    } else if (selectedDevice.category === 'tablet') {
      return (
        <div 
          className="relative bg-gray-900 rounded-xl p-4 shadow-2xl"
          style={{ 
            width: style.width + 32, 
            height: style.height + 32 
          }}
        >
          <div 
            className="bg-white rounded-lg overflow-hidden"
            style={style}
          >
            {renderContent()}
          </div>
        </div>
      );
    } else {
      return (
        <div 
          className="relative bg-gray-800 rounded-lg shadow-2xl overflow-hidden"
          style={style}
        >
          {/* Desktop top bar */}
          <div className="h-6 bg-gray-700 flex items-center px-3 gap-1.5">
            <div className="w-3 h-3 bg-red-500 rounded-full" />
            <div className="w-3 h-3 bg-yellow-500 rounded-full" />
            <div className="w-3 h-3 bg-green-500 rounded-full" />
          </div>
          
          <div 
            className="bg-white"
            style={{ 
              width: style.width, 
              height: style.height - 24 
            }}
          >
            {renderContent()}
          </div>
        </div>
      );
    }
  };

  const renderContent = () => {
    if (contentType === 'html') {
      return (
        <iframe
          srcDoc={content}
          className="w-full h-full border-none"
          sandbox="allow-scripts allow-same-origin"
        />
      );
    } else if (contentType === 'url') {
      return (
        <iframe
          src={content}
          className="w-full h-full border-none"
          sandbox="allow-scripts allow-same-origin"
        />
      );
    } else {
      return (
        <div className="w-full h-full flex items-center justify-center bg-gray-100">
          <div className="text-center text-gray-500">
            <p className="text-sm">React Preview</p>
            <p className="text-xs">Component content would render here</p>
          </div>
        </div>
      );
    }
  };

  if (isFullscreen) {
    return (
      <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
        <div className="absolute top-4 right-4 z-10">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setIsFullscreen(false)}
          >
            Exit Fullscreen
          </Button>
        </div>
        <div className="w-full h-full flex items-center justify-center p-4">
          {renderDeviceFrame()}
        </div>
      </div>
    );
  }

  return (
    <Card className={cn('h-full flex flex-col', className)}>
      <CardHeader className="pb-3 flex-shrink-0">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm">Device Preview</CardTitle>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={takeScreenshot}
              className="h-8 w-8 p-0"
            >
              <Download className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsFullscreen(true)}
              className="h-8 w-8 p-0"
            >
              <Maximize2 className="h-3 w-3" />
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <label className="text-xs font-medium">Device:</label>
            <Select value={selectedDevice.name} onValueChange={handleDeviceChange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {devicePresets.map((device) => (
                  <SelectItem key={device.name} value={device.name}>
                    <div className="flex items-center gap-2">
                      {device.icon}
                      {device.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={toggleOrientation}
            className="h-8 px-2"
          >
            <RotateCcw className="h-3 w-3 mr-1" />
            {orientation}
          </Button>

          <Separator orientation="vertical" className="h-4" />

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleZoomOut}
              className="h-8 w-8 p-0"
            >
              <ZoomOut className="h-3 w-3" />
            </Button>
            
            <div className="w-16">
              <Slider
                value={zoom}
                onValueChange={setZoom}
                max={200}
                min={25}
                step={25}
                className="w-full"
              />
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleZoomIn}
              className="h-8 w-8 p-0"
            >
              <ZoomIn className="h-3 w-3" />
            </Button>
            
            <Badge variant="secondary" className="text-xs">
              {zoom[0]}%
            </Badge>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span>
            {orientation === 'portrait' ? selectedDevice.width : selectedDevice.height} × 
            {orientation === 'portrait' ? selectedDevice.height : selectedDevice.width}
          </span>
          <Badge variant="outline" className="text-xs">
            {selectedDevice.category}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex items-center justify-center p-4 bg-gradient-to-br from-gray-50 to-gray-100 overflow-auto">
        {renderDeviceFrame()}
      </CardContent>
    </Card>
  );
};