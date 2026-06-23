import { useState, useCallback } from 'react';
import { fileService, type FileMetadata } from '@/services/fileManagementService';

export function useFileManagement() {
  const [files, setFiles] = useState<FileMetadata[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Upload a file
   */
  const uploadFile = useCallback(async (file: File, userId?: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const metadata = await fileService.uploadFile(file, userId);
      setFiles(prev => [...prev, metadata]);
      return metadata;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Upload failed';
      setError(message);
      console.error('[v0] File upload error:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Upload multiple files
   */
  const uploadFiles = useCallback(async (fileList: FileList | File[], userId?: string) => {
    const results: FileMetadata[] = [];

    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      const result = await uploadFile(file, userId);
      if (result) {
        results.push(result);
      }
    }

    return results;
  }, [uploadFile]);

  /**
   * Delete a file
   */
  const deleteFile = useCallback((fileId: string) => {
    if (fileService.deleteFile(fileId)) {
      setFiles(prev => prev.filter(f => f.id !== fileId));
      return true;
    }
    return false;
  }, []);

  /**
   * Get file by ID
   */
  const getFile = useCallback((fileId: string) => {
    return fileService.getFile(fileId);
  }, []);

  /**
   * Clear all files
   */
  const clearAllFiles = useCallback(() => {
    fileService.clearAllFiles();
    setFiles([]);
  }, []);

  /**
   * Get statistics
   */
  const getStats = useCallback(() => {
    return fileService.getStatistics();
  }, []);

  /**
   * Format file size
   */
  const formatSize = useCallback((bytes: number) => {
    return fileService.formatFileSize(bytes);
  }, []);

  /**
   * Refresh files list
   */
  const refreshFiles = useCallback(() => {
    const allFiles = fileService.getAllFiles();
    setFiles(allFiles);
  }, []);

  return {
    files,
    isLoading,
    error,
    uploadFile,
    uploadFiles,
    deleteFile,
    getFile,
    clearAllFiles,
    getStats,
    formatSize,
    refreshFiles,
    totalFiles: files.length
  };
}

export default useFileManagement;
