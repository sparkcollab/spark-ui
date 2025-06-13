import React, { useState } from 'react';
import { Plus, Eye, Edit, Trash2, FileText, DollarSign, FileCheck, Clock, MoreVertical, Download, Copy, CheckCircle, XCircle, Search, Calendar } from 'lucide-react';
import SummaryCard from '../components/SummaryCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { useToast } from '@/hooks/use-toast';
import InvoiceCreationForm from '../components/InvoiceCreationForm';
import ReturnItemsForm from '../components/ReturnItemsForm';
import InvoiceViewEditForm from '../components/InvoiceViewEditForm';

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

interface Return {
  id: string;
  invoiceId: string;
  clientName: string;
  returnDate: string;
  returnType: 'full' | 'partial';
  items: Array<{
    productName: string;
    quantity: number;
    unitPrice: number;
    subtotal: number;
  }>;
  total: number;
  reason: string;
}

const Sales = () => {
  const { toast } = useToast();
  const [invoices, setInvoices] = useState<Invoice[]>([
    {
      id: '1001',
      customerName: 'Green Valley Market',
      customerContact: 'orders@greenvalley.com',
      customerAddress: '123 Market Street, Fresno, CA 93721',
      date: '2024-01-15',
      status: 'final',
      paymentStatus: 'paid',
      items: [
        { productName: 'Gala Apples', lotCode: 'GAL001', quantity: 25, unitPrice: 3.50, subtotal: 87.50 },
        { productName: 'Organic Kale', lotCode: 'KALE456', quantity: 8, unitPrice: 6.99, subtotal: 55.92 }
      ],
      discount: 0,
      total: 143.42,
      tax: 12.55,
      grandTotal: 155.97
    },
    {
      id: '1002',
      customerName: 'Fresh Foods Co-op',
      customerContact: 'purchasing@freshfoods.com',
      customerAddress: '456 Organic Avenue, Salinas, CA 93901',
      date: '2024-01-14',
      status: 'draft',
      paymentStatus: 'unpaid',
      items: [
        { productName: 'Roma Tomatoes', lotCode: 'TOM123', quantity: 15, unitPrice: 5.50, subtotal: 82.50 }
      ],
      discount: 5,
      total: 82.50,
      tax: 7.22,
      grandTotal: 89.72
    },
    {
      id: '1003',
      customerName: 'Corner Grocery',
      customerContact: 'manager@cornergrocery.com',
      customerAddress: '789 Main Street, Bakersfield, CA 93301',
      date: '2024-01-10',
      status: 'final',
      paymentStatus: 'overdue',
      items: [
        { productName: 'Russet Potatoes', lotCode: 'POT789', quantity: 50, unitPrice: 2.25, subtotal: 112.50 }
      ],
      discount: 0,
      total: 112.50,
      tax: 9.84,
      grandTotal: 122.34
    }
  ]);

  const [returns, setReturns] = useState<Return[]>([
    {
      id: '1',
      invoiceId: 'INV-1001',
      clientName: 'Green Valley Market',
      returnDate: '2024-01-16',
      returnType: 'partial',
      items: [
        { productName: 'Gala Apples', quantity: 3, unitPrice: 3.50, subtotal: 10.50 }
      ],
      total: 10.50,
      reason: 'Spoiled/Damaged Product'
    }
  ]);

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerAction, setDrawerAction] = useState<'create' | 'edit' | 'return' | null>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState({
    from: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    to: new Date().toISOString().split('T')[0]
  });

  // Calculate summary data
  const totalSales = invoices.reduce((sum, inv) => sum + inv.grandTotal, 0);
  const totalInvoices = invoices.length;
  const pendingInvoices = invoices.filter(inv => inv.status === 'draft').length;
  const unpaidInvoices = invoices.filter(inv => inv.paymentStatus === 'unpaid' || inv.paymentStatus === 'overdue').length;

  // Filter invoices based on search and date range
  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = searchTerm === '' || 
      invoice.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.customerContact.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.items.some(item => 
        item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.lotCode.toLowerCase().includes(searchTerm.toLowerCase())
      );
    
    const matchesDateRange = invoice.date >= dateRange.from && invoice.date <= dateRange.to;
    
    return matchesSearch && matchesDateRange;
  });

  const openDrawer = (action: 'create' | 'edit' | 'return', invoice?: Invoice) => {
    setDrawerAction(action);
    setSelectedInvoice(invoice || null);
    setIsDrawerOpen(true);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
    setDrawerAction(null);
    setSelectedInvoice(null);
  };

  const handleMarkAsPaid = (invoiceId: string) => {
    setInvoices(invoices.map(inv => 
      inv.id === invoiceId 
        ? { ...inv, paymentStatus: 'paid' as const }
        : inv
    ));
    toast({
      title: "Payment Status Updated",
      description: "Invoice has been marked as paid.",
    });
  };

  const handleDuplicate = (invoice: Invoice) => {
    const newInvoice: Invoice = {
      ...invoice,
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      status: 'draft',
      paymentStatus: 'unpaid'
    };
    setInvoices([...invoices, newInvoice]);
    toast({
      title: "Invoice Duplicated",
      description: "A copy of the invoice has been created as a draft.",
    });
  };

  const handleVoidInvoice = (invoiceId: string) => {
    setInvoices(invoices.filter(inv => inv.id !== invoiceId));
    toast({
      title: "Invoice Voided",
      description: "Invoice has been voided and removed.",
    });
  };

  const handleDownload = (invoice: Invoice) => {
    toast({
      title: "Download Started",
      description: `Invoice ${invoice.id} is being downloaded.`,
    });
  };

  const handleSaveInvoice = (invoiceData: Omit<Invoice, 'id'>) => {
    if (selectedInvoice) {
      setInvoices(invoices.map(inv => 
        inv.id === selectedInvoice.id 
          ? { ...invoiceData, id: selectedInvoice.id }
          : inv
      ));
      toast({
        title: "Invoice Updated",
        description: "Invoice has been successfully updated.",
      });
    } else {
      const newInvoice: Invoice = {
        ...invoiceData,
        id: Date.now().toString(),
      };
      setInvoices([...invoices, newInvoice]);
      toast({
        title: "Invoice Created",
        description: "New invoice has been successfully created.",
      });
    }
    closeDrawer();
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
    const baseClasses = "px-2 py-1 text-xs font-medium rounded-full";
    switch (status) {
      case 'draft':
        return `${baseClasses} bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200`;
      case 'final':
        return `${baseClasses} bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200`;
    }
  };

  const renderDrawerContent = () => {
    switch (drawerAction) {
      case 'create':
        return <InvoiceCreationForm onSave={handleSaveInvoice} onCancel={closeDrawer} />;
      case 'edit':
        return <InvoiceViewEditForm invoice={selectedInvoice} onSave={handleSaveInvoice} onCancel={closeDrawer} />;
      case 'return':
        return <ReturnItemsForm invoices={invoices} onSave={(returnData) => {
          setReturns([...returns, { ...returnData, id: Date.now().toString() }]);
          closeDrawer();
          toast({
            title: "Return Processed",
            description: "Return has been successfully processed.",
          });
        }} onCancel={closeDrawer} />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Sales</h1>
        <div className="flex gap-3">
          <Button onClick={() => openDrawer('return')} variant="outline" size="lg">
            <FileText className="w-5 h-5 mr-2" />
            Return Items
          </Button>
          <Button onClick={() => openDrawer('create')} size="lg">
            <Plus className="w-5 h-5 mr-2" />
            Create Invoice
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <SummaryCard
          title="Total Sales"
          value={`$${totalSales.toLocaleString()}`}
          icon={DollarSign}
          description="Revenue from all invoices"
          color="green"
        />
        <SummaryCard
          title="Total Invoices"
          value={totalInvoices}
          icon={FileCheck}
          description="All invoices created"
          color="blue"
        />
        <SummaryCard
          title="Draft Invoices"
          value={pendingInvoices}
          icon={Clock}
          description="Invoices awaiting finalization"
          color="orange"
        />
        <SummaryCard
          title="Unpaid Invoices"
          value={unpaidInvoices}
          icon={FileText}
          description="Invoices pending payment"
          color="purple"
        />
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search invoices, customers, products, or lot numbers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          {/* Date Range */}
          <div className="flex gap-2">
            <div className="relative">
              <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                type="date"
                value={dateRange.from}
                onChange={(e) => setDateRange({...dateRange, from: e.target.value})}
                className="pl-10"
              />
            </div>
            <span className="flex items-center text-gray-500">to</span>
            <div className="relative">
              <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                type="date"
                value={dateRange.to}
                onChange={(e) => setDateRange({...dateRange, to: e.target.value})}
                className="pl-10"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice #</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead className="w-16">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredInvoices.map((invoice) => (
              <TableRow key={invoice.id}>
                <TableCell className="font-medium">INV-{invoice.id}</TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">{invoice.customerName}</div>
                    <div className="text-sm text-muted-foreground">{invoice.customerContact}</div>
                  </div>
                </TableCell>
                <TableCell>{invoice.date}</TableCell>
                <TableCell>
                  <span className={getStatusBadge(invoice.status)}>
                    {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                  </span>
                </TableCell>
                <TableCell>{getPaymentStatusBadge(invoice.paymentStatus)}</TableCell>
                <TableCell className="font-medium">${invoice.grandTotal.toFixed(2)}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem onClick={() => openDrawer('edit', invoice)}>
                        <Eye className="w-4 h-4 mr-2" />
                        View / Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDownload(invoice)}>
                        <Download className="w-4 h-4 mr-2" />
                        Download Invoice
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => openDrawer('return', invoice)}>
                        <FileText className="w-4 h-4 mr-2" />
                        Return Items
                      </DropdownMenuItem>
                      {invoice.paymentStatus !== 'paid' && (
                        <DropdownMenuItem onClick={() => handleMarkAsPaid(invoice.id)}>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Mark as Paid
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem onClick={() => handleDuplicate(invoice)}>
                        <Copy className="w-4 h-4 mr-2" />
                        Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleVoidInvoice(invoice.id)}
                        className="text-red-600 dark:text-red-400"
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Void Invoice
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Right Drawer */}
      <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <SheetContent className="w-full sm:max-w-6xl">
          <SheetHeader>
            <SheetTitle>
              {drawerAction === 'create' && 'Create New Invoice'}
              {drawerAction === 'edit' && 'View / Edit Invoice'}
              {drawerAction === 'return' && 'Process Return'}
            </SheetTitle>
          </SheetHeader>
          <div className="mt-6">
            {renderDrawerContent()}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default Sales;