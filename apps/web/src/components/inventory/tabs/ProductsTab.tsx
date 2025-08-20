
import React from 'react';
import { Package, DollarSign, BarChart3 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';

interface ProductsTabProps {
  selectedProduct: string;
  searchTerm: string;
  onProductSelect: (productId: string) => void;
}

const ProductsTab = ({ selectedProduct, searchTerm, onProductSelect }: ProductsTabProps) => {
  // Sample data
  const products = [
    {
      id: '1',
      name: 'Gala Apples',
      sku: 'APPLE-GALA-001',
      categoryName: 'Fruits',
      subCategoryName: 'Apples',
      currentStock: 150,
      unitOfMeasure: 'lbs',
      sellingPrice: 3.99
    },
    {
      id: '2',
      name: 'Ambrosia Apples',
      sku: 'APPLE-AMB-001',
      categoryName: 'Fruits',
      subCategoryName: 'Apples',
      currentStock: 89,
      unitOfMeasure: 'lbs',
      sellingPrice: 4.49
    },
    {
      id: '3',
      name: 'Orange Carrots',
      sku: 'CARR-ORG-001',
      categoryName: 'Vegetables',
      subCategoryName: 'Carrots',
      currentStock: 67,
      unitOfMeasure: 'lbs',
      sellingPrice: 2.99
    },
    {
      id: '4',
      name: 'Whole Milk 3.25%',
      sku: 'MILK-WHL-001',
      categoryName: 'Dairy',
      subCategoryName: 'Milk',
      currentStock: 24,
      unitOfMeasure: 'gallons',
      sellingPrice: 4.99
    }
  ];

  const filteredProducts = products.filter(product => {
    const matchesSearch = 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.categoryName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesProductFilter = selectedProduct === 'all' || product.id === selectedProduct;
    
    return matchesSearch && matchesProductFilter;
  });

  const totalProducts = products.length;
  const totalStockValue = products.reduce((sum, product) => 
    sum + (product.currentStock * product.sellingPrice), 0);
  const lowStockCount = products.filter(product => product.currentStock < 30).length;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProducts}</div>
            <p className="text-xs text-muted-foreground">Active products</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stock Value</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalStockValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Current inventory value</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
            <BarChart3 className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{lowStockCount}</div>
            <p className="text-xs text-muted-foreground">Items below 30 units</p>
          </CardContent>
        </Card>
      </div>

      {/* Products Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Current Stock</TableHead>
                <TableHead>Unit</TableHead>
                <TableHead>Selling Price</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow 
                  key={product.id} 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => onProductSelect(product.id)}
                >
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell className="text-muted-foreground">{product.sku}</TableCell>
                  <TableCell>{product.categoryName} {`>`} {product.subCategoryName}</TableCell>
                  <TableCell>
                    <span className={`font-medium ${product.currentStock < 30 ? 'text-orange-600' : 'text-foreground'}`}>
                      {product.currentStock}
                    </span>
                  </TableCell>
                  <TableCell>{product.unitOfMeasure}</TableCell>
                  <TableCell>${product.sellingPrice.toFixed(2)}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onProductSelect(product.id);
                      }}
                    >
                      View Lots
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductsTab;
