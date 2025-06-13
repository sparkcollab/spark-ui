import React, { useState } from 'react';
import { Search, Plus, Package, DollarSign, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import SummaryCard from '../SummaryCard';
import ProductDetailPanel from './ProductDetailPanel';

interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  subcategory: string;
  stock: number;
  unitOfMeasure: string;
  sellingPrice: number;
  lowStockThreshold: number;
  categoryName: string;
  subCategoryName: string;
  currentStock: number;
}

const ProductsView = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const products: Product[] = [
    {
      id: '1',
      name: 'Gala Apples',
      sku: 'APP-GALA-001',
      category: 'Fruits',
      subcategory: 'Apples',
      categoryName: 'Fruits',
      subCategoryName: 'Apples',
      stock: 45,
      currentStock: 45,
      unitOfMeasure: 'lbs',
      sellingPrice: 3.99,
      lowStockThreshold: 10
    },
    {
      id: '2',
      name: 'Organic Bananas',
      sku: 'BAN-ORG-001',
      category: 'Fruits',
      subcategory: 'Bananas',
      categoryName: 'Fruits',
      subCategoryName: 'Bananas',
      stock: 25,
      currentStock: 25,
      unitOfMeasure: 'lbs',
      sellingPrice: 2.49,
      lowStockThreshold: 15
    },
    {
      id: '3',
      name: 'Roma Tomatoes',
      sku: 'TOM-ROMA-001',
      category: 'Vegetables',
      subcategory: 'Tomatoes',
      categoryName: 'Vegetables',
      subCategoryName: 'Tomatoes',
      stock: 8,
      currentStock: 8,
      unitOfMeasure: 'lbs',
      sellingPrice: 4.99,
      lowStockThreshold: 10
    }
  ];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const totalProducts = products.length;
  const stockValue = products.reduce((sum, product) => sum + (product.stock * product.sellingPrice), 0);
  const lowStockItems = products.filter(product => product.stock <= product.lowStockThreshold).length;

  const categories = [...new Set(products.map(p => p.category))];

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SummaryCard
          title="Total Products"
          value={totalProducts}
          icon={Package}
          description="Active products in inventory"
          color="blue"
        />
        <SummaryCard
          title="Stock Value"
          value={`$${stockValue.toLocaleString()}`}
          icon={DollarSign}
          description="Total inventory value"
          color="green"
        />
        <SummaryCard
          title="Low Stock Items"
          value={lowStockItems}
          icon={AlertTriangle}
          description="Products below threshold"
          color="orange"
        />
      </div>

      {/* Filters and Actions */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-3 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search products or SKU..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(category => (
                <SelectItem key={category} value={category}>{category}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button className="flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>Add Product</span>
        </Button>
      </div>

      {/* Products Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  SKU
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Unit Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredProducts.map((product) => (
                <tr 
                  key={product.id} 
                  className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                  onClick={() => setSelectedProduct(product)}
                >
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {product.name}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-300">
                        {product.category} &gt; {product.subcategory}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-300">
                    {product.sku}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-300">
                    {product.category}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-300">
                    {product.stock} {product.unitOfMeasure}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-300">
                    ${product.sellingPrice.toFixed(2)}
                  </td>
                  <td className="px-6 py-4">
                    {product.stock <= product.lowStockThreshold ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                        Low Stock
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                        In Stock
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Product Detail Panel */}
      <ProductDetailPanel 
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </div>
  );
};

export default ProductsView;
