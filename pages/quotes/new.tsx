import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import { FaArrowLeft } from 'react-icons/fa';
import Link from 'next/link';

// Validation schema for the quote form
const QuoteSchema = Yup.object().shape({
  customer_name: Yup.string().required('Customer name is required'),
  phone: Yup.string().required('Phone number is required'),
  year: Yup.number().required('Vehicle year is required').positive('Year must be positive').integer('Year must be an integer'),
  make: Yup.string().required('Vehicle make is required'),
  model: Yup.string().required('Vehicle model is required'),
  key_type: Yup.string().required('Key type is required'),
  service_type: Yup.string().required('Service type is required'),
  address: Yup.string().required('Address is required'),
});

const NewQuote = () => {
  const router = useRouter();
  
  const initialValues = {
    customer_name: '',
    phone: '',
    year: '',
    make: '',
    model: '',
    key_type: '',
    service_type: '',
    address: '',
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      // Get the API base URL from environment variables
      const apiBase = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8000/api';
      
      // Submit the form data to the API
      const response = await axios.post(`${apiBase}/quotes`, values);
      
      // Show success message
      toast.success('Quote created successfully!');
      
      // Reset the form
      resetForm();
      
      // Redirect to the quotes listing page
      router.push('/quotes');
    } catch (error) {
      // Error handled by toast notification
      toast.error('Failed to create quote. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Key type options
  const keyTypes = [
    'Standard',
    'Transponder',
    'Remote Key Fob',
    'Smart Key',
    'Laser Cut Key',
    'Valet Key',
    'Other'
  ];

  // Service type options
  const serviceTypes = [
    'Key Duplication',
    'Key Replacement',
    'Lock Repair',
    'Lock Installation',
    'Car Lockout',
    'Home Lockout',
    'Ignition Repair',
    'Emergency Service',
    'Other'
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center">
        <Link href="/quotes">
          <a className="flex items-center text-blue-600 hover:text-blue-800">
            <FaArrowLeft className="mr-2" /> Back to Quotes
          </a>
        </Link>
      </div>
      
      <h1 className="text-3xl font-bold mb-6">Create New Quote</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <Formik
          initialValues={initialValues}
          validationSchema={QuoteSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, errors, touched }) => (
            <Form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Customer Information */}
                <div>
                  <h2 className="text-xl font-semibold mb-4">Customer Information</h2>
                  
                  <div className="mb-4">
                    <label htmlFor="customer_name" className="block text-sm font-medium text-gray-700 mb-1">
                      Customer Name *
                    </label>
                    <Field
                      type="text"
                      name="customer_name"
                      id="customer_name"
                      className={`w-full p-2 border rounded-md ${
                        errors.customer_name && touched.customer_name ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    <ErrorMessage name="customer_name" component="div" className="text-red-500 text-sm mt-1" />
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number *
                    </label>
                    <Field
                      type="text"
                      name="phone"
                      id="phone"
                      className={`w-full p-2 border rounded-md ${
                        errors.phone && touched.phone ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    <ErrorMessage name="phone" component="div" className="text-red-500 text-sm mt-1" />
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                      Address *
                    </label>
                    <Field
                      type="text"
                      name="address"
                      id="address"
                      className={`w-full p-2 border rounded-md ${
                        errors.address && touched.address ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    <ErrorMessage name="address" component="div" className="text-red-500 text-sm mt-1" />
                  </div>
                </div>
                
                {/* Vehicle Information */}
                <div>
                  <h2 className="text-xl font-semibold mb-4">Vehicle Information</h2>
                  
                  <div className="mb-4">
                    <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-1">
                      Year *
                    </label>
                    <Field
                      type="number"
                      name="year"
                      id="year"
                      className={`w-full p-2 border rounded-md ${
                        errors.year && touched.year ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    <ErrorMessage name="year" component="div" className="text-red-500 text-sm mt-1" />
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="make" className="block text-sm font-medium text-gray-700 mb-1">
                      Make *
                    </label>
                    <Field
                      type="text"
                      name="make"
                      id="make"
                      className={`w-full p-2 border rounded-md ${
                        errors.make && touched.make ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    <ErrorMessage name="make" component="div" className="text-red-500 text-sm mt-1" />
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="model" className="block text-sm font-medium text-gray-700 mb-1">
                      Model *
                    </label>
                    <Field
                      type="text"
                      name="model"
                      id="model"
                      className={`w-full p-2 border rounded-md ${
                        errors.model && touched.model ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    <ErrorMessage name="model" component="div" className="text-red-500 text-sm mt-1" />
                  </div>
                </div>
              </div>
              
              {/* Service Information */}
              <div>
                <h2 className="text-xl font-semibold mb-4">Service Information</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="mb-4">
                    <label htmlFor="key_type" className="block text-sm font-medium text-gray-700 mb-1">
                      Key Type *
                    </label>
                    <Field
                      as="select"
                      name="key_type"
                      id="key_type"
                      className={`w-full p-2 border rounded-md ${
                        errors.key_type && touched.key_type ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Select Key Type</option>
                      {keyTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage name="key_type" component="div" className="text-red-500 text-sm mt-1" />
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="service_type" className="block text-sm font-medium text-gray-700 mb-1">
                      Service Type *
                    </label>
                    <Field
                      as="select"
                      name="service_type"
                      id="service_type"
                      className={`w-full p-2 border rounded-md ${
                        errors.service_type && touched.service_type ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Select Service Type</option>
                      {serviceTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage name="service_type" component="div" className="text-red-500 text-sm mt-1" />
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? 'Creating Quote...' : 'Create Quote'}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default NewQuote;