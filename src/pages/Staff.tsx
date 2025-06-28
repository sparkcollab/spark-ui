
import React, { useState } from 'react';
import { UserCheck, Plus, Calendar, Clock, CheckCircle, XCircle } from 'lucide-react';
import SummaryCard from '../components/SummaryCard';
import StaffInviteModal from '@/components/StaffInviteModal';
import { Button } from '@/components/ui/button';

const Staff = () => {
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [staffMembers, setStaffMembers] = useState([
    { id: '1', name: 'Alice Johnson', role: 'Manager', department: 'Operations', email: 'alice@example.com', phone: '+1 (555) 123-4567', startDate: '2023-01-15', status: 'Active' },
    { id: '2', name: 'Bob Wilson', role: 'Inventory Clerk', department: 'Warehouse', email: 'bob@example.com', phone: '+1 (555) 234-5678', startDate: '2023-03-22', status: 'Active' },
    { id: '3', name: 'Carol Davis', role: 'Sales Associate', department: 'Sales', email: 'carol@example.com', phone: '+1 (555) 345-6789', startDate: '2023-06-10', status: 'Active' },
    { id: '4', name: 'David Miller', role: 'Accountant', department: 'Finance', email: 'david@example.com', phone: '+1 (555) 456-7890', startDate: '2022-11-08', status: 'On Leave' },
  ]);

  const handleInviteSent = (newStaffMember: any) => {
    setStaffMembers(prev => [...prev, newStaffMember]);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Active':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'Pending':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'On Leave':
        return <XCircle className="w-4 h-4 text-orange-600" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'On Leave':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const pendingInvites = staffMembers.filter(member => member.status === 'Pending').length;
  const activeStaff = staffMembers.filter(member => member.status === 'Active').length;
  const onLeave = staffMembers.filter(member => member.status === 'On Leave').length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Staff</h1>
        <Button 
          className="flex items-center space-x-2"
          onClick={() => setIsInviteModalOpen(true)}
        >
          <Plus className="w-4 h-4" />
          <span>Invite Staff Member</span>
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <SummaryCard
          title="Total Staff"
          value={staffMembers.length.toString()}
          icon={UserCheck}
          description="All team members"
          color="blue"
        />
        <SummaryCard
          title="Active"
          value={activeStaff.toString()}
          icon={CheckCircle}
          description="Currently active"
          color="green"
        />
        <SummaryCard
          title="Pending Invites"
          value={pendingInvites.toString()}
          icon={Clock}
          description="Awaiting acceptance"
          color="yellow"
        />
        <SummaryCard
          title="On Leave"
          value={onLeave.toString()}
          icon={Calendar}
          description="Currently on leave"
          color="orange"
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
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {staffMembers.map((staff) => (
                <tr key={staff.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {staff.name}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-500 dark:text-gray-300">
                      <div>{staff.email}</div>
                      {staff.phone && <div className="text-xs">{staff.phone}</div>}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-300">
                    <div>{staff.role}</div>
                    {staff.department && <div className="text-xs">{staff.department}</div>}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-300">
                    {staff.status === 'Pending' ? staff.startDate : staff.startDate}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center space-x-1 px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(staff.status)}`}>
                      {getStatusIcon(staff.status)}
                      <span>{staff.status}</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <StaffInviteModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        onInviteSent={handleInviteSent}
      />
    </div>
  );
};

export default Staff;