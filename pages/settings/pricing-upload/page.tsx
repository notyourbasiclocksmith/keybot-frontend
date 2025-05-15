import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { toast, Toaster } from 'react-hot-toast';
import { FaFileUpload, FaHistory, FaCalendarAlt, FaTable, FaFile, FaCheck, FaTimes } from 'react-icons/fa';
import PageHeader from '../../../components/ui/PageHeader';
import Card from '../../../components/ui/Card';
import UploadModal from '../../../components/ui/UploadModal';
import DataTable from '../../../components/ui/DataTable';
import apiClient from '../../../lib/api';

interface PricingUpload {
  id: number;
  filename: string;
  uploaded_at: string;
  uploaded_by: string;
  row_count: number;
  status: 'completed' | 'processing' | 'failed';
  error_message?: string;
}

const PricingUploadPage: React.FC = () => {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploads, setUploads] = useState<PricingUpload[]>([]);
  const [lastUpload, setLastUpload] = useState<PricingUpload | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await apiClient.get<{ uploads: PricingUpload[] }>('/api/pricing-uploads');
        setUploads(response.uploads || []);
        
        // Set the last upload (most recent)
        if (response.uploads && response.uploads.length > 0) {
          const sortedUploads = [...response.uploads].sort((a, b) => 
            new Date(b.uploaded_at).getTime() - new Date(a.uploaded_at).getTime()
          );
          setLastUpload(sortedUploads[0]);
        }
      } catch (error) {
        console.error('Error fetching pricing uploads:', error);
        toast.error('Failed to load pricing upload history');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleUpload = async (file: File) => {
    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append('file', file);
      
      await apiClient.uploadFile<{ success: boolean, upload: PricingUpload }>(
        '/api/pricing-uploads',
        file,
        (progress) => {
          // Progress tracking is handled by the UploadModal component
        }
      );
      
      // Refresh the data after upload
      const response = await apiClient.get<{ uploads: PricingUpload[] }>('/api/pricing-uploads');
      setUploads(response.uploads || []);
      
      // Set the last upload (most recent)
      if (response.uploads && response.uploads.length > 0) {
        const sortedUploads = [...response.uploads].sort((a, b) => 
          new Date(b.uploaded_at).getTime() - new Date(a.uploaded_at).getTime()
        );
        setLastUpload(sortedUploads[0]);
      }
      
      toast.success('Pricing file uploaded successfully!');
    } catch (error) {
      console.error('Error uploading pricing file:', error);
      toast.error('Failed to upload pricing file');
    } finally {
      setIsUploading(false);
      setIsUploadModalOpen(false);
    }
  };

  // Format date to be more readable
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const uploadColumns = [
    {
      key: 'filename',
      header: 'Filename',
      render: (upload: PricingUpload) => (
        <div className="flex items-center">
          <FaFile className="text-blue-500 mr-2" />
          <span className="font-medium">{upload.filename}</span>
        </div>
      ),
    },
    {
      key: 'date',
      header: 'Date',
      render: (upload: PricingUpload) => formatDate(upload.uploaded_at),
    },
    {
      key: 'uploaded_by',
      header: 'Uploaded By',
      render: (upload: PricingUpload) => upload.uploaded_by
    },
    {
      key: 'row_count',
      header: 'Row Count',
      render: (upload: PricingUpload) => upload.row_count.toLocaleString()
    },
    {
      key: 'status',
      header: 'Status',
      render: (upload: PricingUpload) => (
        <span className={`px-2 py-1 rounded text-xs font-medium ${
          upload.status === 'completed' ? 'bg-green-100 text-green-800' :
          upload.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
          'bg-red-100 text-red-800'
        }`}>
          {upload.status === 'completed' ? (
            <><FaCheck className="inline mr-1" /> {upload.status.charAt(0).toUpperCase() + upload.status.slice(1)}</>
          ) : upload.status === 'processing' ? (
            <><FaHistory className="inline mr-1" /> {upload.status.charAt(0).toUpperCase() + upload.status.slice(1)}</>
          ) : (
            <><FaTimes className="inline mr-1" /> {upload.status.charAt(0).toUpperCase() + upload.status.slice(1)}</>
          )}
        </span>
      ),
    },
  ];

  return (
    <div className="container mx-auto p-4 max-w-7xl">
      <Head>
        <title>Pricing Upload | KeyBot</title>
      </Head>
      
      <Toaster position="top-right" />
      
      <PageHeader
        title="Pricing Upload"
        description="Upload and manage pricing data files"
        actions={
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <FaFileUpload className="mr-2" /> Upload Pricing File
          </button>
        }
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card className="col-span-1">
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <FaFileUpload className="mr-2 text-blue-600" /> Last Upload Summary
            </h3>
            
            {lastUpload ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-700">Filename</span>
                  <span className="font-medium text-gray-900">{lastUpload.filename}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-700">Upload Date</span>
                  <span className="font-medium text-gray-900">{formatDate(lastUpload.uploaded_at)}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-700">Row Count</span>
                  <span className="font-medium text-gray-900">{lastUpload.row_count.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-700">Status</span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    lastUpload.status === 'completed' ? 'bg-green-100 text-green-800' :
                    lastUpload.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {lastUpload.status.charAt(0).toUpperCase() + lastUpload.status.slice(1)}
                  </span>
                </div>
                {lastUpload.error_message && (
                  <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                    <h4 className="font-medium text-red-700 mb-1">Error Message</h4>
                    <p className="text-sm text-red-600">{lastUpload.error_message}</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center p-8">
                <FaFileUpload className="mx-auto text-gray-400 text-4xl mb-3" />
                <p className="text-gray-500 mb-4">No pricing files have been uploaded yet</p>
                <button
                  onClick={() => setIsUploadModalOpen(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <FaFileUpload className="mr-2" /> Upload Now
                </button>
              </div>
            )}
          </div>
        </Card>
        
        <Card className="col-span-1">
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <FaTable className="mr-2 text-blue-600" /> Upload Requirements
            </h3>
            <div className="prose prose-sm max-w-none">
              <p>Please ensure your pricing file meets the following requirements:</p>
              <ul className="space-y-2 my-4">
                <li className="flex items-start">
                  <FaCheck className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                  <span>CSV format with proper column headers</span>
                </li>
                <li className="flex items-start">
                  <FaCheck className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                  <span>Required columns: product_id, description, price, category</span>
                </li>
                <li className="flex items-start">
                  <FaCheck className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                  <span>Maximum file size: 10MB</span>
                </li>
                <li className="flex items-start">
                  <FaCheck className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                  <span>UTF-8 encoding</span>
                </li>
              </ul>
              <p className="text-sm text-gray-500">
                Note: Uploading a new pricing file will replace all existing pricing data. Please make sure your file is complete and accurate before uploading.
              </p>
            </div>
          </div>
        </Card>
      </div>
      
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <FaHistory className="mr-2 text-blue-600" /> Upload History
          </h3>
          <DataTable
            columns={uploadColumns}
            data={uploads}
            keyField="id"
            isLoading={isLoading}
            pagination={{
              currentPage: 1,
              totalPages: Math.ceil(uploads.length / 10),
              onPageChange: () => {}
            }}
            emptyMessage="No upload history found"
          />
        </div>
      </Card>
      
      <UploadModal
        open={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUpload={handleUpload}
        isLoading={isUploading}
        acceptedFileTypes={['text/csv', 'application/vnd.ms-excel']}
      />
    </div>
  );
};

export default PricingUploadPage;
