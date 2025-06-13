
import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

interface NewAdjustmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
}

const NewAdjustmentModal = ({ isOpen, onClose, onSave }: NewAdjustmentModalProps) => {
  const [formData, setFormData] = useState({
    productId: '',
    lotId: '',
    adjustmentType: '',
    quantity: '',
    reason: '',
    reference: ''
  });

  // Sample data - in real app this would come from your data source
  const products = [
    { id: '1', name: 'Gala Apples', lots: [
      { id: '1', lotNumber: 'LOT-2024-001', quantity: 75 },
      { id: '2', lotNumber: 'LOT-2024-002', quantity: 12 }
    ]},
    { id: '2', name: 'Ambrosia Apples', lots: [
      { id: '3', lotNumber: 'LOT-2024-003', quantity: 89 }
    ]},
    { id: '3', name: 'Orange Carrots', lots: [
      { id: '4', lotNumber: 'LOT-2024-004', quantity: 67 }
    ]}
  ];

  const selectedProduct = products.find(p => p.id === formData.productId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      date: new Date().toISOString().split('T')[0],
      performedBy: 'Current User' // In real app, get from auth context
    });
    setFormData({
      productId: '',
      lotId: '',
      adjustmentType: '',
      quantity: '',
      reason: '',
      reference: ''
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
      // Reset lot selection when product changes
      ...(field === 'productId' ? { lotId: '' } : {})
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>New Inventory Adjustment</CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="product">Product</Label>
              <Select 
                value={formData.productId} 
                onValueChange={(value) => handleInputChange('productId', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select product" />
                </SelectTrigger>
                <SelectContent>
                  {products.map(product => (
                    <SelectItem key={product.id} value={product.id}>
                      {product.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="lot">Lot</Label>
              <Select 
                value={formData.lotId} 
                onValueChange={(value) => handleInputChange('lotId', value)}
                disabled={!formData.productId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select lot" />
                </SelectTrigger>
                <SelectContent>
                  {selectedProduct?.lots.map(lot => (
                    <SelectItem key={lot.id} value={lot.id}>
                      {lot.lotNumber} (Current: {lot.quantity})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="adjustmentType">Adjustment Type</Label>
              <Select 
                value={formData.adjustmentType} 
                onValueChange={(value) => handleInputChange('adjustmentType', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="add">Add Stock</SelectItem>
                  <SelectItem value="remove">Remove Stock</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                placeholder="Enter quantity"
                value={formData.quantity}
                onChange={(e) => handleInputChange('quantity', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="reason">Reason</Label>
              <Select 
                value={formData.reason} 
                onValueChange={(value) => handleInputChange('reason', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select reason" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="donated">Donated to food bank</SelectItem>
                  <SelectItem value="spoiled">Spoiled/Damaged</SelectItem>
                  <SelectItem value="theft">Theft reported</SelectItem>
                  <SelectItem value="return">Customer return</SelectItem>
                  <SelectItem value="count-correction">Count correction</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reference">Reference (Optional)</Label>
              <Input
                id="reference"
                placeholder="Reference number"
                value={formData.reference}
                onChange={(e) => handleInputChange('reference', e.target.value)}
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="flex-1"
                disabled={!formData.productId || !formData.lotId || !formData.adjustmentType || !formData.quantity || !formData.reason}
              >
                Save Adjustment
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default NewAdjustmentModal;
