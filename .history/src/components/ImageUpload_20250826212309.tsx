// src/components/ImageUpload.tsx

import React, { useState, useRef } from 'react';
import { Upload, Camera, X } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { ImageWithFallback } from './figma/ImageWithFallback';

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
}

export function ImageUpload({ onImageUpload, uploadedImage, onClear }: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [predictionResult, setPredictionResult] = useState<PredictionResult | null>(null);
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
    setPredictionResult(null); // Hapus hasil prediksi sebelumnya

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
      setPredictionResult(data);

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
        
        {/* Tambahkan bagian untuk menampilkan hasil prediksi */}
        <div className="p-4">
          {isLoading ? (
            <p>Memproses gambar...</p>
          ) : predictionResult ? (
            <div>
              <h3 className="font-semibold text-lg">Hasil Klasifikasi</h3>
              <p>Penyakit: <strong>{predictionResult.prediction}</strong></p>
              <p>Kepercayaan: <strong>{(predictionResult.confidence * 100).toFixed(2)}%</strong></p>
              
              {/* Tampilkan probabilitas dalam bentuk list atau chart jika diperlukan */}
              <ul className="mt-2 text-sm text-muted-foreground">
                {predictionResult.labels.map((label, index) => (
                  <li key={label}>
                    {label}: {(predictionResult.probabilities[index] * 100).toFixed(2)}%
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="text-muted-foreground">Menunggu klasifikasi...</p>
          )}
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
            <Button variant="outline" type="button">
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
