import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { IconScoutAsset } from '@/components/ui/iconscout-asset';
import { iconScoutService, type AssetType, type IconScoutAsset as Asset } from '@/services/iconscout';
import { Search, Loader2, RefreshCw, Download, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const DesignAssets: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AssetType>('3d-icons');
  const [searchQuery, setSearchQuery] = useState('');
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    style: '',
    color: '',
    category: '',
  });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { toast } = useToast();

  const fetchAssets = async (resetPage = false) => {
    try {
      setLoading(true);
      setError(null);
      
      const currentPage = resetPage ? 1 : page;
      if (resetPage) setPage(1);

      const response = await iconScoutService.fetchIconScoutAssets({
        type: activeTab,
        query: searchQuery,
        ...filters,
        page: currentPage,
        per_page: 20,
      });

      const assetList = response.icons || response.illustrations || response.animations || [];
      setAssets(assetList);
      setTotalPages(Math.ceil(response.total / 20));

      if (assetList.length === 0 && searchQuery) {
        toast({
          title: 'No results found',
          description: `No ${activeTab.replace('-', ' ')} found for "${searchQuery}"`,
        });
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch assets';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssets(true);
  }, [activeTab]);

  const handleSearch = () => {
    fetchAssets(true);
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({ style: '', color: '', category: '' });
    setSearchQuery('');
  };

  const loadMore = () => {
    if (page < totalPages) {
      setPage(prev => prev + 1);
      fetchAssets();
    }
  };

  const getAssetTypeLabel = (type: AssetType) => {
    switch (type) {
      case '3d-icons':
        return '3D Icons';
      case 'illustrations':
        return 'Illustrations';
      case 'lottie-animations':
        return 'Lottie Animations';
      case 'icons':
        return 'Icons';
      default:
        return type;
    }
  };

  const getAssetComponentType = (type: AssetType): '3d-icon' | 'illustration' | 'lottie-animation' | 'icon' => {
    switch (type) {
      case '3d-icons':
        return '3d-icon';
      case 'illustrations':
        return 'illustration';
      case 'lottie-animations':
        return 'lottie-animation';
      case 'icons':
        return 'icon';
      default:
        return 'icon';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Design Assets</h1>
        <p className="text-muted-foreground">
          Browse and preview 3D icons, illustrations, and Lottie animations from IconScout
        </p>
      </div>

      {/* Search and Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Search & Filters</CardTitle>
          <CardDescription>
            Find the perfect assets for your project
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <div className="flex-1">
              <Input
                placeholder="Search for assets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <Button onClick={handleSearch} disabled={loading}>
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              Search
            </Button>
          </div>

          <div className="flex gap-4">
            <Select value={filters.style} onValueChange={(value) => handleFilterChange('style', value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Style" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Styles</SelectItem>
                <SelectItem value="flat">Flat</SelectItem>
                <SelectItem value="outline">Outline</SelectItem>
                <SelectItem value="filled">Filled</SelectItem>
                <SelectItem value="3d">3D</SelectItem>
                <SelectItem value="gradient">Gradient</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.color} onValueChange={(value) => handleFilterChange('color', value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Color" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Colors</SelectItem>
                <SelectItem value="blue">Blue</SelectItem>
                <SelectItem value="red">Red</SelectItem>
                <SelectItem value="green">Green</SelectItem>
                <SelectItem value="purple">Purple</SelectItem>
                <SelectItem value="orange">Orange</SelectItem>
                <SelectItem value="black">Black</SelectItem>
                <SelectItem value="white">White</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.category} onValueChange={(value) => handleFilterChange('category', value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Categories</SelectItem>
                <SelectItem value="business">Business</SelectItem>
                <SelectItem value="technology">Technology</SelectItem>
                <SelectItem value="education">Education</SelectItem>
                <SelectItem value="medical">Medical</SelectItem>
                <SelectItem value="social">Social</SelectItem>
                <SelectItem value="finance">Finance</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" onClick={clearFilters}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Clear
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Asset Type Tabs */}
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as AssetType)} className="mb-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="3d-icons">3D Icons</TabsTrigger>
          <TabsTrigger value="icons">Icons</TabsTrigger>
          <TabsTrigger value="illustrations">Illustrations</TabsTrigger>
          <TabsTrigger value="lottie-animations">Animations</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {error && (
            <Card className="mb-6">
              <CardContent className="pt-6">
                <div className="text-center text-red-600">
                  <p>{error}</p>
                  <Button variant="outline" onClick={() => fetchAssets(true)} className="mt-2">
                    Try Again
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {loading && assets.length === 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {Array.from({ length: 12 }).map((_, i) => (
                <Card key={i} className="aspect-square">
                  <CardContent className="p-4 h-full">
                    <div className="w-full h-full bg-muted rounded-md animate-pulse" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {assets.map((asset) => (
                  <Card key={asset.id} className="group hover:shadow-lg transition-shadow">
                    <CardContent className="p-4">
                      <div className="aspect-square mb-3">
                        <IconScoutAsset
                          id={asset.id}
                          name={asset.name}
                          url={asset.preview_url || asset.url}
                          alt={asset.name}
                          type={getAssetComponentType(activeTab)}
                          className="w-full h-full"
                          autoPlay={activeTab === 'lottie-animations'}
                          loop={activeTab === 'lottie-animations'}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <h3 className="font-medium text-sm truncate" title={asset.name}>
                          {asset.name}
                        </h3>
                        
                        <div className="flex flex-wrap gap-1">
                          {asset.style && (
                            <Badge variant="secondary" className="text-xs">
                              {asset.style}
                            </Badge>
                          )}
                          {asset.is_premium && (
                            <Badge variant="default" className="text-xs">
                              Premium
                            </Badge>
                          )}
                        </div>

                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button size="sm" variant="outline" className="flex-1">
                            <Eye className="w-3 h-3 mr-1" />
                            View
                          </Button>
                          <Button size="sm" variant="outline" className="flex-1">
                            <Download className="w-3 h-3 mr-1" />
                            Use
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {assets.length > 0 && page < totalPages && (
                <div className="text-center mt-8">
                  <Button onClick={loadMore} disabled={loading}>
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : null}
                    Load More
                  </Button>
                </div>
              )}

              {assets.length === 0 && !loading && !error && (
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center text-muted-foreground">
                      <p>No {getAssetTypeLabel(activeTab).toLowerCase()} found.</p>
                      <p className="text-sm mt-1">Try adjusting your search or filters.</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </TabsContent>
      </Tabs>

      {/* API Status */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">API Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full" />
            <span className="text-sm">IconScout API Connected</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Cache: {iconScoutService.getCacheStats().size} entries
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default DesignAssets;