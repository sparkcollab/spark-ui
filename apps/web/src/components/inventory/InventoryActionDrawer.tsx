
import React, { useState } from 'react';
import { X, Package, Truck, RotateCcw, BarChart3, Calendar, Hash, DollarSign, Scale } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose } from '@/components/ui/sheet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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
  lastDelivery?: string;
  activeLots: number;
}

interface InventoryActionDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  action: 'add-product' | 'add-delivery' | 'return-supplier' | 'update-stock' | null;
  product?: Product | null;
}

const InventoryActionDrawer = ({ isOpen, onClose, action, product }: InventoryActionDrawerProps) => {
  const [formData, setFormData] = useState<Record<string, any>>({});

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    console.log('Saving form data:', formData);
    // Here you would handle the actual save logic
    onClose();
  };

  const getTitle = () => {
    switch (action) {
      case 'add-product':
        return product ? 'Edit Product' : 'Add New Product';
      case 'add-delivery':
        return 'Add New Delivery';
      case 'return-supplier':
        return 'Return to Supplier';
      case 'update-stock':
        return 'Update Stock';
      default:
        return 'Action';
    }
  };

  const getIcon = () => {
    switch (action) {
      case 'add-product':
        return Package;
      case 'add-delivery':
        return Truck;
      case 'return-supplier':
        return RotateCcw;
      case 'update-stock':
        return BarChart3;
      default:
        return Package;
    }
  };

  const renderForm = () => {
    switch (action) {
      case 'add-product':
        return (
          <div className="space-y-6">
            {product && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Editing Product</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-muted-foreground">
                    Current: {product.name} ({product.sku})
                  </div>
                </CardContent>
              </Card>
            )}
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="productName">Product Name *</Label>
                <Input
                  id="productName"
                  placeholder="Enter product name"
                  value={formData.productName || (product?.name || '')}
                  onChange={(e) => handleInputChange('productName', e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="sku">SKU *</Label>
                <Input
                  id="sku"
                  placeholder="Product SKU"
                  value={formData.sku || (product?.sku || '')}
                  onChange={(e) => handleInputChange('sku', e.target.value)}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Category *</Label>
                  <Select value={formData.category || (product?.category || '')} onValueChange={(value) => handleInputChange('category', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Fruits">Fruits</SelectItem>
                      <SelectItem value="Vegetables">Vegetables</SelectItem>
                      <SelectItem value="Dairy">Dairy</SelectItem>
                      <SelectItem value="Meat">Meat</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="subcategory">Sub-category</Label>
                  <Input
                    id="subcategory"
                    placeholder="Sub-category"
                    value={formData.subcategory || (product?.subcategory || '')}
                    onChange={(e) => handleInputChange('subcategory', e.target.value)}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="unitOfMeasure">Unit of Measure *</Label>
                <Select value={formData.unitOfMeasure || (product?.unitOfMeasure || '')} onValueChange={(value) => handleInputChange('unitOfMeasure', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select unit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lbs">Pounds (lbs)</SelectItem>
                    <SelectItem value="kg">Kilograms (kg)</SelectItem>
                    <SelectItem value="units">Units</SelectItem>
                    <SelectItem value="cases">Cases</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Product description (optional)"
                  value={formData.description || ''}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                />
              </div>
            </div>
          </div>
        );

      case 'add-delivery':
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Adding Delivery For</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">
                  {product?.name} ({product?.sku})
                </div>
              </CardContent>
            </Card>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="supplierName">Supplier Name *</Label>
                <Input
                  id="supplierName"
                  placeholder="Enter supplier name"
                  value={formData.supplierName || ''}
                  onChange={(e) => handleInputChange('supplierName', e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="lotCode">Lot Code</Label>
                <Input
                  id="lotCode"
                  placeholder="Auto-generated or manual entry"
                  value={formData.lotCode || ''}
                  onChange={(e) => handleInputChange('lotCode', e.target.value)}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="deliveryDate">Delivery Date *</Label>
                  <Input
                    id="deliveryDate"
                    type="date"
                    value={formData.deliveryDate || new Date().toISOString().split('T')[0]}
                    onChange={(e) => handleInputChange('deliveryDate', e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="expiryDate">Expiry Date</Label>
                  <Input
                    id="expiryDate"
                    type="date"
                    value={formData.expiryDate || ''}
                    onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="quantityReceived">Quantity Received *</Label>
                  <Input
                    id="quantityReceived"
                    type="number"
                    placeholder="0"
                    value={formData.quantityReceived || ''}
                    onChange={(e) => handleInputChange('quantityReceived', e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="costPrice">Cost Price *</Label>
                  <Input
                    id="costPrice"
                    type="number"
                    placeholder="0.00"
                    step="0.01"
                    value={formData.costPrice || ''}
                    onChange={(e) => handleInputChange('costPrice', e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 'return-supplier':
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Returning to Supplier</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">
                  {product?.name} ({product?.sku})
                </div>
              </CardContent>
            </Card>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="returnLotCode">Lot Code *</Label>
                <Select value={formData.returnLotCode || ''} onValueChange={(value) => handleInputChange('returnLotCode', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select lot to return" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LOT001">LOT001 - Received 2024-06-10 (45 lbs)</SelectItem>
                    <SelectItem value="LOT002">LOT002 - Received 2024-06-08 (30 lbs)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="returnQuantity">Return Quantity *</Label>
                  <Input
                    id="returnQuantity"
                    type="number"
                    placeholder="0"
                    value={formData.returnQuantity || ''}
                    onChange={(e) => handleInputChange('returnQuantity', e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="returnDate">Return Date *</Label>
                  <Input
                    id="returnDate"
                    type="date"
                    value={formData.returnDate || new Date().toISOString().split('T')[0]}
                    onChange={(e) => handleInputChange('returnDate', e.target.value)}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="returnReason">Reason for Return *</Label>
                <Select value={formData.returnReason || ''} onValueChange={(value) => handleInputChange('returnReason', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select reason" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="damaged">Damaged Goods</SelectItem>
                    <SelectItem value="expired">Expired</SelectItem>
                    <SelectItem value="wrong-item">Wrong Item</SelectItem>
                    <SelectItem value="quality-issue">Quality Issue</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="returnNotes">Notes</Label>
                <Textarea
                  id="returnNotes"
                  placeholder="Additional notes about the return"
                  value={formData.returnNotes || ''}
                  onChange={(e) => handleInputChange('returnNotes', e.target.value)}
                />
              </div>
            </div>
          </div>
        );

      case 'update-stock':
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Updating Stock For</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">
                  {product?.name} ({product?.sku}) - Current: {product?.stock} {product?.unitOfMeasure}
                </div>
              </CardContent>
            </Card>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="stockLotCode">Lot Code *</Label>
                <Select value={formData.stockLotCode || ''} onValueChange={(value) => handleInputChange('stockLotCode', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select lot to adjust" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LOT001">LOT001 - Current: 25 lbs</SelectItem>
                    <SelectItem value="LOT002">LOT002 - Current: 20 lbs</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="adjustmentType">Adjustment Type *</Label>
                  <Select value={formData.adjustmentType || ''} onValueChange={(value) => handleInputChange('adjustmentType', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="increase">Increase (+)</SelectItem>
                      <SelectItem value="decrease">Decrease (-)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="adjustmentQuantity">Quantity *</Label>
                  <Input
                    id="adjustmentQuantity"
                    type="number"
                    placeholder="0"
                    value={formData.adjustmentQuantity || ''}
                    onChange={(e) => handleInputChange('adjustmentQuantity', e.target.value)}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="adjustmentReason">Reason *</Label>
                <Select value={formData.adjustmentReason || ''} onValueChange={(value) => handleInputChange('adjustmentReason', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select reason" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="damage">Damage</SelectItem>
                    <SelectItem value="theft">Theft</SelectItem>
                    <SelectItem value="recount">Recount</SelectItem>
                    <SelectItem value="donation">Donation</SelectItem>
                    <SelectItem value="spoilage">Spoilage</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="adjustmentNotes">Notes</Label>
                <Textarea
                  id="adjustmentNotes"
                  placeholder="Additional notes about the adjustment"
                  value={formData.adjustmentNotes || ''}
                  onChange={(e) => handleInputChange('adjustmentNotes', e.target.value)}
                />
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const Icon = getIcon();

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:max-w-lg">
        <SheetHeader className="border-b pb-4">
          <SheetTitle className="flex items-center space-x-2">
            <Icon className="w-5 h-5" />
            <span>{getTitle()}</span>
          </SheetTitle>
          <SheetClose className="absolute right-4 top-4">
            <X className="w-4 h-4" />
          </SheetClose>
        </SheetHeader>
        
        <div className="py-6 overflow-y-auto h-[calc(100vh-200px)]">
          {renderForm()}
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 border-t bg-background p-4">
          <div className="flex gap-3">
            <Button onClick={handleSave} className="flex-1" size="lg">
              Save Changes
            </Button>
            <Button variant="outline" onClick={onClose} className="flex-1" size="lg">
              Cancel
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default InventoryActionDrawer;