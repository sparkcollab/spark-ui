
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, Mail, Edit, Save, X, FileText, DollarSign, Ban, Calendar, User, Plus, Trash2, Package, Search } from 'lucide-react';
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

interface InvoiceItem {
  productName: string;
  lotCode: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  taxAmount: number;
  lineTotal: number;
}

interface InvoiceViewEditFormProps {
  invoice: Invoice | null;
  onSave: (invoice: Omit<Invoice, 'id'>) => void;
  onCancel: () => void;
}

const InvoiceViewEditForm = ({ invoice, onSave, onCancel }: InvoiceViewEditFormProps) => {
  const [editedInvoice, setEditedInvoice] = useState<Invoice | null>(null);
  const [items, setItems] = useState<InvoiceItem[]>([]);
  const [currentItem, setCurrentItem] = useState({
    productName: '',
    lotCode: '',
    quantity: 1,
    unitPrice: 0,
    availableQuantity: 0
  });

  // Mock products data (same as Create Invoice)
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

  useEffect(() => {
    if (invoice) {
      setEditedInvoice({ ...invoice });
      // Convert invoice items to editable format with calculated tax
      const editableItems = invoice.items.map(item => {
        const subtotal = item.quantity * item.unitPrice;
        const discount = 0; // Default discount
        const taxAmount = (subtotal - discount) * 0.13; // Fixed 13% tax
        const lineTotal = subtotal - discount + taxAmount;
        
        return {
          productName: item.productName,
          lotCode: item.lotCode,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          discount,
          taxAmount,
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

  const calculateLineItem = (quantity: number, unitPrice: number, discount: number) => {
    const subtotal = quantity * unitPrice;
    const adjustedSubtotal = subtotal - discount;
    const taxAmount = adjustedSubtotal * 0.13; // Fixed 13% tax rate
    const lineTotal = adjustedSubtotal + taxAmount;
    return { subtotal, taxAmount, lineTotal };
  };

  const addItemToInvoice = () => {
    if (currentItem.productName && currentItem.lotCode && currentItem.quantity > 0) {
      const { subtotal, taxAmount, lineTotal } = calculateLineItem(
        currentItem.quantity,
        currentItem.unitPrice,
        0 // default discount
      );
      
      const newItem: InvoiceItem = {
        productName: currentItem.productName,
        lotCode: currentItem.lotCode,
        quantity: currentItem.quantity,
        unitPrice: currentItem.unitPrice,
        discount: 0,
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
      updatedItems[index].discount
    );
    
    updatedItems[index].taxAmount = taxAmount;
    updatedItems[index].lineTotal = lineTotal;
    
    setItems(updatedItems);
  };

  const calculateTotals = () => {
    const totalSubtotal = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
    const totalDiscount = items.reduce((sum, item) => sum + item.discount, 0);
    const totalTax = items.reduce((sum, item) => sum + item.taxAmount, 0);
    const grandTotal = totalSubtotal - totalDiscount + totalTax;
    
    return { totalSubtotal, totalDiscount, totalTax, grandTotal };
  };

  const handleSave = (status?: 'draft' | 'final') => {
    const { totalSubtotal, totalTax, grandTotal } = calculateTotals();
    
    const updatedInvoice = {
      customerName: editedInvoice.customerName,
      customerContact: editedInvoice.customerContact,
      customerAddress: editedInvoice.customerAddress,
      date: editedInvoice.date,
      status: status || editedInvoice.status,
      paymentStatus: editedInvoice.paymentStatus,
      items: items.map(item => ({
        productName: item.productName,
        lotCode: item.lotCode,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        subtotal: item.quantity * item.unitPrice
      })),
      discount: 0,
      total: totalSubtotal,
      tax: totalTax,
      grandTotal
    };
    
    onSave(updatedInvoice);
  };

  const { totalSubtotal, totalDiscount, totalTax, grandTotal } = calculateTotals();

  const handleDownload = () => {
    console.log('Downloading invoice...');
  };

  const handleEmail = () => {
    console.log('Emailing invoice...');
  };

  const handleMarkAsPaid = () => {
    setEditedInvoice({
      ...editedInvoice,
      paymentStatus: 'paid'
    });
  };

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
            <Button onClick={handleDownload} size="sm" variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
            <Button onClick={handleEmail} size="sm" variant="outline">
              <Mail className="w-4 h-4 mr-2" />
              Email
            </Button>
            {invoice.paymentStatus !== 'paid' && (
              <Button onClick={handleMarkAsPaid} size="sm" className="bg-green-600 hover:bg-green-700">
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
                    <span>Discount ({invoice.discount}%):</span>
                    <span>-${((invoice.total * invoice.discount) / 100).toFixed(2)}</span>
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

      <TabsContent value="edit" className="h-[calc(100vh-120px)] flex flex-col">
        {/* Compact Header - Customer and Invoice Date in horizontal layout */}
        <div className="flex-shrink-0 p-3 border-b bg-gray-50 dark:bg-gray-800">
          <div className="grid grid-cols-2 gap-4">
            {/* Customer Information - Left Column */}
            <div>
              <Label className="text-xs font-semibold mb-1 block flex items-center">
                <User className="w-3 h-3 mr-1" />
                Customer Information
              </Label>
              
              <div className="bg-white dark:bg-gray-700 p-2 rounded border">
                <div className="space-y-1">
                  <Input
                    placeholder="Customer Name"
                    value={editedInvoice.customerName}
                    onChange={(e) => setEditedInvoice({
                      ...editedInvoice,
                      customerName: e.target.value
                    })}
                    className="text-xs h-7"
                  />
                  <Input
                    placeholder="Customer Contact"
                    value={editedInvoice.customerContact}
                    onChange={(e) => setEditedInvoice({
                      ...editedInvoice,
                      customerContact: e.target.value
                    })}
                    className="text-xs h-7"
                  />
                  <Textarea
                    placeholder="Customer Address"
                    value={editedInvoice.customerAddress}
                    onChange={(e) => setEditedInvoice({
                      ...editedInvoice,
                      customerAddress: e.target.value
                    })}
                    className="text-xs"
                    rows={2}
                  />
                </div>
              </div>
            </div>

            {/* Invoice Date - Right Column */}
            <div>
              <Label className="text-xs font-semibold mb-1 block flex items-center">
                <Calendar className="w-3 h-3 mr-1" />
                Invoice Date
              </Label>
              <div className="relative">
                <Calendar className="absolute left-2 top-2 h-3 w-3 text-gray-400" />
                <Input
                  type="date"
                  value={editedInvoice.date}
                  onChange={(e) => setEditedInvoice({
                    ...editedInvoice,
                    date: e.target.value
                  })}
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
                  <TableHead className="w-24">Product</TableHead>
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
                        <SelectValue placeholder="Select..." />
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
                                  <div>Received: {new Date(lot.receivedDate).toLocaleDateString()} | Supplier: {lot.supplier}</div>
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
      </TabsContent>
    </Tabs>
  );
};

export default InvoiceViewEditForm;
