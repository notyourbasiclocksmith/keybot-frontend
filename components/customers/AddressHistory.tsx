import React, { useState } from 'react';
import { FaMapMarkerAlt, FaCalendarAlt, FaPlus, FaTrash, FaSave, FaTimes } from 'react-icons/fa';

interface Address {
  id: number;
  address: string;
  city: string;
  state: string;
  zipcode: string;
  is_primary: boolean;
  created_at: string;
}

interface AddressHistoryProps {
  customerId: number;
  addresses: Address[];
  onAddAddress?: (address: Omit<Address, 'id' | 'created_at'>) => Promise<void>;
  onDeleteAddress?: (addressId: number) => Promise<void>;
  onSetPrimary?: (addressId: number) => Promise<void>;
}

const AddressHistory: React.FC<AddressHistoryProps> = ({
  customerId,
  addresses,
  onAddAddress,
  onDeleteAddress,
  onSetPrimary,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    address: '',
    city: '',
    state: '',
    zipcode: '',
    is_primary: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!onAddAddress) return;

    try {
      setIsSubmitting(true);
      await onAddAddress(newAddress);
      setNewAddress({
        address: '',
        city: '',
        state: '',
        zipcode: '',
        is_primary: false,
      });
      setShowAddForm(false);
    } catch (error) {
      console.error('Error adding address:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    
    setNewAddress({
      ...newAddress,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Address History</h3>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="text-sm flex items-center text-blue-600 hover:text-blue-800"
        >
          {showAddForm ? (
            <>
              <FaTimes className="mr-1" /> Cancel
            </>
          ) : (
            <>
              <FaPlus className="mr-1" /> Add Address
            </>
          )}
        </button>
      </div>

      {showAddForm && (
        <div className="bg-gray-50 border border-gray-200 rounded-md p-4 mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Add New Address</h4>
          <form onSubmit={handleAddressSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                  Street Address
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={newAddress.address}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                  City
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={newAddress.city}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                  State
                </label>
                <input
                  type="text"
                  id="state"
                  name="state"
                  value={newAddress.state}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label htmlFor="zipcode" className="block text-sm font-medium text-gray-700 mb-1">
                  ZIP Code
                </label>
                <input
                  type="text"
                  id="zipcode"
                  name="zipcode"
                  value={newAddress.zipcode}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                id="is_primary"
                name="is_primary"
                checked={newAddress.is_primary}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="is_primary" className="ml-2 block text-sm text-gray-700">
                Set as primary address
              </label>
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="mr-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {isSubmitting ? 'Saving...' : 'Save Address'}
              </button>
            </div>
          </form>
        </div>
      )}

      {addresses.length === 0 ? (
        <div className="text-center p-6 bg-gray-50 border border-gray-200 rounded-md">
          <FaMapMarkerAlt className="mx-auto text-gray-400 text-3xl mb-2" />
          <p className="text-gray-500">No addresses found for this customer.</p>
          <button
            onClick={() => setShowAddForm(true)}
            className="mt-2 text-blue-600 hover:text-blue-800"
          >
            Add an address
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {addresses.map((address) => (
            <div
              key={address.id}
              className={`p-4 border rounded-md flex flex-col md:flex-row md:items-center justify-between ${
                address.is_primary ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200'
              }`}
            >
              <div className="flex-grow">
                <div className="flex items-start">
                  <FaMapMarkerAlt
                    className={`mt-1 mr-2 ${address.is_primary ? 'text-blue-500' : 'text-gray-400'}`}
                  />
                  <div>
                    <p className="text-gray-900 font-medium">
                      {address.address}, {address.city}, {address.state} {address.zipcode}
                    </p>
                    <div className="flex items-center mt-1 text-sm text-gray-500">
                      <FaCalendarAlt className="mr-1" />
                      <span>Added on {new Date(address.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center mt-3 md:mt-0 md:ml-4">
                {!address.is_primary && onSetPrimary && (
                  <button
                    onClick={() => onSetPrimary(address.id)}
                    className="text-sm text-blue-600 hover:text-blue-800 mr-3"
                  >
                    Set as Primary
                  </button>
                )}
                {onDeleteAddress && (
                  <button
                    onClick={() => onDeleteAddress(address.id)}
                    className="text-sm text-red-600 hover:text-red-800 flex items-center"
                  >
                    <FaTrash className="mr-1" /> Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AddressHistory;
