
import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface WorkOrderItem {
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

interface WorkOrder {
  id: string;
  clientName: string;
  clientContact: string;
  clientAddress: string;
  date: string;
  status: 'draft' | 'final';
  items: WorkOrderItem[];
  total: number;
  tax: number;
  grandTotal: number;
}

interface WorkOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (workOrder: Omit<WorkOrder, 'id'>) => void;
  workOrder?: WorkOrder | null;
}

const WorkOrderModal = ({ isOpen, onClose, onSave, workOrder }: WorkOrderModalProps) => {
  const [formData, setFormData] = useState({
    clientName: '',
    clientContact: '',
    clientAddress: '',
    status: 'draft' as 'draft' | 'final'
  });

  const [items, setItems] = useState<WorkOrderItem[]>([
    { productName: '', quantity: 1, unitPrice: 0, subtotal: 0 }
  ]);

  const mockProducts = [
    { name: 'Wireless Headphones', price: 129.99 },
    { name: 'Coffee Mug', price: 12.50 },
    { name: 'Notebook', price: 8.99 },
    { name: 'Desk Lamp', price: 45.00 },
    { name: 'Mouse Pad', price: 15.99 }
  ];

  useEffect(() => {
    if (workOrder) {
      setFormData({
        clientName: workOrder.clientName,
        clientContact: workOrder.clientContact,
        clientAddress: workOrder.clientAddress,
        status: workOrder.status
      });
      setItems(workOrder.items);
    } else {
      setFormData({
        clientName: '',
        clientContact: '',
        clientAddress: '',
        status: 'draft'
      });
      setItems([{ productName: '', quantity: 1, unitPrice: 0, subtotal: 0 }]);
    }
  }, [workOrder, isOpen]);

  const updateItem = (index: number, field: keyof WorkOrderItem, value: string | number) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    
    // Auto-fill unit price when product is selected
    if (field === 'productName') {
      const selectedProduct = mockProducts.find(p => p.name === value);
      if (selectedProduct) {
        newItems[index].unitPrice = selectedProduct.price;
      }
    }
    
    // Calculate subtotal
    newItems[index].subtotal = newItems[index].quantity * newItems[index].unitPrice;
    
    setItems(newItems);
  };

  const addItem = () => {
    setItems([...items, { productName: '', quantity: 1, unitPrice: 0, subtotal: 0 }]);
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const calculateTotals = () => {
    const total = items.reduce((sum, item) => sum + item.subtotal, 0);
    const tax = total * 0.1; // 10% tax
    const grandTotal = total + tax;
    
    return { total, tax, grandTotal };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { total, tax, grandTotal } = calculateTotals();
    
    onSave({
      ...formData,
      date: new Date().toISOString().split('T')[0],
      items,
      total,
      tax,
      grandTotal
    });
    onClose();
  };

  if (!isOpen) return null;

  const { total, tax, grandTotal } = calculateTotals();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {workOrder ? 'Edit Work Order' : 'Create New Work Order'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Client Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="clientName">Client Name</Label>
              <Input
                id="clientName"
                value={formData.clientName}
                onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="clientContact">Client Contact</Label>
              <Input
                id="clientContact"
                type="email"
                value={formData.clientContact}
                onChange={(e) => setFormData({ ...formData, clientContact: e.target.value })}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="clientAddress">Client Address</Label>
            <Textarea
              id="clientAddress"
              value={formData.clientAddress}
              onChange={(e) => setFormData({ ...formData, clientAddress: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="status">Status</Label>
            <Select value={formData.status} onValueChange={(value: 'draft' | 'final') => setFormData({ ...formData, status: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="final">Final</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Items */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <Label>Items</Label>
              <Button type="button" onClick={addItem} size="sm" className="flex items-center space-x-2">
                <Plus className="w-4 h-4" />
                <span>Add Item</span>
              </Button>
            </div>

            <div className="space-y-4">
              {items.map((item, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div>
                    <Label>Product</Label>
                    <Select 
                      value={item.productName} 
                      onValueChange={(value) => updateItem(index, 'productName', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select product" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockProducts.map(product => (
                          <SelectItem key={product.name} value={product.name}>
                            {product.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Quantity</Label>
                    <Input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 1)}
                    />
                  </div>
                  <div>
                    <Label>Unit Price</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={item.unitPrice}
                      onChange={(e) => updateItem(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div>
                    <Label>Subtotal</Label>
                    <Input
                      type="number"
                      value={item.subtotal.toFixed(2)}
                      readOnly
                      className="bg-gray-50 dark:bg-gray-700"
                    />
                  </div>
                  <div className="flex items-end">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeItem(index)}
                      disabled={items.length === 1}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Totals */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <div className="flex justify-end">
              <div className="w-64 space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax (10%):</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg border-t border-gray-200 dark:border-gray-700 pt-2">
                  <span>Grand Total:</span>
                  <span>${grandTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex space-x-3 pt-4">
            <Button type="submit" className="flex-1">
              {workOrder ? 'Update Work Order' : 'Create Work Order'}
            </Button>
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WorkOrderModal;