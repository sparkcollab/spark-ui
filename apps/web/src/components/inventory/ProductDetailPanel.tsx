
import React from 'react';
import { X, Package, DollarSign, Calendar, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

interface Product {
  id: string;
  name: string;
  sku: string;
  categoryName: string;
  subCategoryName: string;
  currentStock: number;
  unitOfMeasure: string;
  sellingPrice: number;
}

interface ProductDetailPanelProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

const ProductDetailPanel = ({ product, isOpen, onClose }: ProductDetailPanelProps) => {
  if (!isOpen || !product) return null;

  // Sample lot data for the selected product
  const associatedLots = [
    {
      id: '1',
      lotNumber: 'LOT-2024-001',
      quantity: 75,
      costPrice: 2.50,
      receivedDate: '2024-01-15',
      expiryDate: '2024-02-15',
      supplier: 'Fresh Farm Co.',
      status: 'normal'
    },
    {
      id: '2',
      lotNumber: 'LOT-2024-002',
      quantity: 12,
      costPrice: 2.50,
      receivedDate: '2024-01-10',
      expiryDate: '2024-02-10',
      supplier: 'Fresh Farm Co.',
      status: 'low-stock'
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'low-stock':
        return <Badge variant="destructive">Low Stock</Badge>;
      case 'near-expiry':
        return <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-200">Near Expiry</Badge>;
      case 'expired':
        return <Badge variant="destructive">Expired</Badge>;
      default:
        return <Badge variant="secondary">Normal</Badge>;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
      <div className="bg-white dark:bg-gray-800 w-full max-w-2xl h-full overflow-y-auto">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{product.name}</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">{product.categoryName} {`>`} {product.subCategoryName}</p>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Product Info Cards */}
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Current Stock</CardTitle>
                <Package className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{product.currentStock}</div>
                <p className="text-xs text-muted-foreground">{product.unitOfMeasure}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Selling Price</CardTitle>
                <DollarSign className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${product.sellingPrice.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">per {product.unitOfMeasure}</p>
              </CardContent>
            </Card>
          </div>

          {/* Product Details */}
          <Card>
            <CardHeader>
              <CardTitle>Product Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">SKU</label>
                  <p className="text-sm font-medium">{product.sku}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Unit of Measure</label>
                  <p className="text-sm font-medium">{product.unitOfMeasure}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Associated Lots */}
          <Card>
            <CardHeader>
              <CardTitle>Associated Lots</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Lot Number</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Cost Price</TableHead>
                    <TableHead>Received</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {associatedLots.map((lot) => (
                    <TableRow key={lot.id}>
                      <TableCell className="font-medium">{lot.lotNumber}</TableCell>
                      <TableCell>{lot.quantity}</TableCell>
                      <TableCell>${lot.costPrice.toFixed(2)}</TableCell>
                      <TableCell>{lot.receivedDate}</TableCell>
                      <TableCell>{getStatusBadge(lot.status)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-2">
            <Button className="flex-1">Edit Product</Button>
            <Button variant="outline" className="flex-1">View History</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPanel;