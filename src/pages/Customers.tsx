
import React from 'react';
import { Users, Plus, Phone, Mail } from 'lucide-react';
import SummaryCard from '../components/SummaryCard';
import { Button } from '@/components/ui/button';

const Customers = () => {
  const customers = [
    { id: '1', name: 'ABC Restaurant', contact: 'John Smith', phone: '(555) 123-4567', email: 'john@abcrestaurant.com', totalOrders: 15 },
    { id: '2', name: 'Fresh Market Co.', contact: 'Sarah Johnson', phone: '(555) 987-6543', email: 'sarah@freshmarket.com', totalOrders: 8 },
    { id: '3', name: 'Green Grocers', contact: 'Mike Brown', phone: '(555) 456-7890', email: 'mike@greengrocers.com', totalOrders: 22 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Customers</h1>
        <Button className="flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>Add Customer</span>
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SummaryCard
          title="Total Customers"
          value="24"
          icon={Users}
          description="Active customers"
          color="blue"
        />
        <SummaryCard
          title="New This Month"
          value="3"
          icon={Plus}
          description="New customer signups"
          color="green"
        />
        <SummaryCard
          title="Average Orders"
          value="15.2"
          icon={Users}
          description="Orders per customer"
          color="purple"
        />
      </div>

      {/* Customers Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Customer Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Contact Person
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Phone
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Total Orders
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {customers.map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                    {customer.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-300">
                    {customer.contact}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-300">
                    <div className="flex items-center">
                      <Phone className="w-4 h-4 mr-2" />
                      {customer.phone}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-300">
                    <div className="flex items-center">
                      <Mail className="w-4 h-4 mr-2" />
                      {customer.email}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-300">
                    {customer.totalOrders}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Customers;
