import { useState } from 'react';
import axios from 'axios';
import ImageUpload from './ImageUpload';
import { Card } from './ui/card';
import { Skeleton } from './ui/skeleton';

export default function Home() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | undefined>();
  const [prediction, setPrediction] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const handleImageUpload = (file: File) => {
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setPrediction(null);
    predict(file);
  };

  const handleClear = () => {
    setImageFile(null);
    setImagePreview(undefined);
    setPrediction(null);
  };

  const predict = async (file: File) => {
    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await axios.post('http://localhost:8000/predict', formData);
      setPrediction(res.data.class);
    } catch (err) {
      console.error('Prediction failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto space-y-6 mt-10">
      <ImageUpload
        onImageUpload={handleImageUpload}
        uploadedImage={imagePreview}
        onClear={handleClear}
      />

      {loading && (
        <Card className="p-4 text-center">
          <Skeleton className="h-6 w-full" />
          <p className="text-muted-foreground mt-2">Menganalisis gambar...</p>
        </Card>
      )}

      {prediction !== null && !loading && (
        <Card className="p-4 text-center">
          <h3 className="text-lg font-semibold">Hasil Prediksi</h3>
          <p className="text-2xl mt-2 text-primary">{`Kelas: ${prediction}`}</p>
        </Card>
      )}
    </div>
  );
}
