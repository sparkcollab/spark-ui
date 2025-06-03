
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BarChart3, Package, ShoppingCart, Settings } from 'lucide-react';

interface SidebarProps {
  collapsed: boolean;
}

const Sidebar = ({ collapsed }: SidebarProps) => {
  const location = useLocation();

  const menuItems = [
    { name: 'Dashboard', icon: BarChart3, path: '/', enabled: true },
    { name: 'Inventory', icon: Package, path: '/inventory', enabled: true },
    { name: 'Sales', icon: ShoppingCart, path: '/sales', enabled: true },
    { name: 'Settings', icon: Settings, path: '/settings', enabled: false },
  ];

  return (
    <aside className={`fixed left-0 top-0 h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 z-40 ${collapsed ? 'w-16' : 'w-64'}`}>
      <div className="flex flex-col h-full pt-16">
        <nav className="flex-1 px-3 py-4 space-y-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`
                  flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors
                  ${!item.enabled 
                    ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed' 
                    : isActive
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }
                `}
                onClick={(e) => !item.enabled && e.preventDefault()}
              >
                <Icon className={`${collapsed ? 'w-5 h-5' : 'w-5 h-5 mr-3'} flex-shrink-0`} />
                {!collapsed && <span>{item.name}</span>}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;