
import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import SummaryCard from '../components/SummaryCard';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Package, TrendingUp, AlertTriangle, DollarSign, Truck, RotateCcw } from 'lucide-react';

const Dashboard = () => {
  const [timePeriod, setTimePeriod] = useState('month');

  const inventoryMovementData = [
    { name: 'Jan', received: 120, dispatched: 89, returns: 5 },
    { name: 'Feb', received: 95, dispatched: 102, returns: 8 },
    { name: 'Mar', received: 140, dispatched: 125, returns: 3 },
    { name: 'Apr', received: 110, dispatched: 98, returns: 7 },
    { name: 'May', received: 85, dispatched: 115, returns: 12 },
    { name: 'Jun', received: 130, dispatched: 108, returns: 6 },
  ];

  const salesHistoryData = [
    { name: 'Jan', sales: 15420, invoices: 45 },
    { name: 'Feb', sales: 18300, invoices: 52 },
    { name: 'Mar', sales: 22100, invoices: 61 },
    { name: 'Apr', sales: 19800, invoices: 48 },
    { name: 'May', sales: 25600, invoices: 67 },
    { name: 'Jun', sales: 28900, invoices: 73 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <Select value={timePeriod} onValueChange={setTimePeriod}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Select time period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="month">This Month</SelectItem>
            <SelectItem value="quarter">This Quarter</SelectItem>
            <SelectItem value="year">This Year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Summary Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <SummaryCard
          title="Total Stock Items"
          value="1,247"
          icon={Package}
          description="Across all lots"
          color="blue"
        />
        <SummaryCard
          title="Monthly Sales"
          value="$28,900"
          icon={DollarSign}
          description="73 invoices this month"
          color="green"
        />
        <SummaryCard
          title="Items Dispatched"
          value="108"
          icon={Truck}
          description="This month"
          color="purple"
        />
        <SummaryCard
          title="Pending Returns"
          value="6"
          icon={RotateCcw}
          description="Awaiting processing"
          color="orange"
        />
        <SummaryCard
          title="Low Stock Alerts"
          value="12"
          icon={AlertTriangle}
          description="Items below minimum"
          color="orange"
        />
        <SummaryCard
          title="Sales Growth"
          value="+12.8%"
          icon={TrendingUp}
          description="vs last month"
          color="green"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Inventory Movements</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={inventoryMovementData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="received" fill="#10B981" name="Received" />
              <Bar dataKey="dispatched" fill="#3B82F6" name="Dispatched" />
              <Bar dataKey="returns" fill="#F59E0B" name="Returns" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Sales History</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={salesHistoryData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="sales" 
                stroke="#10B981" 
                strokeWidth={2}
                name="Sales Value ($)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;