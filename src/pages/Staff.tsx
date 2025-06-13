
import React from 'react';
import { UserCheck, Plus, Badge, Calendar } from 'lucide-react';
import SummaryCard from '../components/SummaryCard';
import { Button } from '@/components/ui/button';

const Staff = () => {
  const staffMembers = [
    { id: '1', name: 'Alice Johnson', role: 'Manager', department: 'Operations', startDate: '2023-01-15', status: 'Active' },
    { id: '2', name: 'Bob Wilson', role: 'Inventory Clerk', department: 'Warehouse', startDate: '2023-03-22', status: 'Active' },
    { id: '3', name: 'Carol Davis', role: 'Sales Associate', department: 'Sales', startDate: '2023-06-10', status: 'Active' },
    { id: '4', name: 'David Miller', role: 'Accountant', department: 'Finance', startDate: '2022-11-08', status: 'On Leave' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Staff</h1>
        <Button className="flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>Add Staff Member</span>
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SummaryCard
          title="Total Staff"
          value="12"
          icon={UserCheck}
          description="Active employees"
          color="blue"
        />
        <SummaryCard
          title="On Leave"
          value="2"
          icon={Calendar}
          description="Currently on leave"
          color="orange"
        />
        <SummaryCard
          title="New Hires"
          value="1"
          icon={Plus}
          description="This month"
          color="green"
        />
      </div>

      {/* Staff Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Start Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {staffMembers.map((staff) => (
                <tr key={staff.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                    {staff.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-300">
                    {staff.role}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-300">
                    {staff.department}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-300">
                    {staff.startDate}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-300">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      staff.status === 'Active' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                    }`}>
                      {staff.status}
                    </span>
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

export default Staff;