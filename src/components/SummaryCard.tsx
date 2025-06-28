
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface SummaryCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  color?: 'blue' | 'green' | 'orange' | 'purple' | 'yellow';
}

const SummaryCard = ({ title, value, icon: Icon, description, color = 'blue' }: SummaryCardProps) => {
  const getColorClasses = () => {
    switch (color) {
      case 'green':
        return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-600 dark:text-green-400';
      case 'orange':
        return 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800 text-orange-600 dark:text-orange-400';
      case 'purple':
        return 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800 text-purple-600 dark:text-purple-400';
        case 'yellow':
        return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800 text-yellow-600 dark:text-yellow-400';
      default:
        return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400';
    }
  };

  return (
    <div className={`p-6 rounded-lg border transition-all hover:shadow-md bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700`}>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</h3>
        <div className={`p-2 rounded-lg ${getColorClasses()}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      
      <div className="space-y-1">
        <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
        {description && (
          <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
        )}
      </div>
    </div>
  );
};

export default SummaryCard;