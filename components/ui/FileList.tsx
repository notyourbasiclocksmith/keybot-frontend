import React from 'react';
import { FaFile, FaDownload, FaTrash, FaImage, FaFilePdf, FaFileWord, FaFileExcel, FaFileCsv } from 'react-icons/fa';
import Card from './Card';
import Button from './Button';

interface FileMetadata {
  id: number;
  filename: string;
  file_type: string;
  file_size: number;
  uploaded_at: string;
  url: string;
}

interface FileListProps {
  files: FileMetadata[];
  onDelete?: (fileId: number) => void;
  downloadEnabled: boolean;
}

const FileList: React.FC<FileListProps> = ({ files, onDelete, downloadEnabled = true }) => {
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string): string => {
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

  if (files.length === 0) {
    return (
      <Card className="text-center p-8">
        <p className="text-gray-500 mb-4">No files have been uploaded yet</p>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <div className="divide-y divide-gray-200">
        {files.map((file) => (
          <div key={file.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
            <div className="flex items-center space-x-3 flex-1">
              <div className="text-xl">{getFileIcon(file.file_type)}</div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate">{file.filename}</p>
                <div className="flex flex-wrap text-sm text-gray-500 gap-x-4">
                  <span>{formatFileSize(file.file_size)}</span>
                  <span>•</span>
                  <span>{formatDate(file.uploaded_at)}</span>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-2">
              {downloadEnabled && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(file.url, '_blank')}
                  title="Download file"
                >
                  <FaDownload className="text-gray-600" />
                </Button>
              )}
              
              {onDelete && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDelete(file.id)}
                  title="Delete file"
                  className="text-red-600 hover:text-red-800 hover:border-red-300"
                >
                  <FaTrash />
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default FileList;
