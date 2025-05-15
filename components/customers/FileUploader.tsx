import React, { useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import UploadModal from '../ui/UploadModal';
import FileList from '../ui/FileList';

interface CustomerFile {
  id: number;
  filename: string;
  file_type: string;
  file_size: number;
  uploaded_at: string;
  url: string;
}

interface FileUploaderProps {
  customerId: number;
  files: CustomerFile[];
  onUploadFile?: (file: File) => Promise<void>;
  onDeleteFile?: (fileId: number) => Promise<void>;
}

const FileUploader: React.FC<FileUploaderProps> = ({
  customerId,
  files,
  onUploadFile,
  onDeleteFile,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const handleUpload = async (file: File) => {
    if (!onUploadFile) return;
    
    try {
      setIsUploading(true);
      await onUploadFile(file);
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error; // Let the UploadModal handle the error display
    } finally {
      setIsUploading(false);
    }
  };



  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Files</h3>
        <button
          onClick={() => setIsUploadModalOpen(true)}
          className="text-sm flex items-center text-blue-600 hover:text-blue-800"
        >
          <FaPlus className="mr-1" /> Add File
        </button>
      </div>

      {/* Upload Modal */}
      <UploadModal
        open={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUpload={handleUpload}
        isLoading={isUploading}
        acceptedFileTypes={['application/pdf', 'image/*', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']}
      />
      
      {/* File List */}
      <FileList 
        files={files}
        onDelete={onDeleteFile}
        downloadEnabled={true}
      />
    </div>
  );
};

export default FileUploader;
