import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { toast, Toaster } from 'react-hot-toast';
import { FaPhoneAlt, FaCalendarAlt, FaHistory, FaExternalLinkAlt } from 'react-icons/fa';
import PageHeader from '../../components/ui/PageHeader';
import Card from '../../components/ui/Card';
import DataTable from '../../components/ui/DataTable';
import apiClient from '../../lib/api';

interface Quote {
  id: number;
  quote_number: string;
  customer_name: string;
  customer_phone: string;
  timestamp: string;
  amount: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
}

interface RecentCall {
  id: number;
  phone_number: string;
  timestamp: string;
  duration: number;
  call_type: string;
  notes?: string;
  recording_url?: string;
}

const ReceptionistDashboard: React.FC = () => {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [recentCalls, setRecentCalls] = useState<RecentCall[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch quotes data
        const quotesResponse = await apiClient.get<{ quotes: Quote[] }>('/api/vapi-calls?include_quotes=true');
        setQuotes(quotesResponse.quotes || []);
        
        // Fetch recent calls
        const callsResponse = await apiClient.get<{ calls: RecentCall[] }>('/api/vapi-calls');
        setRecentCalls(callsResponse.calls || []);
      } catch (error) {
        console.error('Error fetching receptionist data:', error);
        toast.error('Failed to load dashboard data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Format date to be more readable
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  // Format phone number for display
  const formatPhoneNumber = (phone: string) => {
    const cleaned = ('' + phone).replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return '(' + match[1] + ') ' + match[2] + '-' + match[3];
    }
    return phone;
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  // Format call duration
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const quoteColumns = [
    {
      key: 'quote_number',
      header: 'Quote #',
      render: (quote: Quote) => (
        <div className="font-medium">{quote.quote_number}</div>
      ),
    },
    {
      key: 'customer',
      header: 'Customer',
      render: (quote: Quote) => (
        <div>
          <div>{quote.customer_name}</div>
          <div className="text-xs text-gray-500">{formatPhoneNumber(quote.customer_phone)}</div>
        </div>
      ),
    },
    {
      key: 'date',
      header: 'Date',
      render: (quote: Quote) => formatDate(quote.timestamp),
    },
    {
      key: 'amount',
      header: 'Amount',
      render: (quote: Quote) => formatCurrency(quote.amount),
    },
    {
      key: 'status',
      header: 'Status',
      render: (quote: Quote) => (
        <span className={`px-2 py-1 rounded text-xs font-medium ${
          quote.status === 'completed' ? 'bg-green-100 text-green-800' :
          quote.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
          quote.status === 'cancelled' ? 'bg-red-100 text-red-800' :
          'bg-yellow-100 text-yellow-800'
        }`}>
          {quote.status.charAt(0).toUpperCase() + quote.status.slice(1)}
        </span>
      ),
    },
    {
      key: 'recording',
      header: 'Recording',
      render: (quote: Quote) => (
        <Link href={`/recording/${quote.quote_number}`} className="text-blue-600 hover:text-blue-800 inline-flex items-center">
          <FaExternalLinkAlt className="mr-1" size={12} />
          View
        </Link>
      ),
    },
  ];

  const callColumns = [
    {
      key: 'phone',
      header: 'Phone',
      render: (call: RecentCall) => formatPhoneNumber(call.phone_number),
    },
    {
      key: 'time',
      header: 'Time',
      render: (call: RecentCall) => formatDate(call.timestamp),
    },
    {
      key: 'duration',
      header: 'Duration',
      render: (call: RecentCall) => formatDuration(call.duration),
    },
    {
      key: 'type',
      header: 'Type',
      render: (call: RecentCall) => (
        <span className={`px-2 py-1 rounded text-xs font-medium ${
          call.call_type === 'incoming' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
        }`}>
          {call.call_type.charAt(0).toUpperCase() + call.call_type.slice(1)}
        </span>
      ),
    },
    {
      key: 'recording',
      header: 'Recording',
      render: (call: RecentCall) => call.recording_url ? (
        <a href={call.recording_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
          <FaExternalLinkAlt />
        </a>
      ) : (
        <span className="text-gray-400">N/A</span>
      ),
    },
  ];

  return (
    <div className="container mx-auto p-4 max-w-7xl">
      <Head>
        <title>Receptionist Dashboard | KeyBot</title>
      </Head>
      
      <Toaster position="top-right" />
      
      <PageHeader
        title="Receptionist Dashboard"
        description="Manage incoming calls and quotes"
        actions={<div className="flex items-center"><FaPhoneAlt className="mr-2" /> Active Calls: {recentCalls.length}</div>}
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card className="lg:col-span-1">
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <FaCalendarAlt className="mr-2 text-blue-600" /> Today's Summary
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-700">Total Calls</span>
                <span className="text-xl font-semibold">{recentCalls.filter(call => {
                  const today = new Date();
                  const callDate = new Date(call.timestamp);
                  return callDate.setHours(0, 0, 0, 0) === today.setHours(0, 0, 0, 0);
                }).length}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-700">New Quotes</span>
                <span className="text-xl font-semibold">{quotes.filter(quote => {
                  const today = new Date();
                  const quoteDate = new Date(quote.timestamp);
                  return quoteDate.setHours(0, 0, 0, 0) === today.setHours(0, 0, 0, 0);
                }).length}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-700">Quote Value</span>
                <span className="text-xl font-semibold">{formatCurrency(
                  quotes.filter(quote => {
                    const today = new Date();
                    const quoteDate = new Date(quote.timestamp);
                    return quoteDate.setHours(0, 0, 0, 0) === today.setHours(0, 0, 0, 0);
                  }).reduce((sum, quote) => sum + quote.amount, 0)
                )}</span>
              </div>
            </div>
          </div>
        </Card>
        
        <Card className="lg:col-span-2">
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <FaPhoneAlt className="mr-2 text-blue-600" /> Recent Calls
            </h3>
            <DataTable
              columns={callColumns}
              data={recentCalls.slice(0, 5)}
              keyField="id"
              isLoading={isLoading}
              emptyMessage="No recent calls found"
            />
            <div className="mt-4 text-right">
              <Link href="/calls" className="text-blue-600 hover:text-blue-800">
                View all calls →
              </Link>
            </div>
          </div>
        </Card>
      </div>
      
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <FaHistory className="mr-2 text-blue-600" /> Quote History
          </h3>
          <DataTable
            columns={quoteColumns}
            data={quotes}
            keyField="id"
            isLoading={isLoading}
            pagination={{
              currentPage: 1,
              totalPages: Math.ceil(quotes.length / 10),
              onPageChange: () => {}
            }}
            emptyMessage="No quotes found"
          />
        </div>
      </Card>
    </div>
  );
};

export default ReceptionistDashboard;
