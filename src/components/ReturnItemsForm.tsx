
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Trash2, Package, FileText } from 'lucide-react';

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

interface ReturnItem {
  productName: string;
  lotCode: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

interface ReturnData {
  invoiceId: string;
  clientName: string;
  returnDate: string;
  returnType: 'full' | 'partial';
  items: ReturnItem[];
  total: number;
  reason: string;
}

interface ReturnItemsFormProps {
  invoices: Invoice[];
  onSave: (returnData: ReturnData) => void;
  onCancel: () => void;
}

const ReturnItemsForm = ({ invoices, onSave, onCancel }: ReturnItemsFormProps) => {
  const [selectedInvoiceId, setSelectedInvoiceId] = useState('');
  const [returnItems, setReturnItems] = useState<ReturnItem[]>([]);
  const [reason, setReason] = useState('');
  const [reasonCategory, setReasonCategory] = useState('');
  const [invoiceSearch, setInvoiceSearch] = useState('');

  const selectedInvoice = invoices.find(inv => inv.id === selectedInvoiceId);
  
  const filteredInvoices = invoices.filter(invoice =>
    invoice.customerName.toLowerCase().includes(invoiceSearch.toLowerCase()) ||
    invoice.id.includes(invoiceSearch) ||
    invoice.customerContact.toLowerCase().includes(invoiceSearch.toLowerCase())
  );

  const reasonOptions = [
    { value: 'spoiled', label: 'Spoiled/Damaged Product' },
    { value: 'wrong_item', label: 'Wrong Item Delivered' },
    { value: 'customer_canceled', label: 'Customer Canceled Order' },
    { value: 'quality_issue', label: 'Quality Not as Expected' },
    { value: 'overripe', label: 'Product Overripe' },
    { value: 'other', label: 'Other' }
  ];

  const handleSelectInvoice = (invoiceId: string) => {
    setSelectedInvoiceId(invoiceId);
    setReturnItems([]);
    setInvoiceSearch('');
    setReason('');
    setReasonCategory('');
  };

  const handleReturnQuantityChange = (itemIndex: number, returnQuantity: number) => {
    const originalItem = selectedInvoice?.items[itemIndex];
    if (!originalItem || returnQuantity <= 0) {
      // Remove item from returns if quantity is 0
      setReturnItems(returnItems.filter(item => 
        !(item.productName === originalItem.productName && item.lotCode === originalItem.lotCode)
      ));
      return;
    }

    const existingIndex = returnItems.findIndex(item => 
      item.productName === originalItem.productName && item.lotCode === originalItem.lotCode
    );

    const newReturnItem: ReturnItem = {
      productName: originalItem.productName,
      lotCode: originalItem.lotCode,
      quantity: Math.min(returnQuantity, originalItem.quantity),
      unitPrice: originalItem.unitPrice,
      subtotal: Math.min(returnQuantity, originalItem.quantity) * originalItem.unitPrice
    };

    if (existingIndex >= 0) {
      const updated = [...returnItems];
      updated[existingIndex] = newReturnItem;
      setReturnItems(updated);
    } else {
      setReturnItems([...returnItems, newReturnItem]);
    }
  };

  const removeReturnItem = (index: number) => {
    setReturnItems(returnItems.filter((_, i) => i !== index));
  };

  const calculateTotal = () => {
    return returnItems.reduce((sum, item) => sum + item.subtotal, 0);
  };

  const getReturnQuantity = (productName: string, lotCode: string) => {
    const returnItem = returnItems.find(item => 
      item.productName === productName && item.lotCode === lotCode
    );
    return returnItem?.quantity || 0;
  };

  const handleSubmit = () => {
    if (!selectedInvoice || returnItems.length === 0 || !reasonCategory) return;

    const returnType: 'full' | 'partial' = returnItems.length === selectedInvoice.items.length && 
      returnItems.every((returnItem, index) => returnItem.quantity === selectedInvoice.items[index].quantity) 
      ? 'full' : 'partial';

    onSave({
      invoiceId: `INV-${selectedInvoice.id}`,
      clientName: selectedInvoice.customerName,
      returnDate: new Date().toISOString().split('T')[0],
      returnType,
      items: returnItems,
      total: calculateTotal(),
      reason: `${reasonOptions.find(r => r.value === reasonCategory)?.label}${reason ? ': ' + reason : ''}`
    });
  };

  return (
    <div className="space-y-6 max-h-[calc(100vh-120px)] overflow-y-auto">
      {/* Invoice Selection */}
      <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
        <Label className="text-lg font-semibold mb-3 block">Select Invoice for Return</Label>
        
        {!selectedInvoice ? (
          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by invoice ID, customer name, or email..."
                value={invoiceSearch}
                onChange={(e) => setInvoiceSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            
            {invoiceSearch && (
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {filteredInvoices.map(invoice => (
                  <div
                    key={invoice.id}
                    onClick={() => handleSelectInvoice(invoice.id)}
                    className="p-4 bg-white dark:bg-gray-800 rounded border cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium flex items-center">
                          <FileText className="w-4 h-4 mr-2" />
                          INV-{invoice.id}
                        </div>
                        <div className="text-sm text-gray-500">{invoice.customerName}</div>
                        <div className="text-sm text-gray-500">{invoice.date}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">${invoice.grandTotal.toFixed(2)}</div>
                        <div className="text-sm text-gray-500">{invoice.items.length} items</div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {filteredInvoices.length === 0 && (
                  <div className="text-center text-gray-500 py-8">
                    No invoices found matching your search
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 p-4 rounded border">
            <div className="flex justify-between items-start">
              <div>
                <div className="font-semibold text-lg flex items-center">
                  <FileText className="w-5 h-5 mr-2" />
                  INV-{selectedInvoice.id}
                </div>
                <div className="text-gray-600 dark:text-gray-300">{selectedInvoice.customerName}</div>
                <div className="text-gray-600 dark:text-gray-300">{selectedInvoice.customerContact}</div>
                <div className="text-sm text-gray-500 mt-1">Date: {selectedInvoice.date}</div>
                <div className="text-sm text-gray-500">Total: ${selectedInvoice.grandTotal.toFixed(2)}</div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSelectedInvoiceId('');
                  setReturnItems([]);
                  setReason('');
                  setReasonCategory('');
                }}
              >
                Change
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Items to Return */}
      {selectedInvoice && (
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
          <Label className="text-lg font-semibold mb-3 block">Select Items to Return</Label>
          
          <div className="space-y-3">
            {selectedInvoice.items.map((item, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 p-4 rounded border">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="font-medium flex items-center">
                      <Package className="w-4 h-4 mr-2" />
                      {item.productName}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      Lot: {item.lotCode} • Original Qty: {item.quantity} • ${item.unitPrice.toFixed(2)} each
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      Item Total: ${item.subtotal.toFixed(2)}
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <Label className="text-sm mb-1 block">Return Qty:</Label>
                      <Input
                        type="number"
                        min="0"
                        max={item.quantity}
                        value={getReturnQuantity(item.productName, item.lotCode)}
                        onChange={(e) => {
                          const qty = parseInt(e.target.value) || 0;
                          handleReturnQuantityChange(index, qty);
                        }}
                        className="w-20"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Return Items Summary */}
      {returnItems.length > 0 && (
        <div className="bg-white dark:bg-gray-800 p-4 rounded border">
          <Label className="font-semibold text-lg mb-3 block">Items Being Returned ({returnItems.length})</Label>
          <div className="space-y-3">
            {returnItems.map((item, index) => (
              <div key={index} className="bg-gray-50 dark:bg-gray-700 p-3 rounded">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="font-medium">{item.productName}</div>
                    <div className="text-sm text-gray-500">Lot: {item.lotCode}</div>
                    <div className="text-sm">
                      Quantity: {item.quantity} × ${item.unitPrice.toFixed(2)}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">${item.subtotal.toFixed(2)}</span>
                    <button
                      onClick={() => removeReturnItem(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Return Total */}
            <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded border border-green-200 dark:border-green-800">
              <div className="flex justify-between font-bold text-lg">
                <span>Return Total:</span>
                <span className="text-green-600 dark:text-green-400">${calculateTotal().toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Return Reason */}
      {returnItems.length > 0 && (
        <div className="space-y-3">
          <Label className="text-sm font-medium">Reason for Return</Label>
          <Select value={reasonCategory} onValueChange={setReasonCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Select reason category..." />
            </SelectTrigger>
            <SelectContent>
              {reasonOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <div>
            <Label className="text-sm font-medium mb-2 block">Additional Details (Optional)</Label>
            <Textarea
              placeholder="Add any additional details about the return..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
            />
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex space-x-2 pt-4 border-t">
        <Button variant="outline" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          className="flex-1"
          disabled={!selectedInvoice || returnItems.length === 0 || !reasonCategory}
        >
          Process Return
        </Button>
      </div>
    </div>
  );
};

export default ReturnItemsForm;