import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';
import { FaTools, FaSpinner, FaSave, FaUserCog, FaCalendarAlt, FaMicrophone, FaFileInvoiceDollar, FaKey, FaTools as FaServiceTools, FaCreditCard, FaMapMarkerAlt, FaClipboardList, FaPlus, FaTrash } from 'react-icons/fa';

interface TechnicianInfo {
  name: string;
  email: string;
  phone: string;
  calendar_color: string;
  status: 'active' | 'inactive';
}

interface SettingsData {
  twilioSettings: {
    account_sid: string;
    auth_token: string;
    phone_number: string;
    enabled: boolean;
  };
  emailSettings: {
    sender_email: string;
    smtp_server: string;
    smtp_port: number;
    smtp_username: string;
    smtp_password: string;
    enabled: boolean;
  };
  calendarSettings: {
    technicians: TechnicianInfo[];
    working_hours: {
      start: string;
      end: string;
    };
    default_appointment_duration: number;
  };
  recordingSettings: {
    storage_provider: string;
    storage_bucket: string;
    recording_enabled: boolean;
  };
  pricingSettings: {
    default_markup_percentage: number;
    minimum_price: number;
    emergency_fee: number;
    after_hours_fee: number;
  };
  customOptions: {
    key_types: string[];
    service_types: string[];
    payment_methods: string[];
    lead_sources: string[];
    statuses: string[];
  };
}

const defaultSettings: SettingsData = {
  twilioSettings: {
    account_sid: '',
    auth_token: '',
    phone_number: '',
    enabled: false
  },
  emailSettings: {
    sender_email: '',
    smtp_server: '',
    smtp_port: 587,
    smtp_username: '',
    smtp_password: '',
    enabled: false
  },
  calendarSettings: {
    technicians: [
      {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '(555) 123-4567',
        calendar_color: '#3498db',
        status: 'active'
      },
      {
        name: 'Jane Smith',
        email: 'jane@example.com',
        phone: '(555) 987-6543',
        calendar_color: '#2ecc71',
        status: 'active'
      }
    ],
    working_hours: {
      start: '09:00',
      end: '18:00'
    },
    default_appointment_duration: 60
  },
  recordingSettings: {
    storage_provider: 'digitalocean',
    storage_bucket: 'keybot-recordings',
    recording_enabled: true
  },
  pricingSettings: {
    default_markup_percentage: 30,
    minimum_price: 75,
    emergency_fee: 50,
    after_hours_fee: 25
  },
  customOptions: {
    key_types: [
      'Standard',
      'Transponder',
      'Remote Key Fob',
      'Smart Key',
      'Laser Cut Key'
    ],
    service_types: [
      'Key Duplication',
      'Key Replacement',
      'Lock Repair',
      'Car Lockout',
      'Emergency Service'
    ],
    payment_methods: [
      'Cash',
      'Credit Card',
      'Debit Card',
      'Mobile Payment'
    ],
    lead_sources: [
      'Website',
      'Referral',
      'Google Search',
      'Social Media'
    ],
    statuses: [
      'Pending',
      'Confirmed',
      'Completed',
      'Cancelled'
    ]
  }
};

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('twilio');
  const [settings, setSettings] = useState<SettingsData>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [newTechnician, setNewTechnician] = useState<TechnicianInfo>({name: '', email: '', phone: '', calendar_color: '#3498db', status: 'active'});
  const [newOption, setNewOption] = useState({type: 'key_types', value: ''});

  // Fetch settings on component mount
  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE}/settings`);
      
      if (response.data && response.data.success) {
        setSettings(response.data.data);
      } else {
        // If the endpoint doesn't exist yet or returns an error, use default settings
        console.log('Using default settings as API endpoint may not be implemented yet');
        setSettings(defaultSettings);
      }
    } catch (error) {
      console.log('Error fetching settings - using defaults:', error);
      toast.error('Failed to load settings. Using default values.');
      setSettings(defaultSettings);
    } finally {
      setIsLoading(false);
    }
  };

  const saveSettings = async () => {
    try {
      setIsSaving(true);
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE}/settings`, settings);
      
      if (response.data && response.data.success) {
        toast.success('Settings saved successfully');
      } else {
        throw new Error(response.data?.message || 'Failed to save settings');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save settings. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (section: keyof SettingsData, field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleToggleEnable = (section: keyof SettingsData, field: string) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: !prev[section][field]
      }
    }));
  };

  const addTechnician = () => {
    if (!newTechnician.name.trim()) return;
    
    setSettings(prev => ({
      ...prev,
      calendarSettings: {
        ...prev.calendarSettings,
        technicians: [...prev.calendarSettings.technicians, newTechnician]
      }
    }));
    setNewTechnician({name: '', email: '', phone: '', calendar_color: '#3498db', status: 'active'});
  };

  const removeTechnician = (techName: string) => {
    setSettings(prev => ({
      ...prev,
      calendarSettings: {
        ...prev.calendarSettings,
        technicians: prev.calendarSettings.technicians.filter(tech => tech.name !== techName)
      }
    }));
  };

  const addCustomOption = () => {
    if (!newOption.value.trim()) return;
    
    setSettings(prev => ({
      ...prev,
      customOptions: {
        ...prev.customOptions,
        [newOption.type]: [...prev.customOptions[newOption.type as keyof typeof prev.customOptions] as string[], newOption.value]
      }
    }));
    setNewOption({...newOption, value: ''});
  };

  const removeCustomOption = (type: keyof typeof settings.customOptions, value: string) => {
    setSettings(prev => ({
      ...prev,
      customOptions: {
        ...prev.customOptions,
        [type]: (prev.customOptions[type] as string[]).filter(item => item !== value)
      }
    }));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Head>
        <title>Settings | KeyBot</title>
      </Head>
      
      <Toaster position="top-right" />
      
      <div className="flex items-center mb-6">
        <h1 className="text-2xl font-bold">
          <FaTools className="inline-block mr-2" /> System Settings
        </h1>
      </div>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center">
            <FaSpinner className="animate-spin inline-block text-3xl text-blue-600 mb-2" />
            <p>Loading settings...</p>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row">
            {/* Sidebar Navigation */}
            <div className="w-full md:w-64 bg-gray-50 border-r border-gray-200">
              <nav className="py-4">
                <ul>
                  <li className={`px-4 py-2 border-l-4 ${activeTab === 'twilio' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-transparent hover:bg-gray-100'}`}>
                    <button 
                      className="w-full text-left flex items-center" 
                      onClick={() => setActiveTab('twilio')}
                    >
                      <FaUserCog className="mr-2" /> Twilio SMS
                    </button>
                  </li>
                  <li className={`px-4 py-2 border-l-4 ${activeTab === 'email' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-transparent hover:bg-gray-100'}`}>
                    <button 
                      className="w-full text-left flex items-center" 
                      onClick={() => setActiveTab('email')}
                    >
                      <FaUserCog className="mr-2" /> Email Settings
                    </button>
                  </li>
                  <li className={`px-4 py-2 border-l-4 ${activeTab === 'calendar' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-transparent hover:bg-gray-100'}`}>
                    <button 
                      className="w-full text-left flex items-center" 
                      onClick={() => setActiveTab('calendar')}
                    >
                      <FaCalendarAlt className="mr-2" /> Calendar
                    </button>
                  </li>
                  <li className={`px-4 py-2 border-l-4 ${activeTab === 'recording' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-transparent hover:bg-gray-100'}`}>
                    <button 
                      className="w-full text-left flex items-center" 
                      onClick={() => setActiveTab('recording')}
                    >
                      <FaMicrophone className="mr-2" /> Recording
                    </button>
                  </li>
                  <li className={`px-4 py-2 border-l-4 ${activeTab === 'pricing' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-transparent hover:bg-gray-100'}`}>
                    <button 
                      className="w-full text-left flex items-center" 
                      onClick={() => setActiveTab('pricing')}
                    >
                      <FaFileInvoiceDollar className="mr-2" /> Pricing
                    </button>
                  </li>
                  <li className="px-3 py-2 text-xs uppercase text-gray-500 font-semibold mt-4">Custom Options</li>
                  <li className={`px-4 py-2 border-l-4 ${activeTab === 'key_types' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-transparent hover:bg-gray-100'}`}>
                    <button 
                      className="w-full text-left flex items-center" 
                      onClick={() => setActiveTab('key_types')}
                    >
                      <FaKey className="mr-2" /> Key Types
                    </button>
                  </li>
                  <li className={`px-4 py-2 border-l-4 ${activeTab === 'service_types' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-transparent hover:bg-gray-100'}`}>
                    <button 
                      className="w-full text-left flex items-center" 
                      onClick={() => setActiveTab('service_types')}
                    >
                      <FaServiceTools className="mr-2" /> Service Types
                    </button>
                  </li>
                  <li className={`px-4 py-2 border-l-4 ${activeTab === 'payment_methods' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-transparent hover:bg-gray-100'}`}>
                    <button 
                      className="w-full text-left flex items-center" 
                      onClick={() => setActiveTab('payment_methods')}
                    >
                      <FaCreditCard className="mr-2" /> Payment Methods
                    </button>
                  </li>
                  <li className={`px-4 py-2 border-l-4 ${activeTab === 'lead_sources' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-transparent hover:bg-gray-100'}`}>
                    <button 
                      className="w-full text-left flex items-center" 
                      onClick={() => setActiveTab('lead_sources')}
                    >
                      <FaMapMarkerAlt className="mr-2" /> Lead Sources
                    </button>
                  </li>
                  <li className={`px-4 py-2 border-l-4 ${activeTab === 'statuses' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-transparent hover:bg-gray-100'}`}>
                    <button 
                      className="w-full text-left flex items-center" 
                      onClick={() => setActiveTab('statuses')}
                    >
                      <FaClipboardList className="mr-2" /> Status Options
                    </button>
                  </li>
                </ul>
              </nav>
            </div>

            {/* Content Area */}
            <div className="flex-1 p-6">
              {/* Twilio Settings */}
              {activeTab === 'twilio' && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">Twilio SMS Settings</h2>
                  <div className="mb-4">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.twilioSettings.enabled}
                        onChange={() => handleToggleEnable('twilioSettings', 'enabled')}
                        className="form-checkbox h-5 w-5 text-blue-600"
                      />
                      <span className="ml-2 text-gray-700">Enable SMS Notifications</span>
                    </label>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Account SID</label>
                      <input
                        type="text"
                        value={settings.twilioSettings.account_sid}
                        onChange={(e) => handleInputChange('twilioSettings', 'account_sid', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        placeholder="Enter your Twilio Account SID"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Auth Token</label>
                      <input
                        type="password"
                        value={settings.twilioSettings.auth_token}
                        onChange={(e) => handleInputChange('twilioSettings', 'auth_token', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        placeholder="Enter your Twilio Auth Token"
                      />
                      <p className="text-xs text-gray-500 mt-1">This will be stored securely and never displayed in plain text.</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                      <input
                        type="text"
                        value={settings.twilioSettings.phone_number}
                        onChange={(e) => handleInputChange('twilioSettings', 'phone_number', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        placeholder="+15551234567"
                      />
                      <p className="text-xs text-gray-500 mt-1">Format: +1XXXXXXXXXX</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Email Settings */}
              {activeTab === 'email' && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">Email Settings</h2>
                  <div className="mb-4">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.emailSettings.enabled}
                        onChange={() => handleToggleEnable('emailSettings', 'enabled')}
                        className="form-checkbox h-5 w-5 text-blue-600"
                      />
                      <span className="ml-2 text-gray-700">Enable Email Notifications</span>
                    </label>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Sender Email</label>
                      <input
                        type="email"
                        value={settings.emailSettings.sender_email}
                        onChange={(e) => handleInputChange('emailSettings', 'sender_email', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        placeholder="noreply@yourdomain.com"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">SMTP Server</label>
                      <input
                        type="text"
                        value={settings.emailSettings.smtp_server}
                        onChange={(e) => handleInputChange('emailSettings', 'smtp_server', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        placeholder="smtp.gmail.com"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">SMTP Port</label>
                      <input
                        type="number"
                        value={settings.emailSettings.smtp_port}
                        onChange={(e) => handleInputChange('emailSettings', 'smtp_port', parseInt(e.target.value) || 587)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        placeholder="587"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">SMTP Username</label>
                      <input
                        type="text"
                        value={settings.emailSettings.smtp_username}
                        onChange={(e) => handleInputChange('emailSettings', 'smtp_username', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        placeholder="your.email@gmail.com"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">SMTP Password</label>
                      <input
                        type="password"
                        value={settings.emailSettings.smtp_password}
                        onChange={(e) => handleInputChange('emailSettings', 'smtp_password', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        placeholder="Enter SMTP password"
                      />
                      <p className="text-xs text-gray-500 mt-1">This will be stored securely and never displayed in plain text.</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Calendar Settings */}
              {activeTab === 'calendar' && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">Calendar Settings</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Technicians</label>
                      <div className="flex flex-col gap-2 mb-3">
                        {settings.calendarSettings.technicians.map((tech, index) => (
                          <div key={index} className="bg-blue-100 text-blue-800 p-3 rounded-md flex justify-between items-center">
                            <div>
                              <span className="font-semibold">{tech.name}</span>
                              <div className="text-xs text-gray-600">
                                {tech.email} | {tech.phone}
                              </div>
                              <div className="text-xs flex items-center mt-1">
                                <span className="mr-2">Calendar Color:</span>
                                <div 
                                  className="w-4 h-4 rounded-full" 
                                  style={{backgroundColor: tech.calendar_color}}
                                ></div>
                                <span className="ml-2 capitalize">{tech.status}</span>
                              </div>
                            </div>
                            <button 
                              onClick={() => removeTechnician(tech.name)}
                              className="ml-2 text-blue-500 hover:text-blue-700 focus:outline-none"
                            >
                              &times;
                            </button>
                          </div>
                        ))}
                      </div>
                      
                      <div className="border border-gray-200 rounded-md p-4 mb-4">
                        <h3 className="text-md font-medium mb-3">Add New Technician</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                            <input
                              type="text"
                              value={newTechnician.name}
                              onChange={(e) => setNewTechnician({...newTechnician, name: e.target.value})}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md"
                              placeholder="John Doe"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <input
                              type="email"
                              value={newTechnician.email}
                              onChange={(e) => setNewTechnician({...newTechnician, email: e.target.value})}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md"
                              placeholder="john@example.com"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                            <input
                              type="text"
                              value={newTechnician.phone}
                              onChange={(e) => setNewTechnician({...newTechnician, phone: e.target.value})}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md"
                              placeholder="(555) 123-4567"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Calendar Color</label>
                            <input
                              type="color"
                              value={newTechnician.calendar_color}
                              onChange={(e) => setNewTechnician({...newTechnician, calendar_color: e.target.value})}
                              className="w-full h-10 px-1 py-1 border border-gray-300 rounded-md"
                            />
                          </div>
                        </div>
                        <div className="flex items-center mb-4">
                          <label className="flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={newTechnician.status === 'active'}
                              onChange={(e) => setNewTechnician({...newTechnician, status: e.target.checked ? 'active' : 'inactive'})}
                              className="form-checkbox h-5 w-5 text-blue-600"
                            />
                            <span className="ml-2 text-gray-700">Active</span>
                          </label>
                        </div>
                        <button
                          onClick={addTechnician}
                          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                          disabled={!newTechnician.name.trim()}
                        >
                          Add Technician
                        </button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Working Hours Start</label>
                        <input
                          type="time"
                          value={settings.calendarSettings.working_hours.start}
                          onChange={(e) => handleInputChange('calendarSettings', 'working_hours', {
                            ...settings.calendarSettings.working_hours,
                            start: e.target.value
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Working Hours End</label>
                        <input
                          type="time"
                          value={settings.calendarSettings.working_hours.end}
                          onChange={(e) => handleInputChange('calendarSettings', 'working_hours', {
                            ...settings.calendarSettings.working_hours,
                            end: e.target.value
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Default Appointment Duration (minutes)</label>
                      <select
                        value={settings.calendarSettings.default_appointment_duration}
                        onChange={(e) => handleInputChange('calendarSettings', 'default_appointment_duration', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      >
                        <option value="30">30 minutes</option>
                        <option value="45">45 minutes</option>
                        <option value="60">60 minutes</option>
                        <option value="90">90 minutes</option>
                        <option value="120">120 minutes</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Recording Settings */}
              {activeTab === 'recording' && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">Recording Settings</h2>
                  <div className="mb-4">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.recordingSettings.recording_enabled}
                        onChange={() => handleToggleEnable('recordingSettings', 'recording_enabled')}
                        className="form-checkbox h-5 w-5 text-blue-600"
                      />
                      <span className="ml-2 text-gray-700">Enable Call Recordings</span>
                    </label>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Storage Provider</label>
                      <select
                        value={settings.recordingSettings.storage_provider}
                        onChange={(e) => handleInputChange('recordingSettings', 'storage_provider', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      >
                        <option value="digitalocean">DigitalOcean Spaces</option>
                        <option value="aws">AWS S3</option>
                        <option value="local">Local Storage</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Storage Bucket</label>
                      <input
                        type="text"
                        value={settings.recordingSettings.storage_bucket}
                        onChange={(e) => handleInputChange('recordingSettings', 'storage_bucket', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        placeholder="your-bucket-name"
                      />
                    </div>
                    
                    <div className="bg-blue-50 border border-blue-200 p-4 rounded-md">
                      <h3 className="font-medium text-blue-800 mb-2">Important Note</h3>
                      <p className="text-sm text-blue-700">
                        Make sure your storage provider is configured correctly in your API settings and has the necessary permissions.
                        For Digital Ocean Spaces, you'll need valid API keys configured in your backend.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Pricing Settings */}
              {activeTab === 'pricing' && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">Pricing Settings</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Default Markup Percentage (%)</label>
                      <input
                        type="number"
                        value={settings.pricingSettings.default_markup_percentage}
                        onChange={(e) => handleInputChange('pricingSettings', 'default_markup_percentage', parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        min="0"
                        max="100"
                      />
                      <p className="text-xs text-gray-500 mt-1">Applied to base prices from pricing data</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Price ($)</label>
                      <input
                        type="number"
                        value={settings.pricingSettings.minimum_price}
                        onChange={(e) => handleInputChange('pricingSettings', 'minimum_price', parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        min="0"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Fee ($)</label>
                      <input
                        type="number"
                        value={settings.pricingSettings.emergency_fee}
                        onChange={(e) => handleInputChange('pricingSettings', 'emergency_fee', parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        min="0"
                      />
                      <p className="text-xs text-gray-500 mt-1">Added to quotes marked as emergency service</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">After Hours Fee ($)</label>
                      <input
                        type="number"
                        value={settings.pricingSettings.after_hours_fee}
                        onChange={(e) => handleInputChange('pricingSettings', 'after_hours_fee', parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        min="0"
                      />
                      <p className="text-xs text-gray-500 mt-1">Added to quotes for service outside regular business hours</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Key Types Settings */}
              {activeTab === 'key_types' && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">Key Types</h2>
                  
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2 mb-3">
                      {settings.customOptions.key_types.length === 0 ? (
                        <p className="text-gray-500 italic">No key types added yet</p>
                      ) : (
                        settings.customOptions.key_types.map((type, index) => (
                          <div key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center">
                            {type}
                            <button 
                              onClick={() => removeCustomOption('key_types', type)}
                              className="ml-2 text-blue-500 hover:text-blue-700 focus:outline-none"
                            >
                              &times;
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                    
                    <div className="flex">
                      <input
                        type="text"
                        value={newOption.type === 'key_types' ? newOption.value : ''}
                        onChange={(e) => setNewOption({type: 'key_types', value: e.target.value})}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md"
                        placeholder="Add a key type"
                      />
                      <button
                        onClick={addCustomOption}
                        className="bg-blue-600 text-white px-4 py-2 rounded-r-md hover:bg-blue-700"
                        disabled={!newOption.value.trim() || newOption.type !== 'key_types'}
                      >
                        <FaPlus className="mr-1 inline" /> Add
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Service Types Settings */}
              {activeTab === 'service_types' && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">Service Types</h2>
                  
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2 mb-3">
                      {settings.customOptions.service_types.length === 0 ? (
                        <p className="text-gray-500 italic">No service types added yet</p>
                      ) : (
                        settings.customOptions.service_types.map((type, index) => (
                          <div key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center">
                            {type}
                            <button 
                              onClick={() => removeCustomOption('service_types', type)}
                              className="ml-2 text-blue-500 hover:text-blue-700 focus:outline-none"
                            >
                              &times;
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                    
                    <div className="flex">
                      <input
                        type="text"
                        value={newOption.type === 'service_types' ? newOption.value : ''}
                        onChange={(e) => setNewOption({type: 'service_types', value: e.target.value})}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md"
                        placeholder="Add a service type"
                      />
                      <button
                        onClick={addCustomOption}
                        className="bg-blue-600 text-white px-4 py-2 rounded-r-md hover:bg-blue-700"
                        disabled={!newOption.value.trim() || newOption.type !== 'service_types'}
                      >
                        <FaPlus className="mr-1 inline" /> Add
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Payment Methods Settings */}
              {activeTab === 'payment_methods' && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">Payment Methods</h2>
                  
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2 mb-3">
                      {settings.customOptions.payment_methods.length === 0 ? (
                        <p className="text-gray-500 italic">No payment methods added yet</p>
                      ) : (
                        settings.customOptions.payment_methods.map((method, index) => (
                          <div key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center">
                            {method}
                            <button 
                              onClick={() => removeCustomOption('payment_methods', method)}
                              className="ml-2 text-blue-500 hover:text-blue-700 focus:outline-none"
                            >
                              &times;
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                    
                    <div className="flex">
                      <input
                        type="text"
                        value={newOption.type === 'payment_methods' ? newOption.value : ''}
                        onChange={(e) => setNewOption({type: 'payment_methods', value: e.target.value})}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md"
                        placeholder="Add a payment method"
                      />
                      <button
                        onClick={addCustomOption}
                        className="bg-blue-600 text-white px-4 py-2 rounded-r-md hover:bg-blue-700"
                        disabled={!newOption.value.trim() || newOption.type !== 'payment_methods'}
                      >
                        <FaPlus className="mr-1 inline" /> Add
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Lead Sources Settings */}
              {activeTab === 'lead_sources' && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">Lead Sources</h2>
                  
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2 mb-3">
                      {settings.customOptions.lead_sources.length === 0 ? (
                        <p className="text-gray-500 italic">No lead sources added yet</p>
                      ) : (
                        settings.customOptions.lead_sources.map((source, index) => (
                          <div key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center">
                            {source}
                            <button 
                              onClick={() => removeCustomOption('lead_sources', source)}
                              className="ml-2 text-blue-500 hover:text-blue-700 focus:outline-none"
                            >
                              &times;
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                    
                    <div className="flex">
                      <input
                        type="text"
                        value={newOption.type === 'lead_sources' ? newOption.value : ''}
                        onChange={(e) => setNewOption({type: 'lead_sources', value: e.target.value})}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md"
                        placeholder="Add a lead source"
                      />
                      <button
                        onClick={addCustomOption}
                        className="bg-blue-600 text-white px-4 py-2 rounded-r-md hover:bg-blue-700"
                        disabled={!newOption.value.trim() || newOption.type !== 'lead_sources'}
                      >
                        <FaPlus className="mr-1 inline" /> Add
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Statuses Settings */}
              {activeTab === 'statuses' && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">Status Options</h2>
                  
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2 mb-3">
                      {settings.customOptions.statuses.length === 0 ? (
                        <p className="text-gray-500 italic">No status options added yet</p>
                      ) : (
                        settings.customOptions.statuses.map((status, index) => (
                          <div key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center">
                            {status}
                            <button 
                              onClick={() => removeCustomOption('statuses', status)}
                              className="ml-2 text-blue-500 hover:text-blue-700 focus:outline-none"
                            >
                              &times;
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                    
                    <div className="flex">
                      <input
                        type="text"
                        value={newOption.type === 'statuses' ? newOption.value : ''}
                        onChange={(e) => setNewOption({type: 'statuses', value: e.target.value})}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md"
                        placeholder="Add a status option"
                      />
                      <button
                        onClick={addCustomOption}
                        className="bg-blue-600 text-white px-4 py-2 rounded-r-md hover:bg-blue-700"
                        disabled={!newOption.value.trim() || newOption.type !== 'statuses'}
                      >
                        <FaPlus className="mr-1 inline" /> Add
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Save Button */}
              <div className="mt-8 flex justify-end">
                <button
                  onClick={saveSettings}
                  disabled={isSaving}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors disabled:opacity-50 flex items-center"
                >
                  {isSaving ? (
                    <>
                      <FaSpinner className="animate-spin mr-2" /> Saving...
                    </>
                  ) : (
                    <>
                      <FaSave className="mr-2" /> Save Settings
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SettingsPage;
