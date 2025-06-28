import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, Mail, Save, FileText, DollarSign, Ban, Calendar, User, Plus, Trash2, Package } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface Invoice {
  id: string;
  customerName: string;
  customerContact: string;
  customerAddress: string;
  date: string;
  dueDate?: string;
  paymentTerms?: string;
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
  discountType?: 'percentage' | 'amount';
  total: number;
  tax: number;
  grandTotal: number;
}

interface InvoiceItem {
  productName: string;
  lotCode: string;
  quantity: number;
  unitPrice: number;
  taxRate: number;
  lineTotal: number;
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

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
}

interface InvoiceViewEditFormProps {
  invoice: Invoice | null;
  onSave: (invoice: Omit<Invoice, 'id'>) => void;
  onCancel: () => void;
}

const InvoiceViewEditForm = ({ invoice, onSave, onCancel }: InvoiceViewEditFormProps) => {
  const [editedInvoice, setEditedInvoice] = useState<Invoice | null>(null);
  const [items, setItems] = useState<InvoiceItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [selectedLots, setSelectedLots] = useState<Set<string>>(new Set());
  const [discount, setDiscount] = useState(0);
  const [discountType, setDiscountType] = useState<'percentage' | 'amount'>('percentage');

  // Mock data (same as Create Invoice)
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

  useEffect(() => {
    if (invoice) {
      setEditedInvoice({ ...invoice });
      setDiscount(invoice.discount || 0);
      setDiscountType(invoice.discountType || 'percentage');
      
      // Convert invoice items to editable format
      const editableItems = invoice.items.map(item => {
        const subtotal = item.quantity * item.unitPrice;
        const taxAmount = subtotal * 0.13; // Default 13% tax
        const lineTotal = subtotal + taxAmount;
        
        return {
          productName: item.productName,
          lotCode: item.lotCode,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          taxRate: 13,
          lineTotal
        };
      });
      setItems(editableItems);
    }
  }, [invoice]);

  if (!invoice || !editedInvoice) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center text-gray-500">
          <FileText className="w-12 h-12 mx-auto mb-3" />
          <p>No invoice selected</p>
        </div>
      </div>
    );
  }

  const selectedCustomer = mockCustomers.find(c => c.name === editedInvoice.customerName);

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

  const handleSave = (status?: 'draft' | 'final') => {
    const { subtotal, discountAmount, taxTotal, grandTotal } = calculateTotals();
    
    const updatedInvoice = {
      customerName: editedInvoice.customerName,
      customerContact: editedInvoice.customerContact,
      customerAddress: editedInvoice.customerAddress,
      date: editedInvoice.date,
      dueDate: editedInvoice.dueDate,
      paymentTerms: editedInvoice.paymentTerms,
      status: status || editedInvoice.status,
      paymentStatus: editedInvoice.paymentStatus,
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
    };
    
    onSave(updatedInvoice);
  };

  const { subtotal, discountAmount, taxTotal, grandTotal } = calculateTotals();

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge variant="default" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Paid</Badge>;
      case 'unpaid':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">Unpaid</Badge>;
      case 'overdue':
        return <Badge variant="destructive">Overdue</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'draft':
        return <Badge variant="secondary">Draft</Badge>;
      case 'final':
        return <Badge variant="default">Final</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const isEditable = editedInvoice.paymentStatus !== 'paid' && editedInvoice.status !== 'final';

  return (
    <Tabs defaultValue="view" className="w-full h-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="view">View Invoice</TabsTrigger>
        <TabsTrigger value="edit" disabled={!isEditable}>
          {isEditable ? 'Edit Invoice' : 'Edit (Locked)'}
        </TabsTrigger>
      </TabsList>

      <TabsContent value="view" className="space-y-6 h-full">
        {/* Header Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <FileText className="w-8 h-8 text-blue-600" />
            <div>
              <h2 className="text-2xl font-bold">INV-{invoice.id}</h2>
              <div className="flex items-center space-x-2 mt-1">
                {getStatusBadge(invoice.status)}
                {getPaymentStatusBadge(invoice.paymentStatus)}
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button onClick={() => console.log('Download')} size="sm" variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
            <Button onClick={() => console.log('Email')} size="sm" variant="outline">
              <Mail className="w-4 h-4 mr-2" />
              Email
            </Button>
            {invoice.paymentStatus !== 'paid' && (
              <Button onClick={() => console.log('Mark Paid')} size="sm" className="bg-green-600 hover:bg-green-700">
                <DollarSign className="w-4 h-4 mr-2" />
                Mark Paid
              </Button>
            )}
          </div>
        </div>

        {/* Invoice Preview */}
        <div className="bg-white dark:bg-gray-800 border rounded-lg p-8 shadow-sm">
          {/* Invoice Header */}
          <div className="flex justify-between items-start mb-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">FP</span>
                </div>
                <div>
                  <h1 className="text-2xl font-bold">Fresh Produce Co.</h1>
                  <p className="text-gray-600 dark:text-gray-400">Premium Farm-to-Table Products</p>
                </div>
              </div>
              <div className="text-gray-600 dark:text-gray-400">
                <p>456 Farm Market Road</p>
                <p>Fresno, CA 93721</p>
                <p>orders@freshproduce.com</p>
                <p>(559) 555-FARM</p>
              </div>
            </div>
            <div className="text-right">
              <h2 className="text-3xl font-bold mb-2 text-green-600">INVOICE</h2>
              <p className="text-gray-600 dark:text-gray-400">Invoice #: INV-{invoice.id}</p>
              <p className="text-gray-600 dark:text-gray-400 flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                Date: {invoice.date}
              </p>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-3 flex items-center">
              <User className="w-5 h-5 mr-2" />
              Bill To:
            </h3>
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <p className="font-medium text-lg">{invoice.customerName}</p>
              <p className="text-gray-600 dark:text-gray-400">{invoice.customerContact}</p>
              <p className="text-gray-600 dark:text-gray-400">{invoice.customerAddress}</p>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-3">Items</h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-200 dark:border-gray-700 rounded-lg">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-800">
                    <th className="border border-gray-200 dark:border-gray-700 px-4 py-3 text-left font-semibold">Product</th>
                    <th className="border border-gray-200 dark:border-gray-700 px-4 py-3 text-left font-semibold">Lot Code</th>
                    <th className="border border-gray-200 dark:border-gray-700 px-4 py-3 text-center font-semibold">Qty</th>
                    <th className="border border-gray-200 dark:border-gray-700 px-4 py-3 text-right font-semibold">Unit Price</th>
                    <th className="border border-gray-200 dark:border-gray-700 px-4 py-3 text-right font-semibold">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.items.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="border border-gray-200 dark:border-gray-700 px-4 py-3">
                        <div className="font-medium">{item.productName}</div>
                      </td>
                      <td className="border border-gray-200 dark:border-gray-700 px-4 py-3">
                        <Badge variant="outline">{item.lotCode}</Badge>
                      </td>
                      <td className="border border-gray-200 dark:border-gray-700 px-4 py-3 text-center font-medium">
                        {item.quantity}
                      </td>
                      <td className="border border-gray-200 dark:border-gray-700 px-4 py-3 text-right">
                        ${item.unitPrice.toFixed(2)}
                      </td>
                      <td className="border border-gray-200 dark:border-gray-700 px-4 py-3 text-right font-medium">
                        ${item.subtotal.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex justify-end">
            <div className="w-80">
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="font-medium">${invoice.total.toFixed(2)}</span>
                </div>
                {invoice.discount > 0 && (
                  <div className="flex justify-between text-red-600">
                    <span>Discount ({invoice.discountType === 'percentage' ? `${invoice.discount}%` : `$${invoice.discount.toFixed(2)}`}):</span>
                    <span>-${invoice.discountType === 'percentage' ? ((invoice.total * invoice.discount) / 100).toFixed(2) : invoice.discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Tax:</span>
                  <span className="font-medium">${invoice.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-2 border-t border-gray-200 dark:border-gray-600 font-bold text-xl">
                  <span>Total:</span>
                  <span className="text-green-600">${invoice.grandTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700 text-center">
            <p className="text-gray-500 dark:text-gray-400 mb-2">
              Thank you for choosing Fresh Produce Co.!
            </p>
            <p className="text-sm text-gray-400">
              Fresh products delivered daily • Quality guaranteed
            </p>
          </div>
        </div>

        <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Created on {invoice.date} • Status: {invoice.status} • Payment: {invoice.paymentStatus}
          </div>
          <div className="flex space-x-2">
            {invoice.paymentStatus !== 'paid' && invoice.status !== 'final' && (
              <Button variant="destructive" size="sm">
                <Ban className="w-4 h-4 mr-2" />
                Void Invoice
              </Button>
            )}
          </div>
        </div>
      </TabsContent>

      <TabsContent value="edit" className="h-[calc(100vh-120px)] flex">
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
                  if (customer && editedInvoice) {
                    setEditedInvoice({
                      ...editedInvoice,
                      customerName: customer.name,
                      customerContact: customer.email,
                      customerAddress: customer.address
                    });
                  }
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
                  value={editedInvoice.date}
                  onChange={(e) => setEditedInvoice({
                    ...editedInvoice,
                    date: e.target.value
                  })}
                  className="h-9"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium mb-2 block">Due Date</Label>
                <Input
                  type="date"
                  value={editedInvoice.dueDate || ''}
                  onChange={(e) => setEditedInvoice({
                    ...editedInvoice,
                    dueDate: e.target.value
                  })}
                  className="h-9"
                />
              </div>
              <div>
                <Label className="text-sm font-medium mb-2 block">Payment Terms</Label>
                <Select value={editedInvoice.paymentTerms || 'Net 30'} onValueChange={(value) => setEditedInvoice({
                  ...editedInvoice,
                  paymentTerms: value
                })}>
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
                onClick={() => handleSave('draft')}
                variant="outline"
                disabled={items.length === 0}
              >
                Save as Draft
              </Button>
              <Button
                onClick={() => handleSave()}
                disabled={items.length === 0}
              >
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default InvoiceViewEditForm;
