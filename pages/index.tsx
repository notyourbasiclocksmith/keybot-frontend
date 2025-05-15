import React from 'react';
import Link from 'next/link';

const Dashboard = () => {
  return (
    <div className="p-6 max-w-4xl mx-auto text-gray-800">
      <h1 className="text-3xl font-bold mb-6">KeyBot Dashboard</h1>
      <div className="space-y-4">
        <Link href="/upload" className="block bg-blue-600 text-white px-4 py-3 rounded shadow hover:bg-blue-700 transition">
          Upload Pricing
        </Link>
        <Link href="/quotes" className="block bg-green-600 text-white px-4 py-3 rounded shadow hover:bg-green-700 transition">
          View Quotes
        </Link>
        <Link href="/quotes/new" className="block bg-yellow-500 text-white px-4 py-3 rounded shadow hover:bg-yellow-600 transition">
          Create New Quote
        </Link>
        <Link href="/calendar" className="block bg-purple-600 text-white px-4 py-3 rounded shadow hover:bg-purple-700 transition">
          Appointment Calendar
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
