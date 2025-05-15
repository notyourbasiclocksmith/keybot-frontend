import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { FaUpload, FaSpinner, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import Modal from './Modal';
import Button from './Button';

interface UploadModalProps {
  open: boolean;
  onClose: () => void;
  onUpload: (file: File) => Promise<void>;
  acceptedFileTypes?: string[];
  isLoading?: boolean;
}

const UploadModal: React.FC<UploadModalProps> = ({
  open,
  onClose,
  onUpload,
  acceptedFileTypes,
  isLoading = false
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      setStatus('idle');
      setProgress(0);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedFileTypes 
      ? acceptedFileTypes.reduce((acc, type) => ({...acc, [type]: []}), {})
      : undefined,
    maxFiles: 1,
  });

  const handleUpload = async () => {
    if (!file) return;
    
    try {
      setStatus('uploading');
      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + Math.random() * 10;
          return newProgress >= 90 ? 90 : newProgress;
        });
      }, 300);
      
      await onUpload(file);
      
      clearInterval(progressInterval);
      setProgress(100);
      setStatus('success');
      
      // Reset after successful upload
      setTimeout(() => {
        setFile(null);
        setProgress(0);
        setStatus('idle');
        onClose();
      }, 1500);
    } catch (error) {
      setStatus('error');
      console.error('Upload failed:', error);
    }
  };

  return (
    <Modal isOpen={open} onClose={onClose} title="Upload File">
      <div className="p-4">
        {status !== 'success' && status !== 'error' && (
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'
            }`}
          >
            <input {...getInputProps()} />
            <FaUpload className="mx-auto text-3xl text-gray-400 mb-4" />
            <p className="text-gray-600 mb-2">
              {isDragActive ? 'Drop the file here' : 'Drag & drop a file here, or click to select'}
            </p>
            {acceptedFileTypes && (
              <p className="text-xs text-gray-500">
                Accepted file types: {acceptedFileTypes.join(', ')}
              </p>
            )}
          </div>
        )}

        {file && status === 'idle' && (
          <div className="mt-4 p-3 bg-gray-50 rounded border border-gray-200">
            <p className="font-medium text-gray-800 truncate">{file.name}</p>
            <p className="text-sm text-gray-500">{(file.size / 1024).toFixed(2)} KB</p>
          </div>
        )}

        {status === 'uploading' && (
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Uploading...</span>
              <span className="text-sm text-gray-500">{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-blue-600 h-2.5 rounded-full" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        )}

        {status === 'success' && (
          <div className="mt-4 p-4 bg-green-50 rounded border border-green-200 flex items-center">
            <FaCheckCircle className="text-green-500 text-xl mr-3" />
            <div>
              <p className="font-medium text-green-800">Upload Successful</p>
              <p className="text-sm text-green-600">{file?.name} has been uploaded</p>
            </div>
          </div>
        )}

        {status === 'error' && (
          <div className="mt-4 p-4 bg-red-50 rounded border border-red-200 flex items-center">
            <FaTimesCircle className="text-red-500 text-xl mr-3" />
            <div>
              <p className="font-medium text-red-800">Upload Failed</p>
              <p className="text-sm text-red-600">There was a problem uploading your file</p>
            </div>
          </div>
        )}

        <div className="mt-6 flex justify-end space-x-3">
          <Button variant="outline" onClick={onClose} disabled={isLoading || status === 'uploading'}>
            Cancel
          </Button>
          <Button 
            onClick={handleUpload} 
            disabled={!file || isLoading || status === 'uploading' || status === 'success'}
            className="ml-3"
          >
            {(isLoading || status === 'uploading') ? (
              <>
                <FaSpinner className="animate-spin mr-2" />
                Uploading...
              </>
            ) : 'Upload File'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default UploadModal;
