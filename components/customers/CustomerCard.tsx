import React from 'react';
import { FaUserCircle, FaPhone, FaEnvelope, FaMapMarkerAlt, FaPencilAlt } from 'react-icons/fa';

interface CustomerCardProps {
  customer: {
    id: number;
    name: string;
    phone: string;
    email: string;
    address: string;
    status: string;
    created_at?: string;
    total_spent?: number;
    last_service?: string;
  };
  onEdit?: () => void;
}

const CustomerCard: React.FC<CustomerCardProps> = ({ customer, onEdit }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center">
            <div className="bg-blue-100 p-3 rounded-full mr-4">
              <FaUserCircle className="text-blue-600 text-3xl" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{customer.name}</h2>
              <p className="text-sm text-gray-500">
                Customer since {customer.created_at 
                  ? new Date(customer.created_at).toLocaleDateString() 
                  : 'N/A'}
              </p>
            </div>
          </div>
          
          <button 
            onClick={onEdit}
            className="text-blue-600 hover:text-blue-800 focus:outline-none"
          >
            <FaPencilAlt /> <span className="sr-only">Edit</span>
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <h3 className="text-sm uppercase font-semibold text-gray-500 mb-2">Contact Information</h3>
            <div className="space-y-2">
              <p className="flex items-center text-gray-700">
                <FaPhone className="mr-2 text-gray-400" />
                {customer.phone}
              </p>
              <p className="flex items-center text-gray-700">
                <FaEnvelope className="mr-2 text-gray-400" />
                <a href={`mailto:${customer.email}`} className="text-blue-600 hover:underline">
                  {customer.email}
                </a>
              </p>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm uppercase font-semibold text-gray-500 mb-2">Address</h3>
            <p className="flex items-center text-gray-700">
              <FaMapMarkerAlt className="mr-2 text-gray-400" />
              {customer.address}
            </p>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-gray-200">
          <div>
            <h3 className="text-sm uppercase font-semibold text-gray-500">Status</h3>
            <span className={`mt-1 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
              customer.status === 'active' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-gray-100 text-gray-800'
            }`}>
              {customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
            </span>
          </div>
          
          {customer.total_spent !== undefined && (
            <div>
              <h3 className="text-sm uppercase font-semibold text-gray-500">Total Spent</h3>
              <p className="text-lg font-semibold text-gray-700">${customer.total_spent.toFixed(2)}</p>
            </div>
          )}
          
          {customer.last_service && (
            <div>
              <h3 className="text-sm uppercase font-semibold text-gray-500">Last Service</h3>
              <p className="text-gray-700">{new Date(customer.last_service).toLocaleDateString()}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerCard;
