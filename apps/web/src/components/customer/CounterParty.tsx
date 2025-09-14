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
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { CounterParty, CounterPartyResponse } from "@/types/CounterParty";
import AddCounterParty from "./AddCounterParty";
import UpdateCounterParty from "./UpdateCounterParty";
import CounterPartyDeleteModal from "./DeleteCounterParty";
import SummaryCard from "../SummaryCard";
import { useCounterPartyStore } from "@/store/useCounterParty";

const CounterParties = ({ type }) => {
  const [isAddCounterParty, setIsAddCounterParty] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState<{
    open: boolean;
    data: CounterPartyResponse | null;
  }>({ open: false, data: null });
  const [counterPartyData, setCounterPartyData] =
    useState<CounterPartyResponse[] | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<{
    open: boolean;
    data: CounterPartyResponse | null;
  }>({ open: false, data: null });
  const {
    counterParties,
    postCounterParty,
    fetchCounterParties,
    updateCounterParty,
    deleteCounterParty,
  } = useCounterPartyStore();

  useEffect(() => {
    setCounterPartyData(
      counterParties.filter(
        (counterParty) => counterParty.kind === type.toUpperCase()
      ) || null
    );
  }, [counterParties, type]);
  useEffect(() => {
    fetchCounterParties();
  }, [fetchCounterParties]);

  const handleAddCounterParty = () => {
    setIsAddCounterParty(true);
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

  const handleCounterPartyAdded = (counterPartyData: CounterParty) => {
    postCounterParty(counterPartyData);
  };

  const handleUpdatedCounterParty = (counterPartyData: CounterParty) => {
    updateCounterParty(isUpdateModalOpen.data?.id || "", counterPartyData);
  };

  const handleDeleteCounterParty = (id: string) => {
    deleteCounterParty(id);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          {type}s
        </h1>
        <Button
          className="flex items-center space-x-2"
          onClick={handleAddCounterParty}
        >
          <Plus className="w-4 h-4" />
          <span>Add {type}</span>
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SummaryCard
          title={`Total ${type}`}
          value={counterPartyData ? counterPartyData.length.toString() : "0"}
          icon={Users}
          description={`Active ${type}`}
          color="blue"
        />
        <SummaryCard
          title="New This Month"
          value="3"
          icon={Plus}
          description={`New ${type} signups`}
          color="green"
        />
        <SummaryCard
          title="Average Orders"
          value="15.2"
          icon={Users}
          description={`Orders per ${type}`}
          color="purple"
        />
      </div>

      {/* CounterParties Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {type} Name
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
              </tr>
            </thead>
            {<tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {counterPartyData?.map((counterParty) => (
                <tr
                  key={counterParty.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                    {counterParty.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-300">
                    {counterParty.address}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-300">
                    <div className="flex items-center">
                      <Phone className="w-4 h-4 mr-2" />
                      {counterParty.phone}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-300">
                    <div className="flex items-center">
                      <Mail className="w-4 h-4 mr-2" />
                      {counterParty.email}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center space-x-1 px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                        counterParty.active ? "Active" : "Inactive"
                      )}`}
                    >
                      {getStatusIcon(
                        counterParty.active ? "Active" : "Inactive"
                      )}
                      <span>{counterParty.active ? "Active" : "Inactive"}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center space-x-1 px-2 py-1 text-xs">
                      <EditIcon
                        className="w-4 h-4 text-gray-500 dark:text-gray-300 cursor-pointer"
                        onClick={() =>
                          setIsUpdateModalOpen({
                            open: true,
                            data: counterParty,
                          })
                        }
                      />
                      <Trash2
                        className="w-4 h-4 text-red-500 dark:text-red-400 cursor-pointer"
                        onClick={() =>
                          setIsDeleteModalOpen({
                            open: true,
                            data: counterParty,
                          })
                        }
                      />
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>}
          </table>
        </div>
      </div>
      <AddCounterParty
        isOpen={isAddCounterParty}
        onClose={() => setIsAddCounterParty(false)}
        onCounterPartyAdd={handleCounterPartyAdded}
        type={type}
      />
      <UpdateCounterParty
        isOpen={isUpdateModalOpen.open}
        counterPartyData={isUpdateModalOpen.data}
        onClose={() => setIsUpdateModalOpen({ open: false, data: null })}
        onCounterPartyUpdate={handleUpdatedCounterParty}
        type={type}
      />
      <CounterPartyDeleteModal
        isOpen={isDeleteModalOpen.open}
        counterPartyData={isDeleteModalOpen.data!}
        onClose={() => setIsDeleteModalOpen({ open: false, data: null })}
        onDeleteSent={handleDeleteCounterParty}
        type={type}
      />
    </div>
  );
};

export default CounterParties;
