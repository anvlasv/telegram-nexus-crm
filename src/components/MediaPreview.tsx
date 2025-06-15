import React from 'react';
import { X, FileImage, FileVideo, Music, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { MediaPreviewGrid } from './media/MediaPreviewGrid';

interface MediaPreviewProps {
  files: File[];
  onRemove: (index: number) => void;
  existingMediaUrls?: string[];
}

export const MediaPreview: React.FC<MediaPreviewProps> = ({
  files,
  onRemove,
  existingMediaUrls = []
}) => {
  const { t } = useLanguage();

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return <FileImage className="h-6 w-6" />;
    if (file.type.startsWith('video/')) return <FileVideo className="h-6 w-6" />;
    if (file.type.startsWith('audio/')) return <Music className="h-6 w-6" />;
    return <FileText className="h-6 w-6" />;
  };

  const getMediaTypeFromUrl = (url: string) => {
    const ext = url.toLowerCase().split('.').pop();
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext || '')) return 'image';
    if (['mp4', 'avi', 'mov', 'webm'].includes(ext || '')) return 'video';
    if (['mp3', 'wav', 'ogg'].includes(ext || '')) return 'audio';
    return 'document';
  };

  const getIconForMediaType = (type: string) => {
    switch (type) {
      case 'image': return <FileImage className="h-6 w-6" />;
      case 'video': return <FileVideo className="h-6 w-6" />;
      case 'audio': return <Music className="h-6 w-6" />;
      default: return <FileText className="h-6 w-6" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  if (files.length === 0 && existingMediaUrls.length === 0) {
    return null;
  }

  const imageFiles = files.filter(file => file.type.startsWith('image/'));
  const videoFiles = files.filter(file => file.type.startsWith('video/'));
  const otherFiles = files.filter(file => !file.type.startsWith('image/') && !file.type.startsWith('video/'));

  return (
    <div className="space-y-4 mt-4">
      {/* Existing media */}
      {existingMediaUrls.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
            {t('uploaded-files')}:
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {existingMediaUrls.map((url, index) => {
              const mediaType = getMediaTypeFromUrl(url);
              const fileName = url.split('/').pop() || t('file');
              
              return (
                <div key={index} className="relative group">
                  <div className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                    {getIconForMediaType(mediaType)}
                    <span className="text-sm truncate flex-1" title={fileName}>
                      {fileName}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Image and video previews */}
      {(imageFiles.length > 0 || videoFiles.length > 0) && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
            {t('image-preview')}:
          </p>
          <MediaPreviewGrid
            files={[...imageFiles, ...videoFiles]}
            onRemove={onRemove}
          />
        </div>
      )}

      {/* Other files */}
      {otherFiles.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
            {t('other-files')}:
          </p>
          <div className="space-y-2">
            {otherFiles.map((file, index) => (
              <div key={index} className="relative group">
                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="flex-shrink-0 w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                    {getFileIcon(file)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemove(files.indexOf(file))}
                    className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
