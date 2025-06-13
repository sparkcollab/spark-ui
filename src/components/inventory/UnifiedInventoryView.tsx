
import React, { useState } from 'react';
import { Plus, Search, Package, BarChart3, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ProductsTab from './tabs/ProductsTab';
import LotsTab from './tabs/LotsTab';
import AdjustmentsTab from './tabs/AdjustmentsTab';
import InventoryDrawer from './InventoryDrawer';

const UnifiedInventoryView = () => {
  const [selectedProduct, setSelectedProduct] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerAction, setDrawerAction] = useState<'add-product' | 'receive-lot' | 'record-adjustment'>('add-product');

  // Sample product data for filter
  const products = [
    { id: '1', name: 'Gala Apples', category: 'Fruits > Apples' },
    { id: '2', name: 'Ambrosia Apples', category: 'Fruits > Apples' },
    { id: '3', name: 'Orange Carrots', category: 'Vegetables > Carrots' },
    { id: '4', name: 'Whole Milk 3.25%', category: 'Dairy > Milk' },
  ];

  const handleQuickAction = (action: 'add-product' | 'receive-lot' | 'record-adjustment') => {
    setDrawerAction(action);
    setDrawerOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Inventory Management</h1>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => handleQuickAction('add-product')}
            className="flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </Button>
          <Button 
            variant="outline"
            onClick={() => handleQuickAction('receive-lot')}
            className="flex items-center space-x-2"
          >
            <Package className="w-4 h-4" />
            <span>Receive Lot</span>
          </Button>
          <Button 
            onClick={() => handleQuickAction('record-adjustment')}
            className="flex items-center space-x-2"
          >
            <BarChart3 className="w-4 h-4" />
            <span>Record Adjustment</span>
          </Button>
        </div>
      </div>

      {/* Global Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex gap-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search products, lots, or adjustments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                <SelectTrigger className="w-64">
                  <SelectValue placeholder="Filter by product" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Products</SelectItem>
                  {products.map(product => (
                    <SelectItem key={product.id} value={product.id}>
                      {product.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabbed Content */}
      <Tabs defaultValue="products" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="products" className="flex items-center space-x-2">
            <Package className="w-4 h-4" />
            <span>Products</span>
          </TabsTrigger>
          <TabsTrigger value="lots" className="flex items-center space-x-2">
            <BarChart3 className="w-4 h-4" />
            <span>Lots</span>
          </TabsTrigger>
          <TabsTrigger value="adjustments" className="flex items-center space-x-2">
            <Calendar className="w-4 h-4" />
            <span>Adjustments</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="products" className="space-y-4">
          <ProductsTab 
            selectedProduct={selectedProduct}
            searchTerm={searchTerm}
            onProductSelect={setSelectedProduct}
          />
        </TabsContent>

        <TabsContent value="lots" className="space-y-4">
          <LotsTab 
            selectedProduct={selectedProduct}
            searchTerm={searchTerm}
          />
        </TabsContent>

        <TabsContent value="adjustments" className="space-y-4">
          <AdjustmentsTab 
            selectedProduct={selectedProduct}
            searchTerm={searchTerm}
          />
        </TabsContent>
      </Tabs>

      {/* Drawer for Quick Actions */}
      <InventoryDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        action={drawerAction}
      />
    </div>
  );
};

export default UnifiedInventoryView;