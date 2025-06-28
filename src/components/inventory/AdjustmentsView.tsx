
import React, { useState } from 'react';
import { Plus, Search, Calendar, User, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import NewAdjustmentModal from './NewAdjustmentModal';

interface Adjustment {
  id: string;
  date: string;
  productName: string;
  lotNumber: string;
  adjustmentType: 'add' | 'remove';
  quantity: number;
  reason: string;
  performedBy: string;
  reference?: string;
}

const AdjustmentsView = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [isNewAdjustmentModalOpen, setIsNewAdjustmentModalOpen] = useState(false);

  // Sample data
  const adjustments: Adjustment[] = [
    {
      id: '1',
      date: '2024-01-20',
      productName: 'Gala Apples',
      lotNumber: 'LOT-2024-001',
      adjustmentType: 'remove',
      quantity: 25,
      reason: 'Donated to food bank',
      performedBy: 'Sarah Johnson',
      reference: 'DON-2024-001'
    },
    {
      id: '2',
      date: '2024-01-19',
      productName: 'Ambrosia Apples',
      lotNumber: 'LOT-2024-003',
      adjustmentType: 'remove',
      quantity: 10,
      reason: 'Spoiled due to damage',
      performedBy: 'Mike Chen'
    },
    {
      id: '3',
      date: '2024-01-18',
      productName: 'Orange Carrots',
      lotNumber: 'LOT-2024-004',
      adjustmentType: 'add',
      quantity: 5,
      reason: 'Count correction after audit',
      performedBy: 'Sarah Johnson',
      reference: 'ADJ-2024-001'
    },
    {
      id: '4',
      date: '2024-01-17',
      productName: 'Gala Apples',
      lotNumber: 'LOT-2024-002',
      adjustmentType: 'remove',
      quantity: 8,
      reason: 'Theft reported',
      performedBy: 'Mike Chen',
      reference: 'SEC-2024-001'
    },
    {
      id: '5',
      date: '2024-01-16',
      productName: 'Whole Milk 3.25%',
      lotNumber: 'LOT-2024-005',
      adjustmentType: 'remove',
      quantity: 12,
      reason: 'Customer return - damaged packaging',
      performedBy: 'Sarah Johnson',
      reference: 'RET-2024-003'
    }
  ];

  const filteredAdjustments = adjustments.filter(adjustment => {
    const matchesSearch = 
      adjustment.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      adjustment.lotNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      adjustment.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
      adjustment.performedBy.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = typeFilter === 'all' || adjustment.adjustmentType === typeFilter;
    
    return matchesSearch && matchesType;
  });

  const getAdjustmentTypeBadge = (type: string) => {
    switch (type) {
      case 'add':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Add</Badge>;
      case 'remove':
        return <Badge variant="destructive">Remove</Badge>;
      default:
        return <Badge variant="secondary">{type}</Badge>;
    }
  };

  const totalAdjustments = adjustments.length;
  const thisMonthAdjustments = adjustments.filter(adj => 
    new Date(adj.date).getMonth() === new Date().getMonth()).length;
  const totalQuantityAdjusted = adjustments.reduce((sum, adj) => 
    sum + (adj.adjustmentType === 'add' ? adj.quantity : -adj.quantity), 0);

  const handleNewAdjustment = (adjustmentData: any) => {
    console.log('New adjustment:', adjustmentData);
    // Here you would typically save to your data source
    setIsNewAdjustmentModalOpen(false);
  };

  return (
    <>
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Adjustments</h1>
        <Button 
          onClick={() => setIsNewAdjustmentModalOpen(true)}
          className="flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>New Adjustment</span>
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Adjustments</CardTitle>
            <Package className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAdjustments}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <Calendar className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{thisMonthAdjustments}</div>
            <p className="text-xs text-muted-foreground">Adjustments made</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Change</CardTitle>
            <User className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${totalQuantityAdjusted >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {totalQuantityAdjusted >= 0 ? '+' : ''}{totalQuantityAdjusted}
            </div>
            <p className="text-xs text-muted-foreground">Units adjusted</p>
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
                  placeholder="Search adjustments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="add">Add</SelectItem>
                  <SelectItem value="remove">Remove</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Adjustments Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Lot</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Performed By</TableHead>
                <TableHead>Reference</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAdjustments.map((adjustment) => (
                <TableRow key={adjustment.id}>
                  <TableCell className="font-medium">{adjustment.date}</TableCell>
                  <TableCell>{adjustment.productName}</TableCell>
                  <TableCell className="text-muted-foreground">{adjustment.lotNumber}</TableCell>
                  <TableCell>{getAdjustmentTypeBadge(adjustment.adjustmentType)}</TableCell>
                  <TableCell>
                    <span className={`font-medium ${adjustment.adjustmentType === 'add' ? 'text-green-600' : 'text-red-600'}`}>
                      {adjustment.adjustmentType === 'add' ? '+' : '-'}{adjustment.quantity}
                    </span>
                  </TableCell>
                  <TableCell className="max-w-xs truncate">{adjustment.reason}</TableCell>
                  <TableCell>{adjustment.performedBy}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {adjustment.reference || 'N/A'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <NewAdjustmentModal
        isOpen={isNewAdjustmentModalOpen}
        onClose={() => setIsNewAdjustmentModalOpen(false)}
        onSave={handleNewAdjustment}
      />
    </>
  );
};

export default AdjustmentsView;