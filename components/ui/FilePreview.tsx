import React from 'react';
import { FaFile, FaImage, FaFilePdf, FaFileWord, FaFileExcel, FaFileCsv } from 'react-icons/fa';

interface FilePreviewProps {
  filename: string;
  fileType: string;
  fileSize: number;
  lastModified?: string;
  thumbnailUrl?: string;
  className?: string;
}

const FilePreview: React.FC<FilePreviewProps> = ({
  filename,
  fileType,
  fileSize,
  lastModified,
  thumbnailUrl,
  className = ''
}) => {
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString?: string): string => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    }).format(date);
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) return <FaImage className="text-blue-600" />;
    if (fileType === 'application/pdf') return <FaFilePdf className="text-red-600" />;
    if (fileType.includes('word') || fileType.includes('doc')) return <FaFileWord className="text-blue-700" />;
    if (fileType.includes('excel') || fileType.includes('sheet')) return <FaFileExcel className="text-green-700" />;
    if (fileType.includes('csv')) return <FaFileCsv className="text-green-600" />;
    return <FaFile className="text-gray-600" />;
  };

  const isImage = fileType.startsWith('image/');

  return (
    <div className={`flex flex-col overflow-hidden border border-gray-200 rounded-lg ${className}`}>
      <div className="flex-1 p-4 bg-gray-50 flex items-center justify-center">
        {isImage && thumbnailUrl ? (
          <img 
            src={thumbnailUrl} 
            alt={filename} 
            className="max-w-full max-h-32 object-contain" 
          />
        ) : (
          <div className="text-4xl p-6">
            {getFileIcon(fileType)}
          </div>
        )}
      </div>
      
      <div className="p-3 bg-white">
        <p className="font-medium text-gray-900 truncate mb-1">{filename}</p>
        <div className="text-xs text-gray-500">
          <div className="flex justify-between mb-1">
            <span>Type:</span>
            <span className="font-medium">{fileType.split('/')[1] || fileType}</span>
          </div>
          <div className="flex justify-between mb-1">
            <span>Size:</span>
            <span className="font-medium">{formatFileSize(fileSize)}</span>
          </div>
          {lastModified && (
            <div className="flex justify-between">
              <span>Modified:</span>
              <span className="font-medium">{formatDate(lastModified)}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FilePreview;
