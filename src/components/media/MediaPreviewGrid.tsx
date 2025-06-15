
import React from 'react';
import { X, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MediaPreviewGridProps {
  files: File[];
  onRemove: (index: number) => void;
}

export const MediaPreviewGrid: React.FC<MediaPreviewGridProps> = ({
  files,
  onRemove,
}) => {
  const createPreview = (file: File) => {
    if (file.type.startsWith('image/')) {
      return URL.createObjectURL(file);
    }
    return null;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const imageFiles = files.filter(file => file.type.startsWith('image/'));
  const videoFiles = files.filter(file => file.type.startsWith('video/'));

  return (
    <>
      {/* Image previews - Telegram-like grid */}
      {imageFiles.length > 0 && (
        <div className={`grid gap-2 ${
          imageFiles.length === 1 ? 'grid-cols-1' :
          imageFiles.length === 2 ? 'grid-cols-2' :
          imageFiles.length === 3 ? 'grid-cols-3' :
          'grid-cols-2'
        }`}>
          {imageFiles.map((file, index) => {
            const preview = createPreview(file);
            return (
              <div key={index} className="relative group">
                <div className="relative overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800 aspect-square">
                  {preview && (
                    <img
                      src={preview}
                      alt={file.name}
                      className="w-full h-full object-cover"
                    />
                  )}
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => onRemove(files.indexOf(file))}
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">
                  {file.name} ({formatFileSize(file.size)})
                </p>
              </div>
            );
          })}
        </div>
      )}

      {/* Video previews */}
      {videoFiles.length > 0 && (
        <div className="space-y-2">
          {videoFiles.map((file, index) => (
            <div key={index} className="relative group">
              <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="flex-shrink-0 w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                  <div className="relative">
                    <Play className="h-6 w-6 text-gray-500" />
                  </div>
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
      )}
    </>
  );
};
