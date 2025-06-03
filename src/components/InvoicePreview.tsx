
import React from 'react';
import { X, Download, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface WorkOrder {
  id: string;
  clientName: string;
  clientContact: string;
  clientAddress: string;
  date: string;
  status: 'draft' | 'final';
  items: Array<{
    productName: string;
    quantity: number;
    unitPrice: number;
    subtotal: number;
  }>;
  total: number;
  tax: number;
  grandTotal: number;
}

interface InvoicePreviewProps {
  isOpen: boolean;
  onClose: () => void;
  workOrder: WorkOrder | null;
}

const InvoicePreview = ({ isOpen, onClose, workOrder }: InvoicePreviewProps) => {
  if (!isOpen || !workOrder) return null;

  const handleDownload = () => {
    // Placeholder for PDF download
    console.log('Downloading invoice...');
  };

  const handleEmail = () => {
    // Placeholder for email functionality
    console.log('Emailing invoice...');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Invoice Preview</h2>
          <div className="flex items-center space-x-2">
            <Button onClick={handleDownload} size="sm" className="flex items-center space-x-2">
              <Download className="w-4 h-4" />
              <span>Download PDF</span>
            </Button>
            <Button onClick={handleEmail} size="sm" variant="outline" className="flex items-center space-x-2">
              <Mail className="w-4 h-4" />
              <span>Email</span>
            </Button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-8 bg-white dark:bg-gray-900">
          {/* Invoice Header */}
          <div className="flex justify-between items-start mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">PP</span>
                </div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">ProfitPulse</h1>
              </div>
              <div className="text-gray-600 dark:text-gray-400">
                <p>123 Business Street</p>
                <p>City, State 12345</p>
                <p>contact@profitpulse.com</p>
              </div>
            </div>
            <div className="text-right">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">INVOICE</h2>
              <p className="text-gray-600 dark:text-gray-400">Invoice #: INV-{workOrder.id}</p>
              <p className="text-gray-600 dark:text-gray-400">Date: {workOrder.date}</p>
            </div>
          </div>

          {/* Bill To */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Bill To:</h3>
            <div className="text-gray-600 dark:text-gray-400">
              <p className="font-medium">{workOrder.clientName}</p>
              <p>{workOrder.clientContact}</p>
              <p>{workOrder.clientAddress}</p>
            </div>
          </div>

          {/* Items Table */}
          <div className="mb-8">
            <table className="w-full border-collapse border border-gray-200 dark:border-gray-700">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-800">
                  <th className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-left">Item</th>
                  <th className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-center">Qty</th>
                  <th className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-right">Unit Price</th>
                  <th className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {workOrder.items.map((item, index) => (
                  <tr key={index}>
                    <td className="border border-gray-200 dark:border-gray-700 px-4 py-2">{item.productName}</td>
                    <td className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-center">{item.quantity}</td>
                    <td className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-right">${item.unitPrice.toFixed(2)}</td>
                    <td className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-right">${item.subtotal.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="flex justify-end">
            <div className="w-64">
              <div className="flex justify-between py-2">
                <span>Subtotal:</span>
                <span>${workOrder.total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-2">
                <span>Tax (10%):</span>
                <span>${workOrder.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-2 border-t border-gray-200 dark:border-gray-700 font-bold text-lg">
                <span>Total:</span>
                <span>${workOrder.grandTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
            <p className="text-center text-gray-500 dark:text-gray-400">
              Thank you for your business!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoicePreview;