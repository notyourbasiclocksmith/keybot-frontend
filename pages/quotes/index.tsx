import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';
import { FaSearch, FaSpinner, FaClipboard, FaFilter, FaPlus, FaMicrophone } from 'react-icons/fa';
import { QuotesSkeleton } from '../../components/SkeletonLoader';

interface Quote {
  id: string;
  quote_number: string;
  customer_name: string;
  phone_number: string;
  vehicle_make: string;
  vehicle_model: string;
  vehicle_year: string;
  key_type: string;
  service_type: string;
  price: number;
  status: string;
  created_at: string;
  has_recording: boolean;
}

export default function QuotesPage() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [filteredQuotes, setFilteredQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Fetch quotes on component mount
  useEffect(() => {
    fetchQuotes();
  }, []);

  // Apply filters and sorting whenever dependencies change
  useEffect(() => {
    applyFiltersAndSort();
  }, [quotes, searchTerm, statusFilter, sortBy, sortOrder]);

  const fetchQuotes = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE}/quotes`);
      
      if (response.data && response.data.success) {
        setQuotes(response.data.data || []);
      } else {
        throw new Error(response.data?.message || 'Failed to fetch quotes');
      }
    } catch (error) {
      console.error('Error fetching quotes:', error);
      toast.error('Failed to load quotes');
    } finally {
      setLoading(false);
    }
  };

  const applyFiltersAndSort = () => {
    // First apply search term filter
    let result = quotes.filter(quote => {
      const searchLower = searchTerm.toLowerCase();
      return (
        quote.quote_number.toLowerCase().includes(searchLower) ||
        quote.customer_name.toLowerCase().includes(searchLower) ||
        quote.vehicle_make.toLowerCase().includes(searchLower) ||
        quote.vehicle_model.toLowerCase().includes(searchLower)
      );
    });
    
    // Then apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(quote => quote.status === statusFilter);
    }
    
    // Sort the results
    result.sort((a: any, b: any) => {
      let valueA = a[sortBy];
      let valueB = b[sortBy];
      
      // Special handling for dates
      if (sortBy === 'created_at') {
        valueA = new Date(valueA).getTime();
        valueB = new Date(valueB).getTime();
      }
      
      if (valueA < valueB) return sortOrder === 'asc' ? -1 : 1;
      if (valueA > valueB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
    
    setFilteredQuotes(result);
  };

  const handleSort = (field: string) => {
    if (sortBy === field) {
      // Toggle sort order if clicking the same field
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      // New field, set as default desc order
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleStatusFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1); // Reset to first page when filtering
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredQuotes.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const totalPages = Math.ceil(filteredQuotes.length / itemsPerPage);
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-200 text-yellow-800';
      case 'confirmed':
        return 'bg-green-200 text-green-800';
      case 'completed':
        return 'bg-blue-200 text-blue-800';
      case 'cancelled':
        return 'bg-red-200 text-red-800';
      default:
        return 'bg-gray-200 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Head>
        <title>Quotes | KeyBot</title>
      </Head>
      
      <Toaster position="top-right" />
      
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold flex items-center">
          <FaClipboard className="mr-2 text-blue-600" /> Quotes Management
        </h1>
        
        <Link href="/quotes/new" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center">
          <FaPlus className="mr-2" /> New Quote
        </Link>
      </div>
      
      {/* Filters & Search */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Search quote number, customer, or vehicle..."
              className="w-full px-4 py-2 pr-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <FaSearch />
            </span>
          </div>
          
          <div className="flex items-center space-x-2 whitespace-nowrap">
            <FaFilter className="text-gray-500" />
            <select
              value={statusFilter}
              onChange={handleStatusFilterChange}
              className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Quotes Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-6">
              <QuotesSkeleton />
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('quote_number')}
                  >
                    Quote #
                    {sortBy === 'quote_number' && (
                      <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('customer_name')}
                  >
                    Customer
                    {sortBy === 'customer_name' && (
                      <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vehicle
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('key_type')}
                  >
                    Key Type
                    {sortBy === 'key_type' && (
                      <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('price')}
                  >
                    Price
                    {sortBy === 'price' && (
                      <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('status')}
                  >
                    Status
                    {sortBy === 'status' && (
                      <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('created_at')}
                  >
                    Created At
                    {sortBy === 'created_at' && (
                      <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentItems.length > 0 ? (
                  currentItems.map(quote => (
                    <tr key={quote.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {quote.quote_number}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div>{quote.customer_name}</div>
                        <div className="text-gray-500 text-xs">{quote.phone_number}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div>{quote.vehicle_year} {quote.vehicle_make} {quote.vehicle_model}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {quote.key_type}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        ${quote.price.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(quote.status)}`}>
                          {quote.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(quote.created_at)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm space-x-3">
                        <Link href={`/quotes/${quote.quote_number}`} className="text-blue-600 hover:text-blue-800">
                          View
                        </Link>
                        
                        {quote.has_recording ? (
                          <Link href={`/recording/${quote.quote_number}`} className="text-green-600 hover:text-green-800 inline-flex items-center">
                            <FaMicrophone className="mr-1" /> Recording
                          </Link>
                        ) : (
                          <Link href={`/recording/${quote.quote_number}`} className="text-gray-400 hover:text-gray-600 inline-flex items-center">
                            <FaMicrophone className="mr-1" /> Add Recording
                          </Link>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="px-6 py-16 text-center text-lg text-gray-500">
                      {searchTerm || statusFilter !== 'all' ? (
                        <div>
                          <p>No quotes found matching your filters</p>
                          <button 
                            onClick={() => {
                              setSearchTerm('');
                              setStatusFilter('all');
                            }}
                            className="mt-2 text-blue-600 hover:text-blue-800 text-base"
                          >
                            Clear filters
                          </button>
                        </div>
                      ) : (
                        <div>
                          <p>No quotes have been created yet</p>
                          <Link href="/quotes/new" className="mt-2 text-blue-600 hover:text-blue-800 text-base block">
                            Create your first quote
                          </Link>
                        </div>
                      )}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
        
        {/* Pagination */}
        {!loading && filteredQuotes.length > 0 && (
          <div className="px-6 py-4 border-t flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredQuotes.length)} of {filteredQuotes.length} quotes
            </div>
            
            <div className="flex space-x-1">
              <button 
                onClick={() => paginate(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600 hover:bg-blue-100'}`}
              >
                &laquo; Prev
              </button>
              
              {pageNumbers.map(number => (
                <button
                  key={number}
                  onClick={() => paginate(number)}
                  className={`px-3 py-1 rounded ${number === currentPage ? 'bg-blue-600 text-white' : 'text-blue-600 hover:bg-blue-100'}`}
                >
                  {number}
                </button>
              ))}
              
              <button 
                onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 rounded ${currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600 hover:bg-blue-100'}`}
              >
                Next &raquo;
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
