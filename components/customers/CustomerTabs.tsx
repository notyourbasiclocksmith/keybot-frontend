import React, { useState } from 'react';

interface Tab {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

interface CustomerTabsProps {
  tabs: Tab[];
  defaultTab?: string;
  children: React.ReactNode[];
}

const CustomerTabs: React.FC<CustomerTabsProps> = ({ 
  tabs, 
  defaultTab = tabs[0]?.id, 
  children 
}) => {
  const [activeTab, setActiveTab] = useState(defaultTab);

  // Ensure we have the right number of children
  const tabPanels = React.Children.toArray(children);
  
  if (tabPanels.length !== tabs.length) {
    console.warn(`CustomerTabs: Number of tab panels (${tabPanels.length}) does not match number of tabs (${tabs.length})`);
  }

  return (
    <div>
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.icon && <span className="mr-2">{tab.icon}</span>}
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
      
      <div className="py-4">
        {tabPanels.map((panel, index) => (
          <div
            key={tabs[index]?.id || index}
            className={activeTab === tabs[index]?.id ? 'block' : 'hidden'}
            role="tabpanel"
            aria-labelledby={`tab-${tabs[index]?.id}`}
          >
            {panel}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomerTabs;
