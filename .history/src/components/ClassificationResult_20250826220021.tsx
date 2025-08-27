import { AlertTriangle, CheckCircle, Info, Leaf } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Alert, AlertDescription } from './ui/alert';

// Tambahkan definisi tipe untuk hasil dari API
interface PredictionResult {
  prediction: string;
  confidence: number;
  probabilities: number[];
  labels: string[];
}

// Tambahkan definisi tipe untuk data detail yang akan digunakan
interface DiseaseDetails {
  description: string;
  symptoms: string[];
  treatment: string;
}

// Data mock untuk detail penyakit, yang akan digunakan
// Ini adalah data yang akan melengkapi hasil dari API
const mockDetails: Record<string, DiseaseDetails> = {
  'blight': {
    description: 'Penyakit bakteri yang menyebabkan daun mengering dan menguning dari ujung.',
    symptoms: ['Garis-garis kuning memanjang', 'Daun mengering', 'Anakan berkurang'],
    treatment: 'Gunakan varietas tahan dan bakterisida berbahan dasar tembaga.'
  },
  'blast': {
    description: 'Penyakit jamur yang menyebabkan bercak berbentuk belah ketupat pada daun.',
    symptoms: ['Bercak belah ketupat pada daun', 'Tepi bercak coklat gelap', 'Daun mengering dan mati'],
    treatment: 'Aplikasi fungisida berbahan aktif tricyclazole.'
  },
  'tungro': {
    description: 'Penyakit virus yang ditularkan wereng hijau, menyebabkan tanaman kerdil.',
    symptoms: ['Tanaman kerdil', 'Daun kuning-orange', 'Anakan sedikit'],
    treatment: 'Kendalikan wereng hijau dengan insektisida dan tanam varietas tahan.'
  },
  'healthy': {
    description: 'Tanaman padi dalam kondisi sehat tanpa gejala penyakit.',
    symptoms: ['Daun hijau segar', 'Pertumbuhan normal', 'Tidak ada bercak'],
    treatment: 'Pertahankan pemupukan seimbang dan irigasi yang baik.'
  },
  'bukan daun padi': {
    description: 'Gambar yang diunggah tidak terdeteksi sebagai daun padi.',
    symptoms: [],
    treatment: 'Pastikan Anda mengunggah gambar daun padi tunggal dengan latar belakang putih bersih.'
  }
};

interface ClassificationResultProps {
  predictionResult: PredictionResult | null;
  isLoading: boolean;
}

export function ClassificationResult({ predictionResult, isLoading }: ClassificationResultProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Menganalisis Gambar...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-primary rounded-full animate-pulse"></div>
              <span>Memproses gambar tanaman padi</span>
            </div>
            <Progress value={75} className="w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  // Gunakan `predictionResult` yang baru
  if (!predictionResult) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-muted-foreground">
            <Leaf className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
            <p>Upload gambar untuk memulai klasifikasi penyakit padi</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Dapatkan detail penyakit dari data mock berdasarkan hasil prediksi
  const diseaseDetails = mockDetails[predictionResult.prediction as keyof typeof mockDetails];
  const severity = predictionResult.confidence >= 0.9 ? 'high' : predictionResult.confidence >= 0.8 ? 'medium' : 'low';
  const confidencePercentage = (predictionResult.confidence * 100).toFixed(2);

  const getSeverityIcon = (sev: string) => {
    switch (sev) {
      case 'low': return <CheckCircle className="h-4 w-4" />;
      case 'medium': return <Info className="h-4 w-4" />;
      case 'high': return <AlertTriangle className="h-4 w-4" />;
      default: return null;
    }
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Hasil Klasifikasi
            <Badge 
              variant={severity === 'high' ? 'destructive' : 'secondary'}
              className="flex items-center space-x-1"
            >
              {getSeverityIcon(severity)}
              <span className="capitalize">{severity}</span>
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3>{predictionResult.prediction}</h3>
            <div className="mt-2">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-muted-foreground">Tingkat Kepercayaan</span>
                <span>{confidencePercentage}%</span>
              </div>
              <Progress value={parseFloat(confidencePercentage)} className="w-full" />
            </div>
          </div>
          
          {/* Tambahkan bagian untuk menampilkan softmax probabilities */}
          <div>
            <h4>Probabilitas Kelas</h4>
            <ul className="text-muted-foreground text-sm space-y-1">
              {predictionResult.labels.map((label, index) => (
                <li key={label}>
                  <strong>{label}:</strong> {(predictionResult.probabilities[index] * 100).toFixed(2)}%
                </li>
              ))}
            </ul>
          </div>
          {/* Akhir dari bagian baru */}

          <div>
            <h4>Deskripsi</h4>
            <p className="text-muted-foreground">{diseaseDetails?.description}</p>
          </div>

          <div>
            <h4>Gejala yang Terdeteksi</h4>
            <ul className="list-disc list-inside space-y-1">
              {diseaseDetails?.symptoms.map((symptom, index) => (
                <li key={index} className="text-muted-foreground">{symptom}</li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          <strong>Rekomendasi Penanganan:</strong> {diseaseDetails?.treatment}
        </AlertDescription>
      </Alert>
    </div>
  );
}
