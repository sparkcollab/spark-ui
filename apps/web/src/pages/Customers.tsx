import {
  Users,
  Plus,
  Phone,
  Mail,
  CheckCircle,
  XCircle,
  EditIcon,
  Trash2,
} from "lucide-react";
import SummaryCard from "../components/SummaryCard";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import AddCustomer from "@/components/customer/AddCustomer";
import { Customer, CustomerResponse } from "@/types/Customer";
import { useCustomerStore } from "@/store/useCustomerStore";
import UpdateCustomer from "@/components/customer/UpdateCustomer";
import CustomerDeleteModal from "@/components/customer/DeleteCustomer";

const Customers = () => {
  const [isAddCustomer, setIsAddCustomer] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState<{
    open: boolean;
    data: CustomerResponse | null;
  }>({ open: false, data: null });
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<{
    open: boolean;
    data: CustomerResponse | null;
  }>({ open: false, data: null });
  const {
    customers,
    postCustomer,
    fetchCustomers,
    updateCustomer,
    deleteCustomer,
  } = useCustomerStore();

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const handleAddCustomer = () => {
    setIsAddCustomer(true);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Active":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "Inactive":
        return <XCircle className="w-4 h-4 text-orange-600" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "Pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "Inactive":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const handleCustomerAdded = (customerData: Customer) => {
    postCustomer(customerData);
  };

  const handleUpdatedCustomer = (customerData: Customer) => {
    updateCustomer(isUpdateModalOpen.data?.id || "", customerData);
  };

  const handleDeleteCustomer = (id: string) => {
    deleteCustomer(id);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Customers
        </h1>
        <Button
          className="flex items-center space-x-2"
          onClick={handleAddCustomer}
        >
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
                  Address
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Phone
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Kind
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {customers.map((customer) => (
                <tr
                  key={customer.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                    {customer.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-300">
                    {customer.address}
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
                    {customer.kind}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center space-x-1 px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                        customer.active ? "Active" : "Inactive"
                      )}`}
                    >
                      {getStatusIcon(customer.active ? "Active" : "Inactive")}
                      <span>{customer.active ? "Active" : "Inactive"}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center space-x-1 px-2 py-1 text-xs">
                      <EditIcon
                        className="w-4 h-4 text-gray-500 dark:text-gray-300 cursor-pointer"
                        onClick={() =>
                          setIsUpdateModalOpen({ open: true, data: customer })
                        }
                      />
                      <Trash2
                        className="w-4 h-4 text-red-500 dark:text-red-400 cursor-pointer"
                        onClick={() =>
                          setIsDeleteModalOpen({ open: true, data: customer })
                        }
                      />
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <AddCustomer
        isOpen={isAddCustomer}
        onClose={() => setIsAddCustomer(false)}
        onCustomerAdd={handleCustomerAdded}
      />
      <UpdateCustomer
        isOpen={isUpdateModalOpen.open}
        customerData={isUpdateModalOpen.data}
        onClose={() => setIsUpdateModalOpen({ open: false, data: null })}
        onCustomerUpdate={handleUpdatedCustomer}
      />
      <CustomerDeleteModal
        isOpen={isDeleteModalOpen.open}
        customerData={isDeleteModalOpen.data!}
        onClose={() => setIsDeleteModalOpen({ open: false, data: null })}
        onDeleteSent={handleDeleteCustomer}
      />
    </div>
  );
};

export default Customers;
