import React, { useState } from 'react';
import { Plus, Eye, Edit, Trash2, FileText, DollarSign, FileCheck, Clock } from 'lucide-react';
import WorkOrderModal from '../components/WorkOrderModal';
import InvoicePreview from '../components/InvoicePreview';
import SummaryCard from '../components/SummaryCard';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

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

const Sales = () => {
  const { toast } = useToast();
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([
    {
      id: '1',
      clientName: 'ABC Company',
      clientContact: 'john@abc.com',
      clientAddress: '123 Business St, City, State 12345',
      date: '2024-01-15',
      status: 'final',
      items: [
        { productName: 'Wireless Headphones', quantity: 2, unitPrice: 129.99, subtotal: 259.98 },
        { productName: 'Coffee Mug', quantity: 5, unitPrice: 12.50, subtotal: 62.50 }
      ],
      total: 322.48,
      tax: 32.25,
      grandTotal: 354.73
    },
    {
      id: '2',
      clientName: 'XYZ Corp',
      clientContact: 'sarah@xyz.com',
      clientAddress: '456 Corporate Ave, City, State 67890',
      date: '2024-01-14',
      status: 'draft',
      items: [
        { productName: 'Notebook', quantity: 10, unitPrice: 8.99, subtotal: 89.90 }
      ],
      total: 89.90,
      tax: 8.99,
      grandTotal: 98.89
    }
  ]);

  const [isWorkOrderModalOpen, setIsWorkOrderModalOpen] = useState(false);
  const [isInvoicePreviewOpen, setIsInvoicePreviewOpen] = useState(false);
  const [editingWorkOrder, setEditingWorkOrder] = useState<WorkOrder | null>(null);
  const [previewingWorkOrder, setPreviewingWorkOrder] = useState<WorkOrder | null>(null);
  const [timeFilter, setTimeFilter] = useState('all');

  // Calculate summary data
  const totalSales = workOrders.reduce((sum, wo) => sum + wo.grandTotal, 0);
  const totalWorkOrders = workOrders.length;
  const pendingWorkOrders = workOrders.filter(wo => wo.status === 'draft').length;

  const handleAddWorkOrder = (workOrderData: Omit<WorkOrder, 'id'>) => {
    const newWorkOrder: WorkOrder = {
      ...workOrderData,
      id: Date.now().toString()
    };
    setWorkOrders([...workOrders, newWorkOrder]);
    toast({
      title: "Work Order Created",
      description: "Work order has been successfully created.",
    });
  };

  const handleEditWorkOrder = (workOrderData: Omit<WorkOrder, 'id'>) => {
    if (editingWorkOrder) {
      setWorkOrders(workOrders.map(wo => 
        wo.id === editingWorkOrder.id 
          ? { ...workOrderData, id: editingWorkOrder.id }
          : wo
      ));
      toast({
        title: "Work Order Updated",
        description: "Work order has been successfully updated.",
      });
    }
  };

  const handleDeleteWorkOrder = (id: string) => {
    setWorkOrders(workOrders.filter(wo => wo.id !== id));
    toast({
      title: "Work Order Deleted",
      description: "Work order has been removed.",
    });
  };

  const openEditModal = (workOrder: WorkOrder) => {
    setEditingWorkOrder(workOrder);
    setIsWorkOrderModalOpen(true);
  };

  const openInvoicePreview = (workOrder: WorkOrder) => {
    setPreviewingWorkOrder(workOrder);
    setIsInvoicePreviewOpen(true);
  };

  const closeModals = () => {
    setIsWorkOrderModalOpen(false);
    setIsInvoicePreviewOpen(false);
    setEditingWorkOrder(null);
    setPreviewingWorkOrder(null);
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = "px-2 py-1 text-xs font-medium rounded-full";
    switch (status) {
      case 'draft':
        return `${baseClasses} bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200`;
      case 'final':
        return `${baseClasses} bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200`;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Sales Management</h1>
        <Button onClick={() => setIsWorkOrderModalOpen(true)} className="flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>Create Work Order</span>
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SummaryCard
          title="Total Sales"
          value={`$${totalSales.toLocaleString()}`}
          icon={DollarSign}
          description="Revenue from all work orders"
          color="green"
        />
        <SummaryCard
          title="Total Work Orders"
          value={totalWorkOrders}
          icon={FileCheck}
          description="All work orders created"
          color="blue"
        />
        <SummaryCard
          title="Pending/Draft Orders"
          value={pendingWorkOrders}
          icon={Clock}
          description="Work orders awaiting completion"
          color="orange"
        />
      </div>

      {/* Filters */}
      <div className="flex justify-between items-center">
        <Select value={timeFilter} onValueChange={setTimeFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by time" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Time</SelectItem>
            <SelectItem value="week">This Week</SelectItem>
            <SelectItem value="month">This Month</SelectItem>
            <SelectItem value="quarter">This Quarter</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Work Orders Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Work Order #
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Client Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {workOrders.map((workOrder) => (
                <tr key={workOrder.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                    WO-{workOrder.id}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-300">
                    {workOrder.clientName}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-300">
                    {workOrder.date}
                  </td>
                  <td className="px-6 py-4">
                    <span className={getStatusBadge(workOrder.status)}>
                      {workOrder.status.charAt(0).toUpperCase() + workOrder.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-300">
                    ${workOrder.grandTotal.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium space-x-2">
                    <button
                      onClick={() => openInvoicePreview(workOrder)}
                      className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                      title="View"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => openEditModal(workOrder)}
                      className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                      title="Edit"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => openInvoicePreview(workOrder)}
                      className="text-purple-600 hover:text-purple-900 dark:text-purple-400 dark:hover:text-purple-300"
                      title="Generate Invoice"
                    >
                      <FileText className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteWorkOrder(workOrder.id)}
                      className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <WorkOrderModal
        isOpen={isWorkOrderModalOpen}
        onClose={closeModals}
        onSave={editingWorkOrder ? handleEditWorkOrder : handleAddWorkOrder}
        workOrder={editingWorkOrder}
      />

      <InvoicePreview
        isOpen={isInvoicePreviewOpen}
        onClose={closeModals}
        workOrder={previewingWorkOrder}
      />
    </div>
  );
};

export default Sales;
