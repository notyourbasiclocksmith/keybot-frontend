import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { FaSearch, FaUserCircle, FaPhone, FaEnvelope, FaMapMarkerAlt, FaSpinner, FaPlus } from 'react-icons/fa';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';

// Dummy data for initial development
const dummyCustomers = [
  {
    id: 1,
    name: 'John Doe',
    phone: '(555) 123-4567',
    email: 'john.doe@example.com',
    address: '123 Main St, Anytown, CA 90210',
    lastService: '2023-04-15',
    totalSpent: 450.00,
    status: 'active'
  },
  {
    id: 2,
    name: 'Jane Smith',
    phone: '(555) 987-6543',
    email: 'jane.smith@example.com',
    address: '456 Oak Ave, Somecity, CA 90211',
    lastService: '2023-03-22',
    totalSpent: 275.50,
    status: 'active'
  },
  {
    id: 3,
    name: 'Robert Johnson',
    phone: '(555) 456-7890',
    email: 'robert.johnson@example.com',
    address: '789 Pine Rd, Othertown, CA 90212',
    lastService: '2023-01-10',
    totalSpent: 850.75,
    status: 'inactive'
  },
  {
    id: 4,
    name: 'Sarah Williams',
    phone: '(555) 567-8901',
    email: 'sarah.williams@example.com',
    address: '321 Elm Blvd, Newcity, CA 90213',
    lastService: '2023-05-02',
    totalSpent: 125.25,
    status: 'active'
  },
  {
    id: 5,
    name: 'Michael Brown',
    phone: '(555) 678-9012',
    email: 'michael.brown@example.com',
    address: '654 Cedar Ln, Anothercity, CA 90214',
    lastService: '2022-12-18',
    totalSpent: 520.00,
    status: 'inactive'
  }
];

const CustomerListPage = () => {
  const [customers, setCustomers] = useState(dummyCustomers);
  const [filteredCustomers, setFilteredCustomers] = useState(dummyCustomers);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Fetch customers from API (commented out for now, using dummy data)
  useEffect(() => {
    // fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE}/customers`);
      
      if (response.data && response.data.success) {
        setCustomers(response.data.data);
        setFilteredCustomers(response.data.data);
      } else {
        toast.error('Failed to load customers data.');
      }
    } catch (error) {
      console.error('Error fetching customers:', error);
      toast.error('Error connecting to the server. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  // Filter customers based on search term and status
  useEffect(() => {
    const filtered = customers.filter(customer => {
      const matchesSearch = 
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.phone.includes(searchTerm) ||
        customer.address.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = 
        statusFilter === 'all' || 
        customer.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
    
    setFilteredCustomers(filtered);
  }, [searchTerm, statusFilter, customers]);

  return (
    <div className="container mx-auto px-4 py-8">
      <Head>
        <title>Customers | KeyBot</title>
      </Head>
      
      <Toaster position="top-right" />
      
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Customers</h1>
        <Link 
          href="/customers/new" 
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center"
        >
          <FaPlus className="mr-2" /> Add Customer
        </Link>
      </div>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <div className="p-4 border-b border-gray-200 bg-gray-50 flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Search by name, email, phone or address..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
          </div>
          
          <div className="md:w-48">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
        
        {isLoading ? (
          <div className="p-8 text-center">
            <FaSpinner className="animate-spin inline-block text-3xl text-blue-600 mb-2" />
            <p>Loading customers...</p>
          </div>
        ) : filteredCustomers.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Service</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Spent</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCustomers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link href={`/customers/${customer.id}`} className="flex items-center text-blue-600 hover:text-blue-800">
                        <FaUserCircle className="mr-2 text-gray-400 text-xl" />
                        <span className="font-medium">{customer.name}</span>
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 flex items-center mb-1">
                        <FaPhone className="mr-2 text-gray-400" /> {customer.phone}
                      </div>
                      <div className="text-sm text-gray-900 flex items-center">
                        <FaEnvelope className="mr-2 text-gray-400" /> {customer.email}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 flex items-center">
                        <FaMapMarkerAlt className="mr-2 text-gray-400" /> {customer.address}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {customer.lastService ? new Date(customer.lastService).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ${customer.totalSpent.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        customer.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-gray-500">
            No customers found matching your search criteria.
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerListPage;
