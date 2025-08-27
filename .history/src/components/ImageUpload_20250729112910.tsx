import { useState, useRef } from 'react';
import { Upload, Camera, X } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface ImageUploadProps {
  onImageUpload: (file: File) => void;
  uploadedImage?: string;
  onClear: () => void;
}

export function ImageUpload({ onImageUpload, uploadedImage, onClear }: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find(file => file.type.startsWith('image/'));
    
    if (imageFile) {
      onImageUpload(imageFile);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImageUpload(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  if (uploadedImage) {
    return (
      <Card className="relative">
        <div className="relative">
          <ImageWithFallback
            src={uploadedImage}
            alt="Uploaded rice plant"
            className="w-full h-64 object-cover rounded-lg"
          />
          <Button
            variant="destructive"
            size="sm"
            className="absolute top-2 right-2"
            onClick={onClear}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card 
      className={`border-2 border-dashed transition-colors cursor-pointer ${
        isDragging ? 'border-primary bg-primary/5' : 'border-border'
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
    >
      <div className="p-8 text-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="p-4 bg-primary/10 rounded-full">
            <Upload className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h3>Upload Gambar Tanaman Padi</h3>
            <p className="text-muted-foreground">
              Seret gambar ke sini atau klik untuk memilih file
            </p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline">
              <Camera className="h-4 w-4 mr-2" />
              Pilih File
            </Button>
          </div>
        </div>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
    </Card>
  );
}