
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Search, Trash2, Package, User, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface InvoiceItem {
  productName: string;
  lotCode: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  taxRate: number;
  subtotal: number;
  taxAmount: number;
  lineTotal: number;
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
  items: Array<{
    productName: string;
    lotCode: string;
    quantity: number;
    unitPrice: number;
    subtotal: number;
  }>;
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
        { code: 'GAL001', quantity: 45, receivedDate: '2024-01-10', cost: 2.20, price: 3.50, description: 'Premium Grade A - Washington State', supplier: 'Mountain View Orchards' },
        { code: 'GAL002', quantity: 28, receivedDate: '2024-01-15', cost: 2.10, price: 3.25, description: 'Grade A - Local Farm', supplier: 'Valley Fresh Farms' }
      ]
    },
    { 
      name: 'Organic Baby Spinach', 
      category: 'Leafy Greens',
      lots: [
        { code: 'SPIN456', quantity: 20, receivedDate: '2024-01-17', cost: 4.50, price: 6.99, description: 'Certified Organic - 5oz bags', supplier: 'Green Valley Co-op' }
      ]
    },
    { 
      name: 'Heirloom Tomatoes', 
      category: 'Vine Vegetables',
      lots: [
        { code: 'TOM789', quantity: 35, receivedDate: '2024-01-16', cost: 3.80, price: 5.50, description: 'Mixed Variety - Locally Grown', supplier: 'Sunrise Farms' },
        { code: 'TOM790', quantity: 15, receivedDate: '2024-01-18', cost: 4.20, price: 6.25, description: 'Cherokee Purple - Premium', supplier: 'Heritage Gardens' }
      ]
    },
    { 
      name: 'Russet Potatoes', 
      category: 'Root Vegetables',
      lots: [
        { code: 'POT123', quantity: 120, receivedDate: '2024-01-08', cost: 1.20, price: 2.25, description: '50lb bags - Idaho Grown', supplier: 'Idaho Best Produce' },
        { code: 'POT124', quantity: 80, receivedDate: '2024-01-14', cost: 1.15, price: 2.10, description: '25lb bags - Local Farm', supplier: 'Local Harvest Co.' }
      ]
    },
    { 
      name: 'Organic Kale', 
      category: 'Leafy Greens',
      lots: [
        { code: 'KALE567', quantity: 25, receivedDate: '2024-01-12', cost: 3.50, price: 5.99, description: 'Curly Kale - Certified Organic', supplier: 'Organic Greens Ltd.' }
      ]
    },
    { 
      name: 'Red Bell Peppers', 
      category: 'Bell Peppers',
      lots: [
        { code: 'BELL890', quantity: 40, receivedDate: '2024-01-15', cost: 2.80, price: 4.25, description: 'Large Size - Greenhouse Grown', supplier: 'Greenhouse Partners' }
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

  const calculateLineItem = (quantity: number, unitPrice: number, discount: number, taxRate: number) => {
    const subtotal = (quantity * unitPrice) - discount;
    const taxAmount = subtotal * (taxRate / 100);
    const lineTotal = subtotal + taxAmount;
    return { subtotal, taxAmount, lineTotal };
  };

  const addItemToInvoice = () => {
    if (currentItem.productName && currentItem.lotCode && currentItem.quantity > 0) {
      const { subtotal, taxAmount, lineTotal } = calculateLineItem(
        currentItem.quantity,
        currentItem.unitPrice,
        0, // default discount
        13 // fixed tax rate of 13%
      );
      
      const newItem: InvoiceItem = {
        productName: currentItem.productName,
        lotCode: currentItem.lotCode,
        quantity: currentItem.quantity,
        unitPrice: currentItem.unitPrice,
        discount: 0,
        taxRate: 13,
        subtotal,
        taxAmount,
        lineTotal
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

  const updateItem = (index: number, field: keyof InvoiceItem, value: number) => {
    const updatedItems = [...items];
    (updatedItems[index] as any)[field] = value;
    
    // Recalculate line totals with fixed 13% tax rate
    const { subtotal, taxAmount, lineTotal } = calculateLineItem(
      updatedItems[index].quantity,
      updatedItems[index].unitPrice,
      updatedItems[index].discount,
      13 // fixed tax rate
    );
    
    updatedItems[index].subtotal = subtotal;
    updatedItems[index].taxAmount = taxAmount;
    updatedItems[index].lineTotal = lineTotal;
    
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
    const totalSubtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
    const totalDiscount = items.reduce((sum, item) => sum + item.discount, 0);
    const totalTax = items.reduce((sum, item) => sum + item.taxAmount, 0);
    const grandTotal = totalSubtotal + totalTax;
    
    return { totalSubtotal, totalDiscount, totalTax, grandTotal };
  };

  const handleSubmit = (status: 'draft' | 'final') => {
    if (!selectedCustomer || items.length === 0) return;
    
    const { totalSubtotal, totalTax, grandTotal } = calculateTotals();
    
    onSave({
      customerName: selectedCustomer.name,
      customerContact: selectedCustomer.email,
      customerAddress: selectedCustomer.address,
      date: invoiceDate,
      status,
      paymentStatus: 'unpaid',
      items: items.map(item => ({
        productName: item.productName,
        lotCode: item.lotCode,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        subtotal: item.subtotal
      })),
      discount: 0,
      total: totalSubtotal,
      tax: totalTax,
      grandTotal
    });
  };

  const { totalSubtotal, totalDiscount, totalTax, grandTotal } = calculateTotals();

  return (
    <div className="h-[calc(100vh-80px)] flex flex-col">
      {/* Compact Header - Customer and Invoice Date in horizontal layout */}
      <div className="flex-shrink-0 p-3 border-b bg-gray-50 dark:bg-gray-800">
        <div className="grid grid-cols-2 gap-4">
          {/* Customer Information - Left Column */}
          <div>
            <Label className="text-xs font-semibold mb-2 block flex items-center">
              <User className="w-3 h-3 mr-1" />
              Customer Information
            </Label>
            
            {!selectedCustomer ? (
              <div className="space-y-2">
                <div className="relative">
                  <Search className="absolute left-2 top-2 h-3 w-3 text-gray-400" />
                  <Input
                    placeholder="Search by name, email, or phone..."
                    value={customerSearch}
                    onChange={(e) => setCustomerSearch(e.target.value)}
                    className="pl-7 h-8 text-xs"
                  />
                </div>
                
                {customerSearch && (
                  <div className="space-y-1 max-h-24 overflow-y-auto">
                    {filteredCustomers.map(customer => (
                      <div
                        key={customer.id}
                        onClick={() => setSelectedCustomer(customer)}
                        className="p-2 bg-white dark:bg-gray-700 rounded border cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors text-xs"
                      >
                        <div className="font-medium">{customer.name}</div>
                        <div className="text-xs text-gray-500">{customer.email}</div>
                      </div>
                    ))}
                    
                    {filteredCustomers.length === 0 && (
                      <Button
                        onClick={() => setShowAddCustomer(true)}
                        variant="outline"
                        size="sm"
                        className="w-full h-7 text-xs"
                      >
                        <User className="w-3 h-3 mr-1" />
                        Add New Customer
                      </Button>
                    )}
                  </div>
                )}
                
                {showAddCustomer && (
                  <div className="bg-white dark:bg-gray-700 p-2 rounded border space-y-2">
                    <h4 className="font-medium text-xs">Add New Customer</h4>
                    <Input
                      placeholder="Customer Name"
                      value={newCustomer.name}
                      onChange={(e) => setNewCustomer({...newCustomer, name: e.target.value})}
                      className="text-xs h-7"
                    />
                    <Input
                      placeholder="Email"
                      value={newCustomer.email}
                      onChange={(e) => setNewCustomer({...newCustomer, email: e.target.value})}
                      className="text-xs h-7"
                    />
                    <Input
                      placeholder="Phone"
                      value={newCustomer.phone}
                      onChange={(e) => setNewCustomer({...newCustomer, phone: e.target.value})}
                      className="text-xs h-7"
                    />
                    <Textarea
                      placeholder="Address"
                      value={newCustomer.address}
                      onChange={(e) => setNewCustomer({...newCustomer, address: e.target.value})}
                      className="text-xs"
                      rows={2}
                    />
                    <div className="flex space-x-2">
                      <Button onClick={addNewCustomer} size="sm" className="flex-1 h-7 text-xs">Add</Button>
                      <Button variant="outline" size="sm" onClick={() => setShowAddCustomer(false)} className="h-7 text-xs">Cancel</Button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-700 p-2 rounded border">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-semibold text-xs">{selectedCustomer.name}</div>
                    <div className="text-xs text-gray-600 dark:text-gray-300">{selectedCustomer.email}</div>
                    <div className="text-xs text-gray-600 dark:text-gray-300">{selectedCustomer.phone}</div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedCustomer(null)}
                    className="h-6 text-xs"
                  >
                    Change
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Invoice Date - Right Column */}
          <div>
            <Label className="text-xs font-semibold mb-2 block flex items-center">
              <Calendar className="w-3 h-3 mr-1" />
              Invoice Date
            </Label>
            <div className="relative">
              <Calendar className="absolute left-2 top-2 h-3 w-3 text-gray-400" />
              <Input
                type="date"
                value={invoiceDate}
                onChange={(e) => setInvoiceDate(e.target.value)}
                className="pl-7 h-8 text-xs"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Invoice Items Table - Flexible Height with Scroll */}
      <div className="flex-1 overflow-hidden flex flex-col p-4">
        <div className="flex-1 overflow-y-auto bg-white dark:bg-gray-800 border rounded-lg">
          <Table>
            <TableHeader className="sticky top-0 bg-white dark:bg-gray-800 z-10">
              <TableRow>
                <TableHead className="w-32">Product Name</TableHead>
                <TableHead className="w-80">Product Lot</TableHead>
                <TableHead className="w-20">Quantity</TableHead>
                <TableHead className="w-24">Unit Price</TableHead>
                <TableHead className="w-24">Dollar Discount</TableHead>
                <TableHead className="w-24">Tax Amount</TableHead>
                <TableHead className="w-24">Line Total</TableHead>
                <TableHead className="w-16"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* Inline Product Addition Row */}
              <TableRow className="bg-blue-50 dark:bg-blue-900/20 border-b-2 border-blue-200 dark:border-blue-700 sticky top-12 z-10">
                <TableCell>
                  <Select value={currentItem.productName} onValueChange={handleProductSelect}>
                    <SelectTrigger className="w-full h-8">
                      <SelectValue placeholder="Select product..." />
                    </SelectTrigger>
                    <SelectContent>
                      {mockProducts.map(product => (
                        <SelectItem key={product.name} value={product.name}>
                          {product.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  {currentItem.productName && (
                    <Select value={currentItem.lotCode} onValueChange={handleLotSelect}>
                      <SelectTrigger className="w-full h-8">
                        <SelectValue placeholder="Select lot..." />
                      </SelectTrigger>
                      <SelectContent className="w-96">
                        {selectedProduct?.lots.map(lot => (
                          <SelectItem key={lot.code} value={lot.code}>
                            <div className="flex flex-col w-full">
                              <div className="font-medium text-sm">{lot.code} - {lot.quantity} available</div>
                              <div className="text-xs text-gray-500 mt-1">
                                <div>Received: {new Date(lot.receivedDate).toLocaleDateString()}</div>
                                <div>Supplier: {lot.supplier}</div>
                                <div className="text-xs text-gray-600">{lot.description}</div>
                              </div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    placeholder="Qty"
                    min="1"
                    max={currentItem.availableQuantity}
                    value={currentItem.quantity}
                    onChange={(e) => setCurrentItem({
                      ...currentItem,
                      quantity: Math.min(parseInt(e.target.value) || 1, currentItem.availableQuantity)
                    })}
                    className="w-full h-8"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    placeholder="Price"
                    step="0.01"
                    value={currentItem.unitPrice}
                    onChange={(e) => setCurrentItem({
                      ...currentItem,
                      unitPrice: parseFloat(e.target.value) || 0
                    })}
                    className="w-full h-8"
                  />
                </TableCell>
                <TableCell colSpan={3}></TableCell>
                <TableCell>
                  <Button
                    onClick={addItemToInvoice}
                    disabled={!currentItem.lotCode}
                    size="sm"
                    className="w-full h-8"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>

              {/* Invoice Items */}
              {items.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-12 text-gray-500">
                    <Package className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                    <p>No items added yet</p>
                    <p className="text-sm">Use the row above to add products to the invoice</p>
                  </TableCell>
                </TableRow>
              ) : (
                items.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium text-sm">{item.productName}</TableCell>
                    <TableCell className="text-sm text-gray-500">
                      <div className="font-medium">{item.lotCode}</div>
                      {selectedProduct?.lots.find(l => l.code === item.lotCode) && (
                        <div className="text-xs text-gray-400 mt-1">
                          {selectedProduct.lots.find(l => l.code === item.lotCode)?.description}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 1)}
                        className="w-16 text-sm h-8"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        step="0.01"
                        value={item.unitPrice}
                        onChange={(e) => updateItem(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                        className="w-20 text-sm h-8"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        step="0.01"
                        value={item.discount}
                        onChange={(e) => updateItem(index, 'discount', parseFloat(e.target.value) || 0)}
                        className="w-20 text-sm h-8"
                      />
                    </TableCell>
                    <TableCell className="text-sm">${item.taxAmount.toFixed(2)}</TableCell>
                    <TableCell className="font-medium text-green-600">${item.lineTotal.toFixed(2)}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeItem(index)}
                        className="text-red-500 hover:text-red-700 h-8 w-8"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
            {items.length > 0 && (
              <TableFooter className="sticky bottom-0 bg-white dark:bg-gray-800">
                <TableRow>
                  <TableCell colSpan={5} className="text-right font-medium">Totals:</TableCell>
                  <TableCell className="font-medium">${totalTax.toFixed(2)}</TableCell>
                  <TableCell className="font-bold text-green-600 text-lg">${grandTotal.toFixed(2)}</TableCell>
                  <TableCell></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={5} className="text-right text-sm text-gray-500">
                    Subtotal: ${totalSubtotal.toFixed(2)} | 
                    Total Discount: ${totalDiscount.toFixed(2)} | 
                    Total Tax: ${totalTax.toFixed(2)}
                  </TableCell>
                  <TableCell colSpan={3} className="text-right text-sm text-gray-500">
                    Invoice Total: ${grandTotal.toFixed(2)}
                  </TableCell>
                </TableRow>
              </TableFooter>
            )}
          </Table>
        </div>
      </div>

      {/* Action Buttons - Bottom Section */}
      <div className="flex-shrink-0 p-4 border-t bg-gray-50 dark:bg-gray-700">
        <div className="flex justify-end space-x-3">
          <Button variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            onClick={() => handleSubmit('draft')}
            variant="outline"
            disabled={!selectedCustomer || items.length === 0}
          >
            Save as Draft
          </Button>
          <Button
            onClick={() => handleSubmit('final')}
            disabled={!selectedCustomer || items.length === 0}
          >
            Save Invoice
          </Button>
        </div>
      </div>
    </div>
  );
};

export default InvoiceCreationForm;