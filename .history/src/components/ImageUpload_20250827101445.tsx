// src/components/ImageUpload.tsx

import React, { useState, useRef } from 'react';
import { Upload, Camera, X } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { ImageWithFallback } from './figma/ImageWithFallback'; // Tetap gunakan ini

// Tambahkan definisi tipe untuk respons dari API Flask
// Ganti dengan tipe data yang benar jika berbeda
interface PredictionResult {
  prediction: string;
  confidence: number;
  probabilities: number[];
  labels: string[];
}

interface ImageUploadProps {
  onImageUpload: (file: File) => void;
  uploadedImage?: string;
  onClear: () => void;
  // Tambahkan prop baru untuk mengirim hasil prediksi ke komponen induk
  onPredictionResult: (result: PredictionResult) => void;
}

export function ImageUpload({ onImageUpload, uploadedImage, onClear, onPredictionResult }: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => { // 👈 Tambahkan 'async'
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find(file => file.type.startsWith('image/'));
    
    if (imageFile) {
      onImageUpload(imageFile);
      // Panggil fungsi untuk mengunggah dan memprediksi
      await uploadAndPredict(imageFile);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => { // 👈 Tambahkan 'async'
    const file = e.target.files?.[0];
    if (file) {
      onImageUpload(file);
      // Panggil fungsi untuk mengunggah dan memprediksi
      await uploadAndPredict(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  // ----------------------------------------------------
  // FUNGSI BARU UNTUK MENGUNGGAH & MEMPREDIKSI
  // ----------------------------------------------------
  const uploadAndPredict = async (file: File) => {
    setIsLoading(true);

    const formData = new FormData();
    // 'image' harus sama dengan nama yang digunakan di Flask (request.files['image'])
    formData.append('image', file);

    try {
      const response = await fetch('http://127.0.0.1:5000/predict_api', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Permintaan gagal dengan status: ${response.status}`);
      }

      const data: PredictionResult = await response.json();
      onPredictionResult(data); // 👈 Kirim hasil ke komponen induk

    } catch (error) {
      console.error('Ada masalah dengan permintaan:', error);
      alert('Gagal mendapatkan hasil prediksi. Coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };
  // ----------------------------------------------------

  if (uploadedImage) {
    return (
      <Card className="relative overflow-hidden"> {/* 👈 Tambahkan overflow-hidden */}
        <div className="relative w-full h-auto"> {/* 👈 Sesuaikan ukuran div */}
          <ImageWithFallback
            src={uploadedImage}
            alt="Uploaded rice plant"
            // Ubah class menjadi object-cover untuk mengisi frame
            className="w-full h-full object-cover rounded-lg"
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
        
        {/* Hapus bagian ini karena akan ditampilkan di komponen induk */}
        <div className="p-4 text-center">
          {isLoading && <p className="text-muted-foreground">Memproses gambar...</p>}
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
            <Button variant="outline" type="button" className="bg-blue-600 text-white hover:bg-blue-700
               dark:bg-blue-500 dark:hover:bg-blue-600">
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
