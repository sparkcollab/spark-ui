
import React from 'react';
import { Package, Calendar, User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

interface AdjustmentsTabProps {
  selectedProduct: string;
  searchTerm: string;
}

const AdjustmentsTab = ({ selectedProduct, searchTerm }: AdjustmentsTabProps) => {
  // Sample data
  const adjustments = [
    {
      id: '1',
      date: '2024-01-20',
      productId: '1',
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
      productId: '2',
      productName: 'Ambrosia Apples',
      lotNumber: 'LOT-2024-003',
      adjustmentType: 'remove',
      quantity: 10,
      reason: 'Spoiled due to damage',
      performedBy: 'Mike Chen',
      reference: ''
    },
    {
      id: '3',
      date: '2024-01-18',
      productId: '3',
      productName: 'Orange Carrots',
      lotNumber: 'LOT-2024-004',
      adjustmentType: 'add',
      quantity: 5,
      reason: 'Count correction after audit',
      performedBy: 'Sarah Johnson',
      reference: 'ADJ-2024-001'
    }
  ];

  const filteredAdjustments = adjustments.filter(adjustment => {
    const matchesSearch = 
      adjustment.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      adjustment.lotNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      adjustment.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
      adjustment.performedBy.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesProductFilter = selectedProduct === 'all' || adjustment.productId === selectedProduct;
    
    return matchesSearch && matchesProductFilter;
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

  return (
    <div className="space-y-6">
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
    </div>
  );
};

export default AdjustmentsTab;