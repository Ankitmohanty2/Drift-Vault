import Image from 'next/image';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

// Icons
import DownloadIcon from '@/components/icons/DownloadIcon';
import TrashIcon from '@/components/icons/TrashIcon';
import ViewIcon from '@/components/icons/ViewIcon';

// TS INTERFACES
interface FileProps {
  name: string;
  url: string;
  id: string;
  folderId: string | null;
  path?: string[];
  onDelete?: () => void;
}

const File: React.FC<FileProps> = ({ name, url, id, folderId, path, onDelete }) => {
  const [imageError, setImageError] = useState(false);
  const [loading, setLoading] = useState(false);
  const { currentUser } = useAuth();

  // Function to check if file is an image
  const isImage = (filename: string) => {
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
    const ext = filename.split('.').pop()?.toLowerCase();
    return ext ? imageExtensions.includes(ext) : false;
  };

  const handleView = () => {
    window.open(url, '_blank');
  };

  const handleDownload = async () => {
    try {
      setLoading(true);
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = name;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Error downloading file:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!currentUser) return;
    if (!confirm('Are you sure you want to delete this file?')) return;

    try {
      setLoading(true);

      const userId = currentUser.id;
      const fileName = name;
      const storagePath = `${userId}/${fileName}`;
      
      console.log('Attempting to delete:', storagePath);

      // 1. Delete from storage first
      const { data, error: storageError } = await supabase.storage
        .from('files')
        .remove([storagePath]);

      if (storageError) {
        console.error('Storage deletion error:', storageError);
        throw storageError;
      }

      // 2. Delete from database
      const { error: dbError } = await supabase
        .from('files')
        .delete()
        .eq('id', id);

      if (dbError) {
        console.error('Database deletion error:', dbError);
        throw dbError;
      }

      // 3. Force UI update
      if (onDelete) {
        onDelete();
      }

    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete file. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="group p-3 rounded-lg border bg-base-100 hover:bg-base-200 transition-all">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3 min-w-0">
          {isImage(name) && !imageError ? (
            <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-base-300 flex-shrink-0">
              <Image
                src={url}
                alt={name}
                width={40}
                height={40}
                className="object-cover"
                onError={() => setImageError(true)}
                unoptimized
              />
            </div>
          ) : (
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
          )}
          <span className="truncate text-sm">{name}</span>
        </div>

        <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={handleView}
            className="p-2 rounded-lg hover:bg-base-300 text-base-content/60 hover:text-primary transition-colors"
            title="View"
          >
            <ViewIcon className="w-4 h-4" />
          </button>
          <button
            onClick={handleDownload}
            className="p-2 rounded-lg hover:bg-base-300 text-base-content/60 hover:text-primary transition-colors"
            disabled={loading}
            title="Download"
          >
            <DownloadIcon className="w-4 h-4" />
          </button>
          <button
            onClick={handleDelete}
            className="p-2 rounded-lg hover:bg-red-100 text-base-content/60 hover:text-red-600 transition-colors"
            disabled={loading}
            title="Delete"
          >
            <TrashIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default File;