import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { 
  FaHome, 
  FaClipboard, 
  FaUsers, 
  FaCalendarAlt, 
  FaFileUpload, 
  FaCog, 
  FaPhoneAlt, 
  FaChartBar,
  FaChevronLeft,
  FaChevronRight
} from 'react-icons/fa';

interface SidebarProps {
  collapsed: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed, toggleSidebar }) => {
  const router = useRouter();
  
  const navItems = [
    { path: '/', label: 'Dashboard', icon: <FaHome className="w-5 h-5" /> },
    { path: '/quotes', label: 'Quotes', icon: <FaClipboard className="w-5 h-5" /> },
    { path: '/customers', label: 'Customers', icon: <FaUsers className="w-5 h-5" /> },
    { path: '/calendar', label: 'Calendar', icon: <FaCalendarAlt className="w-5 h-5" /> },
    { path: '/upload', label: 'Upload Pricing', icon: <FaFileUpload className="w-5 h-5" /> },
    { path: '/receptionist', label: 'Receptionist', icon: <FaPhoneAlt className="w-5 h-5" /> },
    { path: '/settings', label: 'Settings', icon: <FaCog className="w-5 h-5" /> },
    { path: '/reports', label: 'Reports', icon: <FaChartBar className="w-5 h-5" /> },
  ];

  const isActive = (path: string) => {
    if (path === '/') {
      return router.pathname === path;
    }
    return router.pathname.startsWith(path);
  };

  return (
    <div className={`${collapsed ? 'w-16' : 'w-64'} h-screen bg-slate-800 text-white fixed left-0 top-0 transition-all duration-300 ease-in-out z-30 shadow-lg flex flex-col`}>
      {/* Logo */}
      <div className="h-16 border-b border-slate-700 flex items-center justify-center px-4">
        {collapsed ? (
          <div className="text-2xl font-bold text-blue-400">KB</div>
        ) : (
          <div className="text-xl font-bold text-white">KeyBot<span className="text-blue-400">.</span></div>
        )}
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 py-6 overflow-y-auto">
        <ul className="space-y-1 px-2">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link
                href={item.path}
                className={`flex items-center ${collapsed ? 'justify-center' : 'px-3'} py-2.5 rounded-md transition-colors duration-200 ${
                  isActive(item.path)
                    ? 'bg-slate-700 text-blue-400'
                    : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
                title={collapsed ? item.label : undefined}
              >
                <span className={collapsed ? '' : 'mr-3'}>{item.icon}</span>
                {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      
      {/* Collapse toggle */}
      <div className="p-4 border-t border-slate-700">
        <button
          onClick={toggleSidebar}
          className="w-full flex items-center justify-center text-slate-400 hover:text-white py-2 rounded-md transition-colors hover:bg-slate-700"
        >
          {collapsed ? (
            <FaChevronRight className="w-4 h-4" />
          ) : (
            <>
              <FaChevronLeft className="w-4 h-4 mr-2" />
              <span className="text-sm">Collapse</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
