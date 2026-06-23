import React, { useRef, useState, useEffect } from 'react';
import { Upload, Trash2, Download, FileText, Image as ImageIcon, Music, Film, File, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { useFileManagement } from '@/hooks/useFileManagement';

export function FileManager() {
  const {
    files,
    isLoading,
    error,
    uploadFile,
    uploadFiles,
    deleteFile,
    formatSize,
    clearAllFiles,
    getStats
  } = useFileManagement();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragDropRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Drag and drop handlers
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files) {
      await uploadFiles(e.dataTransfer.files);
    }
  };

  // File input handlers
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      await uploadFiles(e.target.files);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Get file icon
  const getFileIcon = (fileType: string, fileName: string) => {
    if (fileType.startsWith('image/')) {
      return <ImageIcon className="w-4 h-4 text-blue-500" />;
    }
    if (fileType.startsWith('audio/')) {
      return <Music className="w-4 h-4 text-purple-500" />;
    }
    if (fileType.startsWith('video/')) {
      return <Film className="w-4 h-4 text-red-500" />;
    }
    if (fileType === 'application/pdf' || fileName.endsWith('.pdf')) {
      return <FileText className="w-4 h-4 text-red-500" />;
    }
    if (fileType.includes('word') || fileType.includes('document')) {
      return <FileText className="w-4 h-4 text-blue-600" />;
    }
    return <File className="w-4 h-4 text-gray-500" />;
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <div className="flex items-center gap-1 px-2 py-1 rounded bg-green-500/10 text-green-600 text-xs">
            <CheckCircle className="w-3 h-3" />
            Processed
          </div>
        );
      case 'processing':
        return (
          <div className="flex items-center gap-1 px-2 py-1 rounded bg-blue-500/10 text-blue-600 text-xs animate-pulse">
            <Clock className="w-3 h-3" />
            Processing
          </div>
        );
      case 'error':
        return (
          <div className="flex items-center gap-1 px-2 py-1 rounded bg-red-500/10 text-red-600 text-xs">
            <AlertCircle className="w-3 h-3" />
            Error
          </div>
        );
      default:
        return (
          <div className="flex items-center gap-1 px-2 py-1 rounded bg-amber-500/10 text-amber-600 text-xs">
            <Clock className="w-3 h-3" />
            Pending
          </div>
        );
    }
  };

  const stats = getStats();

  return (
    <div className={`flex flex-col gap-6 p-4 md:p-6 max-w-6xl mx-auto ${isMobile ? 'w-full' : ''}`}>
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold flex items-center gap-2">
            <Upload className="w-8 h-8 text-accent" />
            File Manager
          </h2>
          <p className="text-muted-foreground mt-1">Upload and manage files for processing</p>
        </div>
        {files.length > 0 && (
          <button
            onClick={clearAllFiles}
            className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-600 rounded-lg font-medium transition-colors"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Stats */}
      {files.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-muted border border-border rounded-lg p-4">
            <p className="text-sm text-muted-foreground">Total Files</p>
            <p className="text-2xl font-bold text-accent">{stats.totalFiles}</p>
          </div>
          <div className="bg-muted border border-border rounded-lg p-4">
            <p className="text-sm text-muted-foreground">Total Size</p>
            <p className="text-2xl font-bold text-accent">{stats.totalSize}</p>
          </div>
          <div className="bg-muted border border-border rounded-lg p-4">
            <p className="text-sm text-muted-foreground">File Types</p>
            <p className="text-2xl font-bold text-accent">{Object.keys(stats.byType).length}</p>
          </div>
        </div>
      )}

      {/* Upload Area */}
      <div
        ref={dragDropRef}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragging
            ? 'border-accent bg-accent/10'
            : 'border-border hover:border-accent'
        }`}
      >
        <Upload className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <h3 className="text-lg font-semibold mb-2">Drag files here or click to browse</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Supported: Images, Documents (PDF, DOCX, TXT), Audio, Video • Max 50MB
        </p>
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isLoading}
          className="px-4 py-2 bg-accent hover:bg-accent/90 disabled:opacity-50 text-accent-foreground rounded-lg font-medium transition-colors"
        >
          {isLoading ? 'Uploading...' : 'Choose Files'}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileSelect}
          className="hidden"
          accept="image/*,application/pdf,.docx,.txt,audio/*,video/*"
        />
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex gap-2 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-600">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium">Upload Error</p>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* Files List */}
      {files.length === 0 && !isLoading ? (
        <div className="bg-muted border border-border rounded-lg p-12 text-center">
          <File className="w-16 h-16 mx-auto mb-4 opacity-30" />
          <p className="text-lg text-muted-foreground">No files uploaded yet</p>
          <p className="text-sm text-muted-foreground mt-2">Upload files to get started with document processing</p>
        </div>
      ) : (
        <div className="space-y-2">
          {files.map((file) => (
            <div
              key={file.id}
              className="flex items-start gap-3 p-4 bg-muted border border-border rounded-lg hover:border-accent transition-colors"
            >
              {/* Icon */}
              <div className="flex-shrink-0 mt-1">
                {getFileIcon(file.type, file.name)}
              </div>

              {/* File Info */}
              <div className="flex-1 min-w-0">
                <h4 className="font-medium break-words">{file.name}</h4>
                <div className="flex flex-col md:flex-row gap-2 text-xs text-muted-foreground mt-1">
                  <span>{formatSize(file.size)}</span>
                  <span>•</span>
                  <span>{file.type || 'Unknown type'}</span>
                  <span>•</span>
                  <span>{new Date(file.uploadedAt).toLocaleDateString()}</span>
                </div>
                {file.extractedText && (
                  <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                    {file.extractedText}
                  </p>
                )}
              </div>

              {/* Status */}
              <div className="flex items-center gap-2 flex-shrink-0">
                {getStatusBadge(file.status)}
              </div>

              {/* Actions */}
              <div className="flex gap-2 flex-shrink-0">
                <button
                  onClick={() => deleteFile(file.id)}
                  className="p-2 text-red-500 hover:bg-red-500/10 rounded transition-colors"
                  title="Delete file"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Usage Info */}
      <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 text-sm text-blue-600">
        <p className="font-medium">📄 File Processing Capabilities</p>
        <ul className="mt-2 space-y-1 text-xs">
          <li>• Images: Automatic analysis with vision models (Claude, Llava)</li>
          <li>• PDFs: Text extraction and document processing</li>
          <li>• Documents: Support for DOCX, TXT, and other formats</li>
          <li>• Audio: Convert to text using Whisper STT</li>
          <li>• Video: Extract audio track for processing</li>
        </ul>
      </div>
    </div>
  );
}

export default FileManager;
