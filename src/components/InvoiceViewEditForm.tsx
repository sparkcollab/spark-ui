
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, Mail, Edit, Save, X, FileText, DollarSign, Ban, Calendar, User } from 'lucide-react';

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

interface InvoiceViewEditFormProps {
  invoice: Invoice | null;
  onSave: (invoice: Omit<Invoice, 'id'>) => void;
  onCancel: () => void;
}

const InvoiceViewEditForm = ({ invoice, onSave, onCancel }: InvoiceViewEditFormProps) => {
  const [editedInvoice, setEditedInvoice] = useState<Invoice | null>(null);

  useEffect(() => {
    if (invoice) {
      setEditedInvoice({ ...invoice });
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

  const handleSave = () => {
    const { id, ...invoiceData } = editedInvoice;
    onSave(invoiceData);
  };

  const handleDownload = () => {
    console.log('Downloading invoice...');
    // In a real app, this would generate and download a PDF
  };

  const handleEmail = () => {
    console.log('Emailing invoice...');
    // In a real app, this would open email composer or send email
  };

  const handleMarkAsPaid = () => {
    setEditedInvoice({
      ...editedInvoice,
      paymentStatus: 'paid'
    });
  };

  const handleVoidInvoice = () => {
    // In a real app, you might want to confirm this action
    console.log('Voiding invoice...');
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
    <Tabs defaultValue="view" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="view">View Invoice</TabsTrigger>
        <TabsTrigger value="edit" disabled={!isEditable}>
          {isEditable ? 'Edit Invoice' : 'Edit (Locked)'}
        </TabsTrigger>
      </TabsList>

      <TabsContent value="view" className="space-y-6">
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

          {/* Bill To */}
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

          {/* Items Table */}
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

          {/* Totals */}
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
                  <span>Tax (8.75%):</span>
                  <span className="font-medium">${invoice.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-2 border-t border-gray-200 dark:border-gray-600 font-bold text-xl">
                  <span>Total:</span>
                  <span className="text-green-600">${invoice.grandTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700 text-center">
            <p className="text-gray-500 dark:text-gray-400 mb-2">
              Thank you for choosing Fresh Produce Co.!
            </p>
            <p className="text-sm text-gray-400">
              Fresh products delivered daily • Quality guaranteed
            </p>
          </div>
        </div>

        {/* Invoice Actions */}
        <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Created on {invoice.date} • Status: {invoice.status} • Payment: {invoice.paymentStatus}
          </div>
          <div className="flex space-x-2">
            {invoice.paymentStatus !== 'paid' && invoice.status !== 'final' && (
              <Button onClick={handleVoidInvoice} variant="destructive" size="sm">
                <Ban className="w-4 h-4 mr-2" />
                Void Invoice
              </Button>
            )}
          </div>
        </div>
      </TabsContent>

      <TabsContent value="edit" className="space-y-6">
        {/* Edit Form */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium mb-2 block">Customer Name</Label>
              <Input
                value={editedInvoice.customerName}
                onChange={(e) => setEditedInvoice({
                  ...editedInvoice,
                  customerName: e.target.value
                })}
              />
            </div>
            <div>
              <Label className="text-sm font-medium mb-2 block">Customer Contact</Label>
              <Input
                value={editedInvoice.customerContact}
                onChange={(e) => setEditedInvoice({
                  ...editedInvoice,
                  customerContact: e.target.value
                })}
              />
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium mb-2 block">Customer Address</Label>
            <Textarea
              value={editedInvoice.customerAddress}
              onChange={(e) => setEditedInvoice({
                ...editedInvoice,
                customerAddress: e.target.value
              })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium mb-2 block">Date</Label>
              <Input
                type="date"
                value={editedInvoice.date}
                onChange={(e) => setEditedInvoice({
                  ...editedInvoice,
                  date: e.target.value
                })}
              />
            </div>
            <div>
              <Label className="text-sm font-medium mb-2 block">Discount (%)</Label>
              <Input
                type="number"
                min="0"
                max="100"
                value={editedInvoice.discount}
                onChange={(e) => {
                  const discount = parseFloat(e.target.value) || 0;
                  const subtotal = editedInvoice.items.reduce((sum, item) => sum + item.subtotal, 0);
                  const discountAmount = (subtotal * discount) / 100;
                  const total = subtotal - discountAmount;
                  const tax = total * 0.0875;
                  const grandTotal = total + tax;
                  
                  setEditedInvoice({
                    ...editedInvoice,
                    discount,
                    total,
                    tax,
                    grandTotal
                  });
                }}
              />
            </div>
          </div>

          {/* Items List (Read-only in edit mode for simplicity) */}
          <div>
            <Label className="text-sm font-medium mb-2 block">Invoice Items</Label>
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded border">
              {editedInvoice.items.map((item, index) => (
                <div key={index} className="flex justify-between items-center py-3 border-b last:border-b-0 border-gray-200 dark:border-gray-600">
                  <div>
                    <div className="font-medium">{item.productName}</div>
                    <div className="text-sm text-gray-500">Lot: {item.lotCode}</div>
                  </div>
                  <div className="text-right">
                    <div>{item.quantity} × ${item.unitPrice.toFixed(2)}</div>
                    <div className="font-medium">${item.subtotal.toFixed(2)}</div>
                  </div>
                </div>
              ))}
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                <div className="flex justify-between font-bold text-lg">
                  <span>Grand Total:</span>
                  <span className="text-green-600">${editedInvoice.grandTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2">
          <Button variant="outline" onClick={onCancel} className="flex-1">
            Cancel
          </Button>
          <Button onClick={handleSave} className="flex-1">
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default InvoiceViewEditForm;
