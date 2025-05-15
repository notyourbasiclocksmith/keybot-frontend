import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { 
  FaHome, 
  FaClipboard, 
  FaFileUpload, 
  FaCalendarAlt, 
  FaInfoCircle, 
  FaPlus 
} from 'react-icons/fa';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const router = useRouter();
  
  // Helper function to determine if a link is active
  const isActive = (path: string) => {
    if (path === '/' && router.pathname !== '/') {
      return false;
    }
    return router.pathname.startsWith(path);
  };
  
  const navLinks = [
    { path: '/', label: 'Dashboard', icon: <FaHome className="mr-2" /> },
    { path: '/quotes', label: 'Quotes', icon: <FaClipboard className="mr-2" /> },
    { path: '/upload', label: 'Upload Pricing', icon: <FaFileUpload className="mr-2" /> },
    { path: '/calendar', label: 'Calendar', icon: <FaCalendarAlt className="mr-2" /> },
    { path: '/about', label: 'About', icon: <FaInfoCircle className="mr-2" /> },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50 font-sans">
      {/* Sidebar - Desktop */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <div className="flex-1 flex flex-col min-h-0 bg-blue-700 shadow-lg">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <div className="flex-shrink-0 flex items-center px-4">
              <div className="h-8 w-auto text-white text-2xl font-bold">KeyBot</div>
            </div>
            <nav className="mt-5 flex-1 px-2">
              {navLinks.map((link) => (
                <Link href={link.path} key={link.path}>
                  <a
                    className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                      isActive(link.path)
                        ? 'bg-blue-800 text-white'
                        : 'text-blue-100 hover:bg-blue-600 hover:text-white'
                    }`}
                  >
                    {link.icon}
                    {link.label}
                  </a>
                </Link>
              ))}
              
              {/* Special Create Quote Button */}
              <Link href="/quotes/new">
                <a className={`group flex items-center px-2 py-2 mt-4 text-sm font-medium rounded-md ${
                  router.pathname === '/quotes/new'
                    ? 'bg-green-700 text-white'
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}>
                  <FaPlus className="mr-2" />
                  Create New Quote
                </a>
              </Link>
            </nav>
          </div>
        </div>
      </div>

      {/* Mobile header */}
      <div className="md:hidden bg-blue-700 text-white shadow-md">
        <div className="flex justify-between items-center p-4">
          <div className="text-xl font-bold">KeyBot</div>
          <div>
            <button 
              className="mobile-menu-button p-2 rounded-md inline-flex items-center justify-center text-white hover:bg-blue-600 focus:outline-none"
              aria-label="Open menu"
              onClick={() => {
                const menu = document.getElementById('mobile-menu');
                menu?.classList.toggle('hidden');
              }}
            >
              <span className="sr-only">Open menu</span>
              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Mobile menu */}
        <div id="mobile-menu" className="hidden p-2 pb-3 space-y-1">
          {navLinks.map((link) => (
            <Link href={link.path} key={link.path}>
              <a
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive(link.path)
                    ? 'bg-blue-800 text-white'
                    : 'text-blue-100 hover:bg-blue-600 hover:text-white'
                }`}
              >
                <div className="flex items-center">
                  {link.icon}
                  {link.label}
                </div>
              </a>
            </Link>
          ))}
          <Link href="/quotes/new">
            <a className={`block px-3 py-2 rounded-md text-base font-medium mt-2 ${
              router.pathname === '/quotes/new'
                ? 'bg-green-700 text-white'
                : 'bg-green-600 text-white hover:bg-green-700'
            }`}>
              <div className="flex items-center">
                <FaPlus className="mr-2" />
                Create New Quote
              </div>
            </a>
          </Link>
        </div>
      </div>

      {/* Main content */}
      <div className="md:pl-64 flex flex-col flex-1">
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
