import React from 'react';
import { X, FileImage, FileVideo, Music, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';

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

  const createPreview = (file: File) => {
    if (file.type.startsWith('image/')) {
      return URL.createObjectURL(file);
    }
    return null;
  };

  if (files.length === 0 && existingMediaUrls.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      {/* Existing media */}
      {existingMediaUrls.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">Загруженные файлы:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {existingMediaUrls.map((url, index) => {
              const mediaType = getMediaTypeFromUrl(url);
              const fileName = url.split('/').pop() || 'Файл';
              
              return (
                <div key={index} className="flex items-center gap-2 p-2 bg-muted/50 rounded border">
                  {getIconForMediaType(mediaType)}
                  <span className="text-sm truncate flex-1" title={fileName}>
                    {fileName}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* New files */}
      {files.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">Новые файлы:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {files.map((file, index) => {
              const preview = createPreview(file);
              
              return (
                <div key={index} className="flex items-center gap-2 p-2 bg-muted rounded border">
                  {preview ? (
                    <img 
                      src={preview} 
                      alt={file.name}
                      className="h-12 w-12 object-cover rounded"
                    />
                  ) : (
                    <div className="h-12 w-12 flex items-center justify-center bg-muted-foreground/10 rounded">
                      {getFileIcon(file)}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate" title={file.name}>
                      {file.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {(file.size / 1024 / 1024).toFixed(1)} MB
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemove(index)}
                    className="h-8 w-8 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
