
import React, { useCallback, useState } from 'react';
import { Upload, X, FileImage, FileVideo, FileText, Music, Film } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FileDropZoneProps {
  onFilesChange: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  maxFiles?: number;
  currentFiles?: File[];
}

export const FileDropZone: React.FC<FileDropZoneProps> = ({
  onFilesChange,
  accept,
  multiple = false,
  maxFiles = 1,
  currentFiles = []
}) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return <FileImage className="h-8 w-8" />;
    if (file.type.startsWith('video/')) return <FileVideo className="h-8 w-8" />;
    if (file.type.startsWith('audio/')) return <Music className="h-8 w-8" />;
    return <FileText className="h-8 w-8" />;
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const validFiles = files.slice(0, maxFiles);
    
    if (multiple) {
      onFilesChange([...currentFiles, ...validFiles].slice(0, maxFiles));
    } else {
      onFilesChange(validFiles);
    }
  }, [onFilesChange, multiple, maxFiles, currentFiles]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    if (multiple) {
      onFilesChange([...currentFiles, ...files].slice(0, maxFiles));
    } else {
      onFilesChange(files);
    }
  };

  const removeFile = (index: number) => {
    const newFiles = currentFiles.filter((_, i) => i !== index);
    onFilesChange(newFiles);
  };

  return (
    <div className="space-y-4">
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          isDragOver 
            ? 'border-primary bg-primary/5' 
            : 'border-muted-foreground/25 hover:border-muted-foreground/50'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-sm text-muted-foreground mb-2">
          Перетащите файлы сюда или нажмите для выбора
        </p>
        <input
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileInput}
          className="hidden"
          id="file-upload"
        />
        <Button variant="outline" onClick={() => document.getElementById('file-upload')?.click()}>
          Выбрать файлы
        </Button>
      </div>

      {currentFiles.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium">Выбранные файлы:</p>
          {currentFiles.map((file, index) => (
            <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
              <div className="flex items-center gap-2">
                {getFileIcon(file)}
                <span className="text-sm truncate">{file.name}</span>
                <span className="text-xs text-muted-foreground">
                  ({(file.size / 1024 / 1024).toFixed(1)} MB)
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeFile(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
