
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BarChart3, Package, ShoppingCart, Users, UserCheck, Settings, ChevronDown, ChevronRight, Plus, RotateCcw } from 'lucide-react';

interface SidebarProps {
  collapsed: boolean;
}

interface SubMenuItem {
  name: string;
  path: string;
  icon: React.ComponentType<any>;
}

interface MenuItem {
  name: string;
  icon: React.ComponentType<any>;
  path?: string;
  enabled: boolean;
  subItems?: SubMenuItem[];
}

const Sidebar = ({ collapsed }: SidebarProps) => {
  const location = useLocation();
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);

  const menuItems: MenuItem[] = [
    { name: 'Dashboard', icon: BarChart3, path: '/', enabled: true },
    { name: 'Inventory', icon: Package, path: '/inventory', enabled: true },
    { name: 'Sales', icon: ShoppingCart, path: '/sales', enabled: true },
    { name: 'Customers', icon: Users, path: '/customers', enabled: true },
    { name: 'Staff', icon: UserCheck, path: '/staff', enabled: true },
    { name: 'Settings', icon: Settings, path: '/settings', enabled: false },
  ];

  const toggleMenu = (menuName: string) => {
    if (collapsed) return;
    
    setExpandedMenus(prev => 
      prev.includes(menuName) 
        ? prev.filter(item => item !== menuName)
        : [...prev, menuName]
    );
  };

  const isMenuExpanded = (menuName: string) => expandedMenus.includes(menuName);

  const isActiveSubItem = (path: string) => location.pathname === path;
  const isActiveParent = (subItems?: SubMenuItem[]) => 
    subItems?.some(item => location.pathname === item.path) || false;

  return (
    <aside className={`fixed left-0 top-0 h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 z-40 ${collapsed ? 'w-16' : 'w-64'}`}>
      <div className="flex flex-col h-full pt-16">
        <nav className="flex-1 px-3 py-4 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const hasSubItems = item.subItems && item.subItems.length > 0;
            const isExpanded = isMenuExpanded(item.name);
            const isParentActive = isActiveParent(item.subItems);
            const isDirectActive = item.path && location.pathname === item.path;
            
            if (hasSubItems) {
              return (
                <div key={item.name}>
                  <button
                    onClick={() => toggleMenu(item.name)}
                    disabled={!item.enabled}
                    className={`
                      w-full flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium transition-colors
                      ${!item.enabled 
                        ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed' 
                        : isParentActive
                        ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }
                    `}
                  >
                    <div className="flex items-center">
                      <Icon className={`${collapsed ? 'w-5 h-5' : 'w-5 h-5 mr-3'} flex-shrink-0`} />
                      {!collapsed && <span>{item.name}</span>}
                    </div>
                    {!collapsed && item.enabled && (
                      isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />
                    )}
                  </button>
                  
                  {!collapsed && isExpanded && item.enabled && (
                    <div className="ml-4 mt-1 space-y-1">
                      {item.subItems?.map((subItem) => {
                        const SubIcon = subItem.icon;
                        const isActive = isActiveSubItem(subItem.path);
                        
                        return (
                          <Link
                            key={subItem.name}
                            to={subItem.path}
                            className={`
                              flex items-center px-3 py-2 rounded-md text-sm transition-colors
                              ${isActive
                                ? 'bg-blue-50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 border-l-2 border-blue-500'
                                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                              }
                            `}
                          >
                            <SubIcon className="w-4 h-4 mr-3 flex-shrink-0" />
                            <span>{subItem.name}</span>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }
            
            return (
              <Link
                key={item.name}
                to={item.path!}
                className={`
                  flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors
                  ${!item.enabled 
                    ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed' 
                    : isDirectActive
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