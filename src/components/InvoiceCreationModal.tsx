
import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Search, User, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

interface InvoiceItem {
  productName: string;
  lotCode: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
}

interface Invoice {
  id: string;
  customerName: string;
  customerContact: string;
  customerAddress: string;
  date: string;
  status: 'draft' | 'final';
  items: InvoiceItem[];
  discount: number;
  total: number;
  tax: number;
  grandTotal: number;
}

interface InvoiceCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (invoice: Omit<Invoice, 'id'>) => void;
  invoice?: Invoice | null;
}

const InvoiceCreationModal = ({ isOpen, onClose, onSave, invoice }: InvoiceCreationModalProps) => {
  const [customerSearch, setCustomerSearch] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [showAddCustomer, setShowAddCustomer] = useState(false);
  const [items, setItems] = useState<InvoiceItem[]>([]);
  const [discount, setDiscount] = useState(0);

  // Mock data
  const mockCustomers: Customer[] = [
    { id: '1', name: 'ABC Company', email: 'john@abc.com', phone: '555-0123', address: '123 Business St, City, State 12345' },
    { id: '2', name: 'XYZ Corp', email: 'sarah@xyz.com', phone: '555-0456', address: '456 Corporate Ave, City, State 67890' },
    { id: '3', name: 'Local Store', email: 'manager@local.com', phone: '555-0789', address: '789 Main St, City, State 13579' }
  ];

  const mockProducts = [
    { 
      name: 'Wireless Headphones', 
      category: 'Electronics',
      lots: [
        { code: 'LOT001', quantity: 10, cost: 100, price: 129.99, date: '2024-01-01' },
        { code: 'LOT002', quantity: 5, cost: 95, price: 129.99, date: '2024-01-15' }
      ]
    },
    { 
      name: 'Coffee Mug', 
      category: 'Kitchen',
      lots: [
        { code: 'LOT003', quantity: 25, cost: 8, price: 12.50, date: '2024-01-10' }
      ]
    },
    { 
      name: 'Notebook', 
      category: 'Office',
      lots: [
        { code: 'LOT004', quantity: 50, cost: 6, price: 8.99, date: '2024-01-05' }
      ]
    }
  ];

  // Current item being added
  const [currentItem, setCurrentItem] = useState({
    productName: '',
    lotCode: '',
    quantity: 1,
    unitPrice: 0,
    availableQuantity: 0
  });

  const [newCustomer, setNewCustomer] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });

  useEffect(() => {
    if (invoice) {
      setSelectedCustomer({
        id: '1',
        name: invoice.customerName,
        email: invoice.customerContact,
        phone: '',
        address: invoice.customerAddress
      });
      setItems(invoice.items);
      setDiscount(invoice.discount || 0);
    } else {
      setSelectedCustomer(null);
      setItems([]);
      setDiscount(0);
      setCurrentItem({
        productName: '',
        lotCode: '',
        quantity: 1,
        unitPrice: 0,
        availableQuantity: 0
      });
    }
  }, [invoice, isOpen]);

  const filteredCustomers = mockCustomers.filter(customer =>
    customer.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
    customer.email.toLowerCase().includes(customerSearch.toLowerCase()) ||
    customer.phone.includes(customerSearch)
  );

  const selectedProduct = mockProducts.find(p => p.name === currentItem.productName);
  const selectedLot = selectedProduct?.lots.find(l => l.code === currentItem.lotCode);

  const handleProductSelect = (productName: string) => {
    setCurrentItem({
      ...currentItem,
      productName,
      lotCode: '',
      unitPrice: 0,
      availableQuantity: 0
    });
  };

  const handleLotSelect = (lotCode: string) => {
    const lot = selectedProduct?.lots.find(l => l.code === lotCode);
    if (lot) {
      setCurrentItem({
        ...currentItem,
        lotCode,
        unitPrice: lot.price,
        availableQuantity: lot.quantity
      });
    }
  };

  const addItemToInvoice = () => {
    if (currentItem.productName && currentItem.lotCode && currentItem.quantity > 0) {
      const newItem: InvoiceItem = {
        productName: currentItem.productName,
        lotCode: currentItem.lotCode,
        quantity: currentItem.quantity,
        unitPrice: currentItem.unitPrice,
        subtotal: currentItem.quantity * currentItem.unitPrice
      };
      
      setItems([...items, newItem]);
      setCurrentItem({
        productName: '',
        lotCode: '',
        quantity: 1,
        unitPrice: 0,
        availableQuantity: 0
      });
    }
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const addNewCustomer = () => {
    const customer: Customer = {
      id: Date.now().toString(),
      ...newCustomer
    };
    setSelectedCustomer(customer);
    setShowAddCustomer(false);
    setNewCustomer({ name: '', email: '', phone: '', address: '' });
  };

  const calculateTotals = () => {
    const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
    const discountAmount = (subtotal * discount) / 100;
    const total = subtotal - discountAmount;
    const tax = total * 0.1; // 10% tax
    const grandTotal = total + tax;
    
    return { subtotal, discountAmount, total, tax, grandTotal };
  };

  const handleSubmit = (status: 'draft' | 'final') => {
    if (!selectedCustomer || items.length === 0) return;
    
    const { total, tax, grandTotal } = calculateTotals();
    
    onSave({
      customerName: selectedCustomer.name,
      customerContact: selectedCustomer.email,
      customerAddress: selectedCustomer.address,
      date: new Date().toISOString().split('T')[0],
      status,
      items,
      discount,
      total,
      tax,
      grandTotal
    });
    onClose();
  };

  if (!isOpen) return null;

  const { subtotal, discountAmount, total, tax, grandTotal } = calculateTotals();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-7xl w-full max-h-[95vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {invoice ? 'Edit Invoice' : 'Create New Invoice'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex h-[calc(95vh-80px)]">
          {/* Left Panel - Invoice Builder */}
          <div className="flex-1 p-6 overflow-y-auto border-r border-gray-200 dark:border-gray-700">
            <div className="space-y-6">
              {/* Customer Selection */}
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <Label className="text-lg font-semibold mb-3 block">Customer Information</Label>
                
                {!selectedCustomer ? (
                  <div className="space-y-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search by name, email, or phone..."
                        value={customerSearch}
                        onChange={(e) => setCustomerSearch(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    
                    {customerSearch && (
                      <div className="space-y-2">
                        {filteredCustomers.map(customer => (
                          <div
                            key={customer.id}
                            onClick={() => setSelectedCustomer(customer)}
                            className="p-3 bg-white dark:bg-gray-800 rounded border cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                          >
                            <div className="font-medium">{customer.name}</div>
                            <div className="text-sm text-gray-500">{customer.email} • {customer.phone}</div>
                          </div>
                        ))}
                        
                        {filteredCustomers.length === 0 && (
                          <Button
                            onClick={() => setShowAddCustomer(true)}
                            variant="outline"
                            className="w-full"
                          >
                            <User className="w-4 h-4 mr-2" />
                            Add New Customer
                          </Button>
                        )}
                      </div>
                    )}
                    
                    {showAddCustomer && (
                      <div className="bg-white dark:bg-gray-800 p-4 rounded border space-y-3">
                        <h4 className="font-medium">Add New Customer</h4>
                        <Input
                          placeholder="Customer Name"
                          value={newCustomer.name}
                          onChange={(e) => setNewCustomer({...newCustomer, name: e.target.value})}
                        />
                        <Input
                          placeholder="Email"
                          value={newCustomer.email}
                          onChange={(e) => setNewCustomer({...newCustomer, email: e.target.value})}
                        />
                        <Input
                          placeholder="Phone"
                          value={newCustomer.phone}
                          onChange={(e) => setNewCustomer({...newCustomer, phone: e.target.value})}
                        />
                        <Textarea
                          placeholder="Address"
                          value={newCustomer.address}
                          onChange={(e) => setNewCustomer({...newCustomer, address: e.target.value})}
                        />
                        <div className="flex space-x-2">
                          <Button onClick={addNewCustomer} className="flex-1">Add Customer</Button>
                          <Button variant="outline" onClick={() => setShowAddCustomer(false)}>Cancel</Button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-white dark:bg-gray-800 p-4 rounded border">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-semibold text-lg">{selectedCustomer.name}</div>
                        <div className="text-gray-600 dark:text-gray-300">{selectedCustomer.email}</div>
                        <div className="text-gray-600 dark:text-gray-300">{selectedCustomer.phone}</div>
                        <div className="text-sm text-gray-500 mt-1">{selectedCustomer.address}</div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedCustomer(null)}
                      >
                        Change
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {/* Add Items Section */}
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <Label className="text-lg font-semibold mb-3 block">Add Items to Invoice</Label>
                
                <div className="space-y-4">
                  {/* Step 1: Select Product */}
                  <div>
                    <Label className="text-sm font-medium mb-2 block">Step 1: Select Product</Label>
                    <Select value={currentItem.productName} onValueChange={handleProductSelect}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a product..." />
                      </SelectTrigger>
                      <SelectContent>
                        {mockProducts.map(product => (
                          <SelectItem key={product.name} value={product.name}>
                            <div className="flex items-center">
                              <Package className="w-4 h-4 mr-2" />
                              {product.name} ({product.category})
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Step 2: Select Lot */}
                  {currentItem.productName && (
                    <div>
                      <Label className="text-sm font-medium mb-2 block">Step 2: Select Stock Lot</Label>
                      <Select value={currentItem.lotCode} onValueChange={handleLotSelect}>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose a lot..." />
                        </SelectTrigger>
                        <SelectContent>
                          {selectedProduct?.lots.map(lot => (
                            <SelectItem key={lot.code} value={lot.code}>
                              <div className="flex justify-between items-center w-full">
                                <span>{lot.code}</span>
                                <Badge variant="secondary">{lot.quantity} available</Badge>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {/* Step 3: Quantity and Price */}
                  {currentItem.lotCode && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium mb-2 block">
                          Step 3: Quantity (Max: {currentItem.availableQuantity})
                        </Label>
                        <Input
                          type="number"
                          min="1"
                          max={currentItem.availableQuantity}
                          value={currentItem.quantity}
                          onChange={(e) => setCurrentItem({
                            ...currentItem,
                            quantity: Math.min(parseInt(e.target.value) || 1, currentItem.availableQuantity)
                          })}
                        />
                      </div>
                      <div>
                        <Label className="text-sm font-medium mb-2 block">Step 4: Price per Unit</Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={currentItem.unitPrice}
                          onChange={(e) => setCurrentItem({
                            ...currentItem,
                            unitPrice: parseFloat(e.target.value) || 0
                          })}
                        />
                      </div>
                    </div>
                  )}

                  {/* Add to Invoice Button */}
                  {currentItem.lotCode && (
                    <div className="pt-4 border-t border-gray-200 dark:border-gray-600">
                      <div className="flex justify-between items-center mb-3">
                        <span className="font-medium">Item Total:</span>
                        <span className="text-xl font-bold text-green-600">
                          ${(currentItem.quantity * currentItem.unitPrice).toFixed(2)}
                        </span>
                      </div>
                      <Button
                        onClick={addItemToInvoice}
                        className="w-full"
                        size="lg"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add to Invoice
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Live Preview */}
          <div className="w-96 p-6 bg-gray-50 dark:bg-gray-700 overflow-y-auto">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Invoice Preview</h3>
              
              {/* Customer Info */}
              {selectedCustomer && (
                <div className="bg-white dark:bg-gray-800 p-3 rounded border">
                  <div className="text-sm text-gray-500">Bill To:</div>
                  <div className="font-medium">{selectedCustomer.name}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">{selectedCustomer.email}</div>
                </div>
              )}

              {/* Items List */}
              <div className="space-y-2">
                <div className="font-medium">Items ({items.length})</div>
                {items.length === 0 ? (
                  <div className="text-gray-500 text-center py-8">
                    No items added yet
                  </div>
                ) : (
                  items.map((item, index) => (
                    <div key={index} className="bg-white dark:bg-gray-800 p-3 rounded border">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="font-medium">{item.productName}</div>
                          <div className="text-sm text-gray-500">Lot: {item.lotCode}</div>
                          <div className="text-sm">
                            {item.quantity} × ${item.unitPrice.toFixed(2)}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">${item.subtotal.toFixed(2)}</span>
                          <button
                            onClick={() => removeItem(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Discount */}
              {items.length > 0 && (
                <div className="bg-white dark:bg-gray-800 p-3 rounded border">
                  <Label className="text-sm font-medium mb-2 block">Discount (%)</Label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={discount}
                    onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                  />
                </div>
              )}

              {/* Totals */}
              {items.length > 0 && (
                <div className="bg-white dark:bg-gray-800 p-4 rounded border space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-red-600">
                      <span>Discount ({discount}%):</span>
                      <span>-${discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Tax (10%):</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg border-t pt-2">
                    <span>Total:</span>
                    <span>${grandTotal.toFixed(2)}</span>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-2 pt-4">
                <Button
                  onClick={() => handleSubmit('draft')}
                  variant="outline"
                  className="w-full"
                  disabled={!selectedCustomer || items.length === 0}
                >
                  Save Draft
                </Button>
                <Button
                  onClick={() => handleSubmit('final')}
                  className="w-full"
                  disabled={!selectedCustomer || items.length === 0}
                >
                  Finalize & Send Invoice
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  disabled={!selectedCustomer || items.length === 0}
                >
                  Print Invoice
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceCreationModal;