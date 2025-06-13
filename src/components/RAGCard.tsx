
import React from 'react';
import { TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';

interface RAGCardProps {
  title: string;
  value: string;
  target: string;
  status: 'good' | 'warning' | 'danger';
  change: string;
  description: string;
}

const RAGCard = ({ title, value, target, status, change, description }: RAGCardProps) => {
  const getStatusColor = () => {
    switch (status) {
      case 'good':
        return 'border-green-500 bg-green-50 dark:bg-green-900/20';
      case 'warning':
        return 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20';
      case 'danger':
        return 'border-red-500 bg-red-50 dark:bg-red-900/20';
      default:
        return 'border-gray-300 bg-white dark:bg-gray-800';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'good':
        return <TrendingUp className="w-5 h-5 text-green-600" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case 'danger':
        return <TrendingDown className="w-5 h-5 text-red-600" />;
    }
  };

  const getChangeColor = () => {
    if (change.startsWith('+')) {
      return 'text-green-600';
    } else if (change.startsWith('-')) {
      return 'text-red-600';
    }
    return 'text-gray-600';
  };

  return (
    <div className={`p-6 rounded-lg border-2 transition-all hover:shadow-md ${getStatusColor()}`}>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</h3>
        {getStatusIcon()}
      </div>
      
      <div className="space-y-2">
        <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">Target: {target}</p>
        <div className="flex items-center space-x-2">
          <span className={`text-sm font-medium ${getChangeColor()}`}>{change}</span>
          <span className="text-sm text-gray-500 dark:text-gray-400">{description}</span>
        </div>
      </div>
    </div>
  );
};

export default RAGCard;
