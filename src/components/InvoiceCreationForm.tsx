
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Search, Trash2, Package, User, Calendar, DollarSign } from 'lucide-react';
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
  taxRate: number;
  lineTotal: number;
}

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
}

interface ProductLot {
  code: string;
  productName: string;
  supplier: string;
  receivedDate: string;
  availableQuantity: number;
  unitPrice: number;
  costPrice: number;
}

interface InvoiceData {
  customerName: string;
  customerContact: string;
  customerAddress: string;
  date: string;
  dueDate: string;
  paymentTerms: string;
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
  discountType: 'percentage' | 'amount';
  total: number;
  tax: number;
  grandTotal: number;
}

interface InvoiceCreationFormProps {
  onSave: (invoice: InvoiceData) => void;
  onCancel: () => void;
}

const InvoiceCreationForm = ({ onSave, onCancel }: InvoiceCreationFormProps) => {
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
  const [paymentTerms, setPaymentTerms] = useState('Net 30');
  const [selectedProduct, setSelectedProduct] = useState('');
  const [items, setItems] = useState<InvoiceItem[]>([]);
  const [selectedLots, setSelectedLots] = useState<Set<string>>(new Set());
  const [discount, setDiscount] = useState(0);
  const [discountType, setDiscountType] = useState<'percentage' | 'amount'>('percentage');

  // Mock data
  const mockCustomers: Customer[] = [
    { id: '1', name: 'Green Valley Market', email: 'orders@greenvalley.com', phone: '559-555-0123', address: '123 Market Street, Fresno, CA 93721' },
    { id: '2', name: 'Fresh Foods Co-op', email: 'purchasing@freshfoods.com', phone: '831-555-0456', address: '456 Organic Avenue, Salinas, CA 93901' },
    { id: '3', name: 'Corner Grocery', email: 'manager@cornergrocery.com', phone: '661-555-0789', address: '789 Main Street, Bakersfield, CA 93301' },
    { id: '4', name: 'Farm-to-Table Restaurant', email: 'chef@farmtotable.com', phone: '415-555-0321', address: '321 Culinary Lane, San Francisco, CA 94102' }
  ];

  const mockProductLots: ProductLot[] = [
    { code: 'GAL001', productName: 'Gala Apples', supplier: 'Mountain View Orchards', receivedDate: '2024-01-10', availableQuantity: 45, unitPrice: 3.50, costPrice: 2.20 },
    { code: 'GAL002', productName: 'Gala Apples', supplier: 'Valley Fresh Farms', receivedDate: '2024-01-15', availableQuantity: 28, unitPrice: 3.25, costPrice: 2.10 },
    { code: 'SPIN456', productName: 'Organic Baby Spinach', supplier: 'Green Valley Co-op', receivedDate: '2024-01-17', availableQuantity: 20, unitPrice: 6.99, costPrice: 4.50 },
    { code: 'TOM789', productName: 'Heirloom Tomatoes', supplier: 'Sunrise Farms', receivedDate: '2024-01-16', availableQuantity: 35, unitPrice: 5.50, costPrice: 3.80 },
    { code: 'TOM790', productName: 'Heirloom Tomatoes', supplier: 'Heritage Gardens', receivedDate: '2024-01-18', availableQuantity: 15, unitPrice: 6.25, costPrice: 4.20 },
    { code: 'POT123', productName: 'Russet Potatoes', supplier: 'Idaho Best Produce', receivedDate: '2024-01-08', availableQuantity: 120, unitPrice: 2.25, costPrice: 1.20 },
    { code: 'POT124', productName: 'Russet Potatoes', supplier: 'Local Harvest Co.', receivedDate: '2024-01-14', availableQuantity: 80, unitPrice: 2.10, costPrice: 1.15 },
    { code: 'KALE567', productName: 'Organic Kale', supplier: 'Organic Greens Ltd.', receivedDate: '2024-01-12', availableQuantity: 25, unitPrice: 5.99, costPrice: 3.50 },
    { code: 'BELL890', productName: 'Red Bell Peppers', supplier: 'Greenhouse Partners', receivedDate: '2024-01-15', availableQuantity: 40, unitPrice: 4.25, costPrice: 2.80 }
  ];

  const uniqueProducts = [...new Set(mockProductLots.map(lot => lot.productName))];
  const filteredLots = selectedProduct ? mockProductLots.filter(lot => lot.productName === selectedProduct) : [];

  const toggleLotSelection = (lotCode: string) => {
    const newSelection = new Set(selectedLots);
    if (newSelection.has(lotCode)) {
      newSelection.delete(lotCode);
    } else {
      newSelection.add(lotCode);
    }
    setSelectedLots(newSelection);
  };

  const addSelectedLotsToInvoice = () => {
    const lotsToAdd = mockProductLots.filter(lot => selectedLots.has(lot.code));
    const newItems = lotsToAdd.map(lot => ({
      productName: lot.productName,
      lotCode: lot.code,
      quantity: 1,
      unitPrice: lot.unitPrice,
      taxRate: 13,
      lineTotal: lot.unitPrice * 1.13
    }));
    
    setItems([...items, ...newItems]);
    setSelectedLots(new Set());
  };

  const updateItem = (index: number, field: keyof InvoiceItem, value: number) => {
    const updatedItems = [...items];
    (updatedItems[index] as any)[field] = value;
    
    if (field === 'quantity' || field === 'unitPrice' || field === 'taxRate') {
      const item = updatedItems[index];
      const subtotal = item.quantity * item.unitPrice;
      const taxAmount = subtotal * (item.taxRate / 100);
      item.lineTotal = subtotal + taxAmount;
    }
    
    setItems(updatedItems);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const calculateTotals = () => {
    const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
    const discountAmount = discountType === 'percentage' ? (subtotal * discount / 100) : discount;
    const adjustedSubtotal = subtotal - discountAmount;
    const taxTotal = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice * item.taxRate / 100), 0);
    const grandTotal = adjustedSubtotal + taxTotal;
    
    return { subtotal, discountAmount, taxTotal, grandTotal };
  };

  const handleSubmit = (status: 'draft' | 'final') => {
    if (!selectedCustomer || items.length === 0) return;
    
    const { subtotal, discountAmount, taxTotal, grandTotal } = calculateTotals();
    
    onSave({
      customerName: selectedCustomer.name,
      customerContact: selectedCustomer.email,
      customerAddress: selectedCustomer.address,
      date: invoiceDate,
      dueDate,
      paymentTerms,
      status,
      paymentStatus: 'unpaid',
      items: items.map(item => ({
        productName: item.productName,
        lotCode: item.lotCode,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        subtotal: item.quantity * item.unitPrice
      })),
      discount: discountAmount,
      discountType,
      total: subtotal,
      tax: taxTotal,
      grandTotal
    });
  };

  const { subtotal, discountAmount, taxTotal, grandTotal } = calculateTotals();

  return (
    <div className="h-[calc(100vh-80px)] flex">
      {/* Left Panel - Product & Customer Input */}
      <div className="w-1/2 border-r border-gray-200 dark:border-gray-700 flex flex-col">
        {/* Customer & Invoice Details Header */}
        <div className="flex-shrink-0 p-4 border-b bg-gray-50 dark:bg-gray-800">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <Label className="text-sm font-medium mb-2 block flex items-center">
                <User className="w-4 h-4 mr-1" />
                Customer
              </Label>
              <Select value={selectedCustomer?.id || ''} onValueChange={(value) => {
                const customer = mockCustomers.find(c => c.id === value);
                setSelectedCustomer(customer || null);
              }}>
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Select customer..." />
                </SelectTrigger>
                <SelectContent>
                  {mockCustomers.map(customer => (
                    <SelectItem key={customer.id} value={customer.id}>
                      <div>
                        <div className="font-medium">{customer.name}</div>
                        <div className="text-xs text-gray-500">{customer.email}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-sm font-medium mb-2 block flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                Invoice Date
              </Label>
              <Input
                type="date"
                value={invoiceDate}
                onChange={(e) => setInvoiceDate(e.target.value)}
                className="h-9"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium mb-2 block">Due Date</Label>
              <Input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="h-9"
              />
            </div>
            <div>
              <Label className="text-sm font-medium mb-2 block">Payment Terms</Label>
              <Select value={paymentTerms} onValueChange={setPaymentTerms}>
                <SelectTrigger className="h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Net 15">Net 15</SelectItem>
                  <SelectItem value="Net 30">Net 30</SelectItem>
                  <SelectItem value="Net 60">Net 60</SelectItem>
                  <SelectItem value="Due on Receipt">Due on Receipt</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Product & Lot Selection */}
        <div className="flex-1 p-4 overflow-hidden flex flex-col">
          <div className="mb-4">
            <Label className="text-sm font-medium mb-2 block flex items-center">
              <Package className="w-4 h-4 mr-1" />
              Select Product
            </Label>
            <Select value={selectedProduct} onValueChange={setSelectedProduct}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a product..." />
              </SelectTrigger>
              <SelectContent>
                {uniqueProducts.map(product => (
                  <SelectItem key={product} value={product}>{product}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedProduct && (
            <div className="flex-1 overflow-hidden flex flex-col">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-sm font-medium">Available Product Lots</h3>
                <Button 
                  onClick={addSelectedLotsToInvoice}
                  disabled={selectedLots.size === 0}
                  size="sm"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add to Invoice ({selectedLots.size})
                </Button>
              </div>
              
              <div className="flex-1 overflow-y-auto border rounded-lg">
                <Table>
                  <TableHeader className="sticky top-0 bg-white dark:bg-gray-800">
                    <TableRow>
                      <TableHead className="w-12"></TableHead>
                      <TableHead>Lot Code</TableHead>
                      <TableHead>Supplier</TableHead>
                      <TableHead>Received</TableHead>
                      <TableHead>Available</TableHead>
                      <TableHead>Unit Price</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLots.map(lot => (
                      <TableRow 
                        key={lot.code}
                        className={`cursor-pointer ${selectedLots.has(lot.code) ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}
                        onClick={() => toggleLotSelection(lot.code)}
                      >
                        <TableCell>
                          <input
                            type="checkbox"
                            checked={selectedLots.has(lot.code)}
                            onChange={() => toggleLotSelection(lot.code)}
                            className="rounded"
                          />
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{lot.code}</Badge>
                        </TableCell>
                        <TableCell className="text-sm">{lot.supplier}</TableCell>
                        <TableCell className="text-sm">{new Date(lot.receivedDate).toLocaleDateString()}</TableCell>
                        <TableCell className="text-sm font-medium">{lot.availableQuantity}</TableCell>
                        <TableCell className="text-sm font-medium">${lot.unitPrice.toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right Panel - Invoice Builder */}
      <div className="w-1/2 flex flex-col">
        {/* Invoice Line Items Table */}
        <div className="flex-1 p-4 overflow-hidden flex flex-col">
          <h3 className="text-lg font-medium mb-4 flex items-center">
            <DollarSign className="w-5 h-5 mr-2" />
            Invoice Items
          </h3>
          
          <div className="flex-1 overflow-y-auto border rounded-lg">
            <Table>
              <TableHeader className="sticky top-0 bg-white dark:bg-gray-800">
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Lot Details</TableHead>
                  <TableHead className="w-20">Qty</TableHead>
                  <TableHead className="w-24">Unit Price</TableHead>
                  <TableHead className="w-20">Tax %</TableHead>
                  <TableHead className="w-24">Line Total</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-12 text-gray-500">
                      <Package className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                      <p>No items added yet</p>
                      <p className="text-sm">Select products from the left panel to add them here</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  items.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{item.productName}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{item.lotCode}</Badge>
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 1)}
                          className="w-16 h-8"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          step="0.01"
                          value={item.unitPrice}
                          onChange={(e) => updateItem(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                          className="w-20 h-8"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          value={item.taxRate}
                          onChange={(e) => updateItem(index, 'taxRate', parseFloat(e.target.value) || 0)}
                          className="w-16 h-8"
                        />
                      </TableCell>
                      <TableCell className="font-medium text-green-600">
                        ${item.lineTotal.toFixed(2)}
                      </TableCell>
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
            </Table>
          </div>
        </div>

        {/* Invoice-Level Adjustments */}
        <div className="flex-shrink-0 p-4 border-t bg-gray-50 dark:bg-gray-800">
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label className="text-sm font-medium mb-2 block">Discount Type</Label>
                <Select value={discountType} onValueChange={(value: 'percentage' | 'amount') => setDiscountType(value)}>
                  <SelectTrigger className="h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Percentage (%)</SelectItem>
                    <SelectItem value="amount">Dollar Amount ($)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-sm font-medium mb-2 block">
                  Discount {discountType === 'percentage' ? '(%)' : '($)'}
                </Label>
                <Input
                  type="number"
                  min="0"
                  step={discountType === 'percentage' ? '1' : '0.01'}
                  value={discount}
                  onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                  className="h-9"
                />
              </div>
            </div>

            <div className="bg-white dark:bg-gray-700 p-4 rounded-lg space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal:</span>
                <span className="font-medium">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-red-600">
                <span>Discount:</span>
                <span>-${discountAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Tax Total:</span>
                <span className="font-medium">${taxTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-2 border-t font-bold text-lg">
                <span>Invoice Total:</span>
                <span className="text-green-600">${grandTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex-shrink-0 p-4 border-t">
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
    </div>
  );
};

export default InvoiceCreationForm;