import { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';
import { FaFileExcel, FaUpload, FaSync, FaDownload, FaSearch } from 'react-icons/fa';
import Head from 'next/head';

interface PricingItem {
  make: string;
  model: string;
  year: string;
  key_type: string;
  service: string;
  price: number;
}

interface PricingSummary {
  total: number;
  last_upload: string;
}

export default function Upload() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [pricingData, setPricingData] = useState<PricingItem[]>([]);
  const [pricingSummary, setPricingSummary] = useState<PricingSummary>({ total: 0, last_upload: 'N/A' });
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch pricing data on component mount
  useEffect(() => {
    fetchPricingData();
  }, []);

  const fetchPricingData = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE}/pricing`);
      setPricingData(response.data.items || []);
      setPricingSummary({
        total: response.data.total || 0,
        last_upload: response.data.last_upload || 'N/A'
      });
    } catch (error) {
      // Error handled by toast notification
      toast.error('Failed to load pricing data');
    }
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const selectedFile = acceptedFiles[0];
      // Check if file is Excel
      if (
        selectedFile.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
        selectedFile.type === 'application/vnd.ms-excel'
      ) {
        setFile(selectedFile);
      } else {
        toast.error('Please upload an Excel file (.xlsx or .xls)');
      }
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls']
    },
  });

  const handleUpload = async () => {
    if (!file) {
      toast.error('Please select a file to upload');
      return;
    }

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE}/pricing/upload`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.data.success) {
        toast.success('File uploaded successfully');
        setFile(null);
        fetchPricingData(); // Refresh pricing data
      } else {
        toast.error(response.data.message || 'Upload failed');
      }
    } catch (error: any) {
      // Error handled by toast notification
      toast.error(error.response?.data?.message || 'Error uploading file');
    } finally {
      setIsUploading(false);
    }
  };

  const downloadTemplate = () => {
    window.open(`${process.env.NEXT_PUBLIC_API_BASE}/static/templates/pricing_template.xlsx`, '_blank');
  };

  const downloadCurrentData = () => {
    window.open(`${process.env.NEXT_PUBLIC_API_BASE}/pricing/download`, '_blank');
  };

  const filteredPricingData = pricingData.filter(item => {
    const searchLower = searchTerm.toLowerCase();
    return (
      item.make.toLowerCase().includes(searchLower) ||
      item.model.toLowerCase().includes(searchLower) ||
      item.year.toLowerCase().includes(searchLower) ||
      item.key_type.toLowerCase().includes(searchLower) ||
      item.service.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <Head>
        <title>Pricing Data Upload - Car Pricing Bot</title>
      </Head>
      
      <Toaster position="top-right" />
      
      {/* Header */}
      <div className="flex items-center mb-6">
        <h1 className="text-2xl font-bold flex items-center mr-4">
          <FaFileExcel className="mr-2 text-green-600" /> Pricing Data Upload
        </h1>
        <button 
          onClick={fetchPricingData}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-1 rounded flex items-center mr-2 text-sm"
        >
          <FaSync className="mr-1" /> Refresh
        </button>
        <button 
          onClick={downloadTemplate}
          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded flex items-center text-sm"
        >
          <FaDownload className="mr-1" /> Download Template
        </button>
      </div>
      
      {/* Upload and Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 pb-2 border-b border-blue-500">Upload Pricing Data</h2>
          
          {/* Dropzone */}
          <div 
            {...getRootProps()} 
            className={`border-2 border-dashed rounded-md p-8 text-center mb-4 transition-colors ${
              isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50 hover:border-blue-500 hover:bg-blue-50'
            }`}
          >
            <input {...getInputProps()} />
            <div className="text-center">
              <FaUpload className="mx-auto text-4xl text-gray-500 mb-3" />
              <h3 className="font-medium text-lg mb-2">Drag & Drop Excel File Here</h3>
              <p className="text-gray-500 mb-4">or click to browse files</p>
              <button type="button" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
                Browse Files
              </button>
            </div>
          </div>
          
          {/* Selected file info */}
          {file && (
            <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mb-4">
              <p className="font-semibold">Selected File:</p>
              <p className="text-gray-700">{file.name}</p>
            </div>
          )}
          
          {/* Upload buttons */}
          <div className="flex flex-col gap-2">
            <button 
              onClick={handleUpload} 
              disabled={!file || isUploading} 
              className={`bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center justify-center ${(!file || isUploading) ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isUploading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Uploading...
                </>
              ) : (
                <>
                  <FaUpload className="mr-2" /> Upload Pricing File
                </>
              )}
            </button>
            <button 
              onClick={downloadCurrentData}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded flex items-center justify-center"
            >
              <FaDownload className="mr-2" /> Download Current Pricing Data
            </button>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 pb-2 border-b border-blue-500">Template Information</h2>
          <p className="mb-4">Please ensure your Excel file follows the required format:</p>
          
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 border text-left text-sm font-medium">Column</th>
                  <th className="px-4 py-2 border text-left text-sm font-medium">Description</th>
                  <th className="px-4 py-2 border text-left text-sm font-medium">Required</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-4 py-2 border"><code className="bg-gray-100 px-1 py-0.5 rounded">make</code></td>
                  <td className="px-4 py-2 border">Vehicle make (e.g., Toyota, Honda)</td>
                  <td className="px-4 py-2 border"><span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">Yes</span></td>
                </tr>
                <tr>
                  <td className="px-4 py-2 border"><code className="bg-gray-100 px-1 py-0.5 rounded">model</code></td>
                  <td className="px-4 py-2 border">Vehicle model (e.g., Camry, Civic)</td>
                  <td className="px-4 py-2 border"><span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">Yes</span></td>
                </tr>
                <tr>
                  <td className="px-4 py-2 border"><code className="bg-gray-100 px-1 py-0.5 rounded">year</code></td>
                  <td className="px-4 py-2 border">Vehicle year (e.g., 2020)</td>
                  <td className="px-4 py-2 border"><span className="bg-gray-600 text-white text-xs font-bold px-2 py-1 rounded">No</span></td>
                </tr>
                <tr>
                  <td className="px-4 py-2 border"><code className="bg-gray-100 px-1 py-0.5 rounded">key_type</code></td>
                  <td className="px-4 py-2 border">Type of key (e.g., Standard, Proximity)</td>
                  <td className="px-4 py-2 border"><span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">Yes</span></td>
                </tr>
                <tr>
                  <td className="px-4 py-2 border"><code className="bg-gray-100 px-1 py-0.5 rounded">price</code></td>
                  <td className="px-4 py-2 border">Price (numeric value)</td>
                  <td className="px-4 py-2 border"><span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">Yes</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      {/* Current Pricing Data Table */}
      <div className="bg-white rounded-lg shadow-md mt-6">
        <div className="bg-blue-600 text-white rounded-t-lg px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
            </svg>
            Current Pricing Data
          </h2>
          <div className="flex items-center">
            <div className="relative mr-2">
              <input
                type="text"
                className="py-1 px-3 pr-8 rounded text-sm text-gray-800 border focus:outline-none focus:ring-2 focus:ring-blue-300"
                placeholder="Search pricing data..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <FaSearch className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500" />
            </div>
            <button 
              onClick={fetchPricingData}
              className="bg-white text-blue-600 rounded px-3 py-1 text-sm flex items-center hover:bg-blue-50"
            >
              <FaSync className="mr-1" /> Refresh
            </button>
          </div>
        </div>
        
        <div className="p-4">
          <div className="flex items-center mb-3">
            <span className="bg-green-600 text-white text-xs font-bold px-2 py-1 rounded mr-2">{pricingSummary.total} items</span>
            <span className="text-gray-500 text-sm">Last updated: {pricingSummary.last_upload}</span>
          </div>
          
          <div className="overflow-x-auto max-h-[500px]">
            <table className="min-w-full border-collapse">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Make</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Model</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Year</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Key Type</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Service</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Price</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredPricingData.length > 0 ? (
                  filteredPricingData.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-2 text-sm">{item.make}</td>
                      <td className="px-4 py-2 text-sm">{item.model}</td>
                      <td className="px-4 py-2 text-sm">{item.year}</td>
                      <td className="px-4 py-2 text-sm">{item.key_type}</td>
                      <td className="px-4 py-2 text-sm">{item.service}</td>
                      <td className="px-4 py-2 text-sm font-medium">${item.price.toFixed(2)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-4 py-4 text-center text-gray-500">
                      No pricing data available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}