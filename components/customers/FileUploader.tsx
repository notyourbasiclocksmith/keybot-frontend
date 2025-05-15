import React, { useState, useRef } from 'react';
import { FaFile, FaFileImage, FaFilePdf, FaFileWord, FaFileExcel, FaFileAlt, FaDownload, FaTrashAlt, FaPlus, FaUpload } from 'react-icons/fa';

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
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      uploadFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      uploadFile(e.target.files[0]);
    }
  };

  const uploadFile = async (file: File) => {
    if (!onUploadFile) return;

    try {
      setIsUploading(true);
      await onUploadFile(file);
    } catch (error) {
      console.error('Error uploading file:', error);
    } finally {
      setIsUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (fileType: string) => {
    const type = fileType.toLowerCase();
    
    if (type.includes('image')) return <FaFileImage className="text-blue-500" />;
    if (type.includes('pdf')) return <FaFilePdf className="text-red-500" />;
    if (type.includes('word') || type.includes('doc')) return <FaFileWord className="text-blue-600" />;
    if (type.includes('excel') || type.includes('sheet') || type.includes('csv')) return <FaFileExcel className="text-green-600" />;
    if (type.includes('text')) return <FaFileAlt className="text-gray-600" />;
    
    return <FaFile className="text-gray-500" />;
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Files</h3>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="text-sm flex items-center text-blue-600 hover:text-blue-800"
        >
          <FaPlus className="mr-1" /> Add File
        </button>
      </div>
      
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileInputChange}
        className="hidden"
      />
      
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed p-6 rounded-lg text-center mb-6 ${
          isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
        }`}
      >
        <FaUpload className="mx-auto text-3xl text-gray-400 mb-2" />
        <p className="text-gray-600 mb-1">
          {isDragging
            ? 'Drop your file here'
            : 'Drag and drop your file here, or'
          }
        </p>
        {!isDragging && (
          <button
            onClick={() => fileInputRef.current?.click()}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            browse
          </button>
        )}
        <p className="text-xs text-gray-500 mt-1">Supports any file type up to 10MB</p>
        
        {isUploading && (
          <div className="mt-3">
            <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 rounded-full animate-pulse" style={{ width: '60%' }}></div>
            </div>
            <p className="text-sm text-gray-600 mt-1">Uploading...</p>
          </div>
        )}
      </div>
      
      {files.length === 0 ? (
        <div className="text-center p-6 bg-gray-50 border border-gray-200 rounded-md">
          <FaFile className="mx-auto text-gray-400 text-3xl mb-2" />
          <p className="text-gray-500">No files uploaded for this customer.</p>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="mt-2 text-blue-600 hover:text-blue-800"
          >
            Upload a file
          </button>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <ul className="divide-y divide-gray-200">
            {files.map((file) => (
              <li key={file.id} className="p-4 hover:bg-gray-50">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 mr-3">
                      {getFileIcon(file.file_type)}
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">{file.filename}</h4>
                      <div className="flex items-center text-xs text-gray-500 mt-1">
                        <span>{formatFileSize(file.file_size)}</span>
                        <span className="mx-1">•</span>
                        <span>{new Date(file.uploaded_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center ml-4">
                    <a
                      href={file.url}
                      download={file.filename}
                      className="text-gray-500 hover:text-gray-700 mr-3"
                      title="Download"
                    >
                      <FaDownload />
                      <span className="sr-only">Download</span>
                    </a>
                    {onDeleteFile && (
                      <button
                        onClick={() => onDeleteFile(file.id)}
                        className="text-gray-500 hover:text-red-600"
                        title="Delete"
                      >
                        <FaTrashAlt />
                        <span className="sr-only">Delete</span>
                      </button>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default FileUploader;
