import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Search, Trash2, Package, User, Calendar, Edit } from 'lucide-react';
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

interface InvoiceData {
  customerName: string;
  customerContact: string;
  customerAddress: string;
  date: string;
  status: 'draft' | 'final';
  paymentStatus: 'paid' | 'unpaid' | 'overdue';
  items: InvoiceItem[];
  discount: number;
  total: number;
  tax: number;
  grandTotal: number;
}

interface InvoiceCreationFormProps {
  onSave: (invoice: InvoiceData) => void;
  onCancel: () => void;
}

const InvoiceCreationForm = ({ onSave, onCancel }: InvoiceCreationFormProps) => {
  const [customerSearch, setCustomerSearch] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [showAddCustomer, setShowAddCustomer] = useState(false);
  const [items, setItems] = useState<InvoiceItem[]>([]);
  const [discount, setDiscount] = useState(0);
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('percentage');
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split('T')[0]);

  // Enhanced produce-specific mock data
  const mockCustomers: Customer[] = [
    { id: '1', name: 'Green Valley Market', email: 'orders@greenvalley.com', phone: '559-555-0123', address: '123 Market Street, Fresno, CA 93721' },
    { id: '2', name: 'Fresh Foods Co-op', email: 'purchasing@freshfoods.com', phone: '831-555-0456', address: '456 Organic Avenue, Salinas, CA 93901' },
    { id: '3', name: 'Corner Grocery', email: 'manager@cornergrocery.com', phone: '661-555-0789', address: '789 Main Street, Bakersfield, CA 93301' },
    { id: '4', name: 'Farm-to-Table Restaurant', email: 'chef@farmtotable.com', phone: '415-555-0321', address: '321 Culinary Lane, San Francisco, CA 94102' }
  ];

  const mockProducts = [
    { 
      name: 'Gala Apples', 
      category: 'Tree Fruits',
      lots: [
        { code: 'GAL001', quantity: 45, receivedDate: '2024-01-10', cost: 2.20, price: 3.50, description: 'Premium Grade A - Washington State' },
        { code: 'GAL002', quantity: 28, receivedDate: '2024-01-15', cost: 2.10, price: 3.25, description: 'Grade A - Local Farm' }
      ]
    },
    { 
      name: 'Organic Baby Spinach', 
      category: 'Leafy Greens',
      lots: [
        { code: 'SPIN456', quantity: 20, receivedDate: '2024-01-17', cost: 4.50, price: 6.99, description: 'Certified Organic - 5oz bags' }
      ]
    },
    { 
      name: 'Heirloom Tomatoes', 
      category: 'Vine Vegetables',
      lots: [
        { code: 'TOM789', quantity: 35, receivedDate: '2024-01-16', cost: 3.80, price: 5.50, description: 'Mixed Variety - Locally Grown' },
        { code: 'TOM790', quantity: 15, receivedDate: '2024-01-18', cost: 4.20, price: 6.25, description: 'Cherokee Purple - Premium' }
      ]
    },
    { 
      name: 'Russet Potatoes', 
      category: 'Root Vegetables',
      lots: [
        { code: 'POT123', quantity: 120, receivedDate: '2024-01-08', cost: 1.20, price: 2.25, description: '50lb bags - Idaho Grown' },
        { code: 'POT124', quantity: 80, receivedDate: '2024-01-14', cost: 1.15, price: 2.10, description: '25lb bags - Local Farm' }
      ]
    },
    { 
      name: 'Organic Kale', 
      category: 'Leafy Greens',
      lots: [
        { code: 'KALE567', quantity: 25, receivedDate: '2024-01-12', cost: 3.50, price: 5.99, description: 'Curly Kale - Certified Organic' }
      ]
    },
    { 
      name: 'Red Bell Peppers', 
      category: 'Bell Peppers',
      lots: [
        { code: 'BELL890', quantity: 40, receivedDate: '2024-01-15', cost: 2.80, price: 4.25, description: 'Large Size - Greenhouse Grown' }
      ]
    }
  ];

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

  const updateItemQuantity = (index: number, newQuantity: number) => {
    const updatedItems = [...items];
    updatedItems[index].quantity = newQuantity;
    updatedItems[index].subtotal = newQuantity * updatedItems[index].unitPrice;
    setItems(updatedItems);
  };

  const updateItemPrice = (index: number, newPrice: number) => {
    const updatedItems = [...items];
    updatedItems[index].unitPrice = newPrice;
    updatedItems[index].subtotal = updatedItems[index].quantity * newPrice;
    setItems(updatedItems);
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
    const discountAmount = discountType === 'percentage' 
      ? (subtotal * discount) / 100 
      : discount;
    const total = subtotal - discountAmount;
    const tax = total * 0.0875; // 8.75% sales tax
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
      date: invoiceDate,
      status,
      paymentStatus: 'unpaid',
      items,
      discount,
      total,
      tax,
      grandTotal
    });
  };

  const { subtotal, discountAmount, total, tax, grandTotal } = calculateTotals();

  return (
    <div className="flex h-[calc(100vh-120px)] gap-6">
      {/* Left Panel - Data Entry */}
      <div className="flex-1 space-y-6 overflow-y-auto pr-4">
        {/* Customer Selection */}
        <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
          <Label className="text-lg font-semibold mb-4 block flex items-center">
            <User className="w-5 h-5 mr-2" />
            Customer Information
          </Label>
          
          {!selectedCustomer ? (
            <div className="space-y-4">
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
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {filteredCustomers.map(customer => (
                    <div
                      key={customer.id}
                      onClick={() => setSelectedCustomer(customer)}
                      className="p-4 bg-white dark:bg-gray-800 rounded border cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                    >
                      <div className="font-medium text-lg">{customer.name}</div>
                      <div className="text-sm text-gray-500">{customer.email} • {customer.phone}</div>
                      <div className="text-xs text-gray-400 mt-1">{customer.address}</div>
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

        {/* Invoice Date */}
        <div>
          <Label className="text-sm font-medium mb-2 block">Invoice Date</Label>
          <div className="relative">
            <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              type="date"
              value={invoiceDate}
              onChange={(e) => setInvoiceDate(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Add Products Section */}
        <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
          <Label className="text-lg font-semibold mb-4 block flex items-center">
            <Package className="w-5 h-5 mr-2" />
            Add Products from Inventory
          </Label>
          
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium mb-2 block">Select Product</Label>
              <Select value={currentItem.productName} onValueChange={handleProductSelect}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a product..." />
                </SelectTrigger>
                <SelectContent>
                  {mockProducts.map(product => (
                    <SelectItem key={product.name} value={product.name}>
                      <div className="flex items-center">
                        <Package className="w-4 h-4 mr-2" />
                        {product.name} <Badge variant="secondary" className="ml-2">{product.category}</Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {currentItem.productName && (
              <div>
                <Label className="text-sm font-medium mb-2 block">Select Lot</Label>
                <Select value={currentItem.lotCode} onValueChange={handleLotSelect}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a lot..." />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedProduct?.lots.map(lot => (
                      <SelectItem key={lot.code} value={lot.code}>
                        <div className="space-y-1 w-full">
                          <div className="flex justify-between items-center">
                            <span className="font-medium">{lot.code} - {lot.description}</span>
                            <Badge variant="secondary">{lot.quantity} available</Badge>
                          </div>
                          <div className="text-xs text-gray-500">
                            Received: {lot.receivedDate} • ${lot.price}/unit • Cost: ${lot.cost}
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {currentItem.lotCode && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium mb-2 block">
                    Quantity (Max: {currentItem.availableQuantity})
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
                  <Label className="text-sm font-medium mb-2 block">Price per Unit</Label>
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

            {currentItem.lotCode && (
              <>
                <div className="flex justify-between items-center p-4 bg-white dark:bg-gray-800 rounded border">
                  <span className="font-medium">Item Total:</span>
                  <span className="text-xl font-bold text-green-600">
                    ${(currentItem.quantity * currentItem.unitPrice).toFixed(2)}
                  </span>
                </div>

                <Button
                  onClick={addItemToInvoice}
                  disabled={!currentItem.lotCode}
                  className="w-full"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add to Invoice
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Right Panel - Invoice Cart Summary */}
      <div className="w-96 space-y-6">
        <div className="bg-white dark:bg-gray-800 border rounded-lg p-6 h-full flex flex-col">
          <h3 className="text-lg font-semibold mb-4">Invoice Summary</h3>
          
          {/* Items List */}
          <div className="flex-1 space-y-3 mb-6 overflow-y-auto">
            {items.length === 0 ? (
              <div className="text-gray-500 text-center py-12 bg-gray-50 dark:bg-gray-700 rounded">
                <Package className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                <p>No items added yet</p>
                <p className="text-sm">Select products from the left panel</p>
              </div>
            ) : (
              items.map((item, index) => (
                <div key={index} className="bg-gray-50 dark:bg-gray-700 p-4 rounded border">
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="font-medium">{item.productName}</div>
                        <div className="text-sm text-gray-500">Lot: {item.lotCode}</div>
                      </div>
                      <button
                        onClick={() => removeItem(index)}
                        className="text-red-500 hover:text-red-700 ml-2"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label className="text-xs text-gray-500">Quantity</Label>
                        <Input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => updateItemQuantity(index, parseInt(e.target.value) || 1)}
                          className="text-sm"
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-gray-500">Unit Price</Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={item.unitPrice}
                          onChange={(e) => updateItemPrice(index, parseFloat(e.target.value) || 0)}
                          className="text-sm"
                        />
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center pt-2 border-t border-gray-200 dark:border-gray-600">
                      <span className="text-sm font-medium">Line Total:</span>
                      <span className="font-bold text-green-600">${item.subtotal.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Discount */}
          {items.length > 0 && (
            <div className="space-y-3 mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded">
              <Label className="text-sm font-medium">Apply Discount</Label>
              <div className="flex space-x-2">
                <Select value={discountType} onValueChange={(value: 'percentage' | 'fixed') => setDiscountType(value)}>
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">%</SelectItem>
                    <SelectItem value="fixed">$</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  type="number"
                  min="0"
                  max={discountType === 'percentage' ? "100" : undefined}
                  value={discount}
                  onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                  placeholder={discountType === 'percentage' ? "0" : "0.00"}
                  className="flex-1"
                />
              </div>
            </div>
          )}

          {/* Totals */}
          {items.length > 0 && (
            <div className="border-t pt-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span>Subtotal:</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-sm text-red-600">
                  <span>Discount ({discountType === 'percentage' ? `${discount}%` : '$' + discount.toFixed(2)}):</span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span>Tax (8.75%):</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg border-t pt-3">
                <span>Total:</span>
                <span className="text-green-600">${grandTotal.toFixed(2)}</span>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-6 space-y-2">
            <Button
              onClick={() => handleSubmit('final')}
              className="w-full"
              disabled={!selectedCustomer || items.length === 0}
            >
              Save Invoice
            </Button>
            <Button
              onClick={() => handleSubmit('draft')}
              variant="outline"
              className="w-full"
              disabled={!selectedCustomer || items.length === 0}
            >
              Save as Draft
            </Button>
            <Button variant="ghost" onClick={onCancel} className="w-full">
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceCreationForm;
