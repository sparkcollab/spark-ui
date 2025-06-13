
import React, { useState } from 'react';
import { Plus, Search, Package, AlertTriangle, Calendar, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

interface Lot {
  id: string;
  lotNumber: string;
  productName: string;
  categoryName: string;
  quantity: number;
  costPrice: number;
  receivedDate: string;
  expiryDate?: string;
  supplier?: string;
  status: 'normal' | 'low-stock' | 'near-expiry' | 'expired';
}

const LotsView = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Sample data
  const lots: Lot[] = [
    {
      id: '1',
      lotNumber: 'LOT-2024-001',
      productName: 'Gala Apples',
      categoryName: 'Fruits > Apples',
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
      productName: 'Gala Apples',
      categoryName: 'Fruits > Apples',
      quantity: 12,
      costPrice: 2.50,
      receivedDate: '2024-01-10',
      expiryDate: '2024-02-10',
      supplier: 'Fresh Farm Co.',
      status: 'low-stock'
    },
    {
      id: '3',
      lotNumber: 'LOT-2024-003',
      productName: 'Ambrosia Apples',
      categoryName: 'Fruits > Apples',
      quantity: 89,
      costPrice: 3.00,
      receivedDate: '2024-01-16',
      expiryDate: '2024-02-20',
      supplier: 'Orchard Direct',
      status: 'near-expiry'
    },
    {
      id: '4',
      lotNumber: 'LOT-2024-004',
      productName: 'Orange Carrots',
      categoryName: 'Vegetables > Carrots',
      quantity: 67,
      costPrice: 1.25,
      receivedDate: '2024-01-14',
      expiryDate: '2024-03-14',
      supplier: 'Garden Fresh',
      status: 'normal'
    },
    {
      id: '5',
      lotNumber: 'LOT-2023-045',
      productName: 'Whole Milk 3.25%',
      categoryName: 'Dairy > Milk',
      quantity: 0,
      costPrice: 3.50,
      receivedDate: '2023-12-20',
      expiryDate: '2024-01-05',
      supplier: 'Dairy Fresh',
      status: 'expired'
    }
  ];

  const filteredLots = lots.filter(lot => {
    const matchesSearch = 
      lot.lotNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lot.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lot.supplier?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || lot.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

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

  const getDaysToExpiry = (expiryDate?: string) => {
    if (!expiryDate) return null;
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const totalLots = lots.length;
  const activeLots = lots.filter(lot => lot.quantity > 0 && lot.status !== 'expired').length;
  const alertLots = lots.filter(lot => lot.status === 'low-stock' || lot.status === 'near-expiry' || lot.status === 'expired').length;

  return (
    <>
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Lots</h1>
        <Button className="flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>Receive New Lot</span>
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Lots</CardTitle>
            <Package className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalLots}</div>
            <p className="text-xs text-muted-foreground">All inventory lots</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Lots</CardTitle>
            <Truck className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeLots}</div>
            <p className="text-xs text-muted-foreground">Lots with stock</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{alertLots}</div>
            <p className="text-xs text-muted-foreground">Need attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex gap-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search lots..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="low-stock">Low Stock</SelectItem>
                  <SelectItem value="near-expiry">Near Expiry</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lots Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Lot ID</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Cost Price</TableHead>
                <TableHead>Received Date</TableHead>
                <TableHead>Expiry</TableHead>
                <TableHead>Supplier</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLots.map((lot) => {
                const daysToExpiry = getDaysToExpiry(lot.expiryDate);
                
                return (
                  <TableRow key={lot.id}>
                    <TableCell className="font-medium">{lot.lotNumber}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{lot.productName}</div>
                        <div className="text-sm text-muted-foreground">{lot.categoryName}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={`font-medium ${lot.quantity < 20 ? 'text-orange-600' : 'text-foreground'}`}>
                        {lot.quantity}
                      </span>
                    </TableCell>
                    <TableCell>${lot.costPrice.toFixed(2)}</TableCell>
                    <TableCell>{lot.receivedDate}</TableCell>
                    <TableCell>
                      {lot.expiryDate ? (
                        <div>
                          <div className="text-sm">{lot.expiryDate}</div>
                          {daysToExpiry !== null && (
                            <div className={`text-xs ${daysToExpiry <= 7 ? 'text-orange-600' : daysToExpiry <= 0 ? 'text-red-600' : 'text-muted-foreground'}`}>
                              {daysToExpiry <= 0 ? 'Expired' : `${daysToExpiry} days`}
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">N/A</span>
                      )}
                    </TableCell>
                    <TableCell>{lot.supplier || 'N/A'}</TableCell>
                    <TableCell>{getStatusBadge(lot.status)}</TableCell>
                    <TableCell>
                      <Select>
                        <SelectTrigger className="w-32">
                          <SelectValue placeholder="Actions" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="adjust">Adjust Qty</SelectItem>
                          <SelectItem value="donate">Mark Donated</SelectItem>
                          <SelectItem value="return">Mark Returned</SelectItem>
                          <SelectItem value="stolen">Mark Stolen</SelectItem>
                          <SelectItem value="spoiled">Mark Spoiled</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
};

export default LotsView;