import React, { useState, useRef, useEffect } from 'react';
import { 
  FaSearch, 
  FaBell, 
  FaUserCircle, 
  FaChevronDown, 
  FaCog, 
  FaSignOutAlt,
  FaQuestionCircle
} from 'react-icons/fa';

interface TopNavProps {
  sidebarCollapsed: boolean;
}

const TopNav: React.FC<TopNavProps> = ({ sidebarCollapsed }) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  
  const userMenuRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);
  
  // Close menus when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
      
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Dummy notifications for illustration
  const notifications = [
    { id: 1, title: 'New quote request', message: 'John Doe submitted a new quote request', time: '5 minutes ago', read: false },
    { id: 2, title: 'Appointment confirmed', message: 'Sarah Williams confirmed her appointment for tomorrow', time: '1 hour ago', read: false },
    { id: 3, title: 'System update', message: 'KeyBot was updated to version 2.1.0', time: '1 day ago', read: true },
  ];
  
  return (
    <header className={`h-16 bg-white border-b border-gray-200 fixed top-0 right-0 left-0 z-20 transition-all duration-300 ease-in-out ${sidebarCollapsed ? 'pl-16' : 'pl-64'}`}>
      <div className="h-full flex items-center justify-between px-6">
        {/* Search */}
        <div className="w-96 relative">
          <div className={`flex items-center bg-gray-100 rounded-md px-3 py-2 ${searchFocused ? 'ring-2 ring-blue-500' : ''}`}>
            <FaSearch className="text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent border-none focus:outline-none focus:ring-0 w-full"
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
            />
          </div>
        </div>
        
        {/* Right side actions */}
        <div className="flex items-center space-x-4">
          {/* Help */}
          <button className="text-gray-500 hover:text-gray-700 transition-colors">
            <FaQuestionCircle className="w-5 h-5" />
            <span className="sr-only">Help</span>
          </button>
          
          {/* Notifications */}
          <div className="relative" ref={notificationsRef}>
            <button 
              className="text-gray-500 hover:text-gray-700 transition-colors relative"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <FaBell className="w-5 h-5" />
              {notifications.some(n => !n.read) && (
                <span className="absolute -top-1 -right-1 bg-red-500 rounded-full w-2 h-2"></span>
              )}
              <span className="sr-only">Notifications</span>
            </button>
            
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                <div className="px-4 py-2 border-b border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-700">Notifications</h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.length > 0 ? (
                    <div>
                      {notifications.map((notification) => (
                        <div key={notification.id} className={`px-4 py-3 hover:bg-gray-50 border-b border-gray-100 ${notification.read ? 'opacity-60' : ''}`}>
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                              <p className="text-xs text-gray-500 mt-0.5">{notification.message}</p>
                              <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
                            </div>
                            {!notification.read && (
                              <span className="bg-blue-500 rounded-full w-2 h-2 mt-1"></span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="px-4 py-6 text-center">
                      <p className="text-sm text-gray-500">No new notifications</p>
                    </div>
                  )}
                </div>
                <div className="px-4 py-2 border-t border-gray-200 text-center">
                  <button className="text-xs text-blue-600 hover:text-blue-800">
                    Mark all as read
                  </button>
                </div>
              </div>
            )}
          </div>
          
          {/* User Menu */}
          <div className="relative" ref={userMenuRef}>
            <button 
              className="flex items-center space-x-2 text-gray-700 hover:text-gray-900"
              onClick={() => setShowUserMenu(!showUserMenu)}
            >
              <FaUserCircle className="w-8 h-8 text-gray-400" />
              <span className="text-sm font-medium hidden md:block">Admin User</span>
              <FaChevronDown className="w-3 h-3 text-gray-400 hidden md:block" />
            </button>
            
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                <div className="px-4 py-2 border-b border-gray-200">
                  <p className="text-sm font-medium text-gray-900">Admin User</p>
                  <p className="text-xs text-gray-500 truncate">admin@keybot.com</p>
                </div>
                <a href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  <div className="flex items-center">
                    <FaUserCircle className="mr-2 text-gray-400" />
                    Profile
                  </div>
                </a>
                <a href="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  <div className="flex items-center">
                    <FaCog className="mr-2 text-gray-400" />
                    Settings
                  </div>
                </a>
                <div className="border-t border-gray-200 mt-1"></div>
                <a href="/logout" className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
                  <div className="flex items-center">
                    <FaSignOutAlt className="mr-2" />
                    Sign out
                  </div>
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopNav;
