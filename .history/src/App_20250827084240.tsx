import './styles/globals.css';
import { useState, useEffect } from 'react';
import { BarChart3, Upload, History, BookOpen, Leaf, Camera, Info, ExternalLink } from 'lucide-react';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { ImageUpload } from './components/ImageUpload';
import { ClassificationResult } from './components/ClassificationResult';
import { ClassificationHistory } from './components/ClassificationHistory';
import { ClassificationGuide } from './components/ClassificationGuide';
import { Button } from './components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Alert, AlertDescription } from './components/ui/alert';

interface Disease {
  name: string;
  confidence: number;
  severity: 'low' | 'medium' | 'high';
  description: string;
  treatment: string;
  symptoms: string[];
}

interface HistoryItem {
  id: string;
  date: string;
  image: string;
  disease: string;
  confidence: number;
  severity: 'low' | 'medium' | 'high';
}

interface PredictionResult {
  prediction: string;
  confidence: number;
  probabilities: number[];
  labels: string[];
}

export default function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [predictionResult, setPredictionResult] = useState<PredictionResult | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [activeTab, setActiveTab] = useState('classify');
  const [knowledgeTab, setKnowledgeTab] = useState('guide');
  const [hasReadGuide, setHasReadGuide] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);
  
  const handleImageUpload = (file: File) => {
    const imageUrl = URL.createObjectURL(file);
    setUploadedImage(imageUrl);
    setIsLoading(true);
    setPredictionResult(null); 
  };
  
  const handlePredictionResult = (result: PredictionResult) => {
    setPredictionResult(result);
    setIsLoading(false);

    const newHistoryItem: HistoryItem = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      image: uploadedImage,
      disease: result.prediction,
      confidence: result.confidence * 100,
      severity: result.confidence >= 0.9 ? 'high' : result.confidence >= 0.8 ? 'medium' : 'low'
    };
    setHistory(prev => [newHistoryItem, ...prev]);
  };
  
  const handleClearImage = () => {
    setUploadedImage('');
    setPredictionResult(null);
    setIsLoading(false);
  };
  
  const handleViewHistoryDetail = (item: HistoryItem) => {
    console.log('View detail for:', item);
  };
  
  const handleMenuToggle = () => {
  };
  
  const handleGoToGuide = () => {
    setActiveTab('knowledge');
    setKnowledgeTab('guide');
  };
  
  const handleMarkGuideAsRead = () => {
    setHasReadGuide(true);
  };
  
  return (
    <div className="min-h-screen bg-background dark:bg-slate-900 text-foreground dark:text-white">
      <Header 
        onMenuToggle={handleMenuToggle}
        darkMode={darkMode}
        onDarkModeToggle={() => setDarkMode(!darkMode)}
      />
      
      <main className="container mx-auto px-6 py-6">
        <div className="mb-6">
          <Alert className="border-border dark:border-slate-700 bg-muted dark:bg-slate-800 text-foreground dark:text-white">
            <Leaf className="h-4 w-4" />
            <AlertDescription>
              Selamat datang di RiceDoctor AI! Model AI ini dilatih khusus menggunakan gambar daun tunggal dengan background putih.
            </AlertDescription>
          </Alert>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="w-full px-2 py-1 bg-muted dark:bg-slate-800 rounded-full gap-2 flex justify-between h-10">
            <TabsTrigger
              value="classify"
              className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors
                          text-muted-foreground dark:text-slate-400
                          data-[state=active]:bg-background dark:data-[state=active]:bg-slate-700 data-[state=active]:text-foreground dark:data-[state=active]:text-white
                          hover:text-foreground dark:hover:text-slate-200"
            >
              <Upload className="h-4 w-4" />
              <span>Klasifikasi</span>
            </TabsTrigger>

            <TabsTrigger
              value="dashboard"
              className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors
                          text-muted-foreground dark:text-slate-400
                          data-[state=active]:bg-background dark:data-[state=active]:bg-slate-700 data-[state=active]:text-foreground dark:data-[state=active]:text-white
                          hover:text-foreground dark:hover:text-slate-200"
            >
              <BarChart3 className="h-4 w-4" />
              <span>Dashboard</span>
            </TabsTrigger>

            <TabsTrigger
              value="history"
              className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors
                          text-muted-foreground dark:text-slate-400
                          data-[state=active]:bg-background dark:data-[state=active]:bg-slate-700 data-[state=active]:text-foreground dark:data-[state=active]:text-white
                          hover:text-foreground dark:hover:text-slate-200"
            >
              <History className="h-4 w-4" />
              <span>Riwayat</span>
            </TabsTrigger>

            <TabsTrigger
              value="knowledge"
              className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors
                          text-muted-foreground dark:text-slate-400
                          data-[state=active]:bg-background dark:data-[state=active]:bg-slate-700 data-[state=active]:text-foreground dark:data-[state=active]:text-white
                          hover:text-foreground dark:hover:text-slate-200"
            >
              <BookOpen className="h-4 w-4" />
              <span>Panduan</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="classify" className="space-y-6">
            {!hasReadGuide && (
              <Card className="border-orange-200 bg-orange-50/50 dark:bg-orange-950 dark:border-orange-900">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-orange-800 dark:text-orange-300">
                    <Info className="h-5 w-5" />
                    <span>Penting: Baca Panduan Terlebih Dahulu</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-orange-700 dark:text-orange-400">
                    <p className="mb-3">
                      Untuk mendapatkan hasil klasifikasi yang optimal, pastikan Anda telah memahami cara pengambilan foto yang benar:
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li>Gunakan <strong>satu daun tunggal</strong> saja</li>
                      <li>Pastikan <strong>background putih bersih</strong></li>
                      <li>Daun harus terlihat <strong>jelas dan utuh</strong></li>
                      <li>Pencahayaan yang <strong>cukup dan merata</strong></li>
                    </ul>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button
                      onClick={handleGoToGuide}
                      variant="ghost"
                      className="!bg-slate-800 !hover:bg-slate-700 text-white hover:text-white font-semibold px-4 py-2 rounded-lg flex items-center space-x-2"
                    >
                      <Camera className="h-4 w-4" />
                      <span>Baca Panduan Lengkap</span>
                      <ExternalLink className="h-4 w-4" />
                    </Button>

                    <Button variant="outline" onClick={handleMarkGuideAsRead} className="dark:bg-slate-700 dark:text-white dark:border-slate-600">
                      Saya Sudah Memahami
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {hasReadGuide && (
              <Alert className="border-green-200 bg-green-50/50 dark:bg-green-950 dark:border-green-900">
                <Info className="h-4 w-4 text-green-600 dark:text-green-300" />
                <AlertDescription className="text-green-700 dark:text-green-400">
                  <strong>Siap untuk klasifikasi!</strong> Pastikan foto menggunakan daun tunggal dengan background putih untuk hasil terbaik.
                  <Button 
                    variant="link" 
                    className="p-0 h-auto ml-2 text-green-700 underline dark:text-green-400" 
                    onClick={handleGoToGuide}
                  >
                    Lihat panduan lagi
                  </Button>
                </AlertDescription>
              </Alert>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h2 className="mb-4">Upload Gambar Padi</h2>
                <ImageUpload
                  onImageUpload={handleImageUpload}
                  uploadedImage={uploadedImage}
                  onClear={handleClearImage}
                  onPredictionResult={handlePredictionResult}
                />
              </div>
              <div>
                <h2 className="mb-4">Hasil Analisis</h2>
                <ClassificationResult
                  predictionResult={predictionResult}
                  isLoading={isLoading}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="dashboard">
            <Dashboard />
          </TabsContent>

          <TabsContent value="history">
            <ClassificationHistory
              history={history}
              onViewDetail={handleViewHistoryDetail}
            />
          </TabsContent>

          <TabsContent value="knowledge" className="space-y-6">
            <Tabs value={knowledgeTab} onValueChange={setKnowledgeTab}>
              <TabsList className="w-full px-2 py-1 bg-muted dark:bg-slate-800 rounded-full gap-2 flex justify-between h-10">
                <TabsTrigger
                  value="guide"
                  className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors
                              text-muted-foreground dark:text-slate-400
                              data-[state=active]:bg-background dark:data-[state=active]:bg-slate-700 data-[state=active]:text-foreground dark:data-[state=active]:text-white
                              hover:text-foreground dark:hover:text-slate-200"
                >
                  <Camera className="h-4 w-4" />
                  <span>Cara Foto</span>
                </TabsTrigger>

                <TabsTrigger
                  value="diseases"
                  className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors
                              text-muted-foreground dark:text-slate-400
                              data-[state=active]:bg-background dark:data-[state=active]:bg-slate-700 data-[state=active]:text-foreground dark:data-[state=active]:text-white
                              hover:text-foreground dark:hover:text-slate-200"
                >
                  <Leaf className="h-4 w-4" />
                  <span>Penyakit</span>
                </TabsTrigger>

                <TabsTrigger
                  value="prevention"
                  className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors
                              text-muted-foreground dark:text-slate-400
                              data-[state=active]:bg-background dark:data-[state=active]:bg-slate-700 data-[state=active]:text-foreground dark:data-[state=active]:text-white
                              hover:text-foreground dark:hover:text-slate-200"
                >
                  <BookOpen className="h-4 w-4" />
                  <span>Pencegahan</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="guide">
                <ClassificationGuide />
              </TabsContent>

              <TabsContent value="diseases">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="dark:bg-slate-800 dark:border-slate-700">
                    <CardHeader>
                      <CardTitle className="dark:text-white">Klasifikasi Penyakit Padi</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="dark:text-white">Blast</h4>
                        <p className="text-muted-foreground dark:text-slate-400 text-sm">
                          Penyakit jamur yang menyerang daun, batang, dan malai. Ditandai bercak belah ketupat berwarna coklat dengan tepi gelap.
                        </p>
                      </div>
                      <div>
                        <h4 className="dark:text-white">Blight</h4>
                        <p className="text-muted-foreground dark:text-slate-400 text-sm">
                          Penyakit bakteri yang menyebabkan daun menguning dan mengering dari ujung dengan garis-garis kuning memanjang.
                        </p>
                      </div>
                      <div>
                        <h4 className="dark:text-white">Tungro</h4>
                        <p className="text-muted-foreground dark:text-slate-400 text-sm">
                          Penyakit virus yang ditularkan wereng hijau, menyebabkan tanaman kerdil dan daun kuning-orange.
                        </p>
                      </div>
                      <div>
                        <h4 className="dark:text-white">Healthy</h4>
                        <p className="text-muted-foreground dark:text-slate-400 text-sm">
                          Tanaman padi dalam kondisi sehat dengan daun hijau segar dan pertumbuhan normal.
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="dark:bg-slate-800 dark:border-slate-700">
                    <CardHeader>
                      <CardTitle className="dark:text-white">Karakteristik Gejala</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="dark:text-white">Blast - Ciri Khas</h4>
                        <ul className="text-muted-foreground dark:text-slate-400 text-sm list-disc list-inside">
                          <li>Bercak belah ketupat</li>
                          <li>Tepi bercak berwarna gelap</li>
                          <li>Bagian tengah abu-abu</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="dark:text-white">Blight - Ciri Khas</h4>
                        <ul className="text-muted-foreground dark:text-slate-400 text-sm list-disc list-inside">
                          <li>Menguning dari ujung daun</li>
                          <li>Garis kuning memanjang</li>
                          <li>Daun mengering bertahap</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="dark:text-white">Tungro - Ciri Khas</h4>
                        <ul className="text-muted-foreground dark:text-slate-400 text-sm list-disc list-inside">
                          <li>Daun kuning-orange</li>
                          <li>Pertumbuhan terhambat</li>
                          <li>Tanaman kerdil</li>
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="prevention">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="dark:bg-slate-800 dark:border-slate-700">
                    <CardHeader>
                      <CardTitle className="dark:text-white">Tips Pencegahan Umum</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="dark:text-white">Sanitasi Lahan</h4>
                        <p className="text-muted-foreground dark:text-slate-400 text-sm">
                          Bersihkan sisa tanaman setelah panen dan lakukan pengolahan tanah yang baik.
                        </p>
                      </div>
                      <div>
                        <h4 className="dark:text-white">Varietas Tahan</h4>
                        <p className="text-muted-foreground dark:text-slate-400 text-sm">
                          Gunakan varietas padi yang tahan terhadap penyakit utama di daerah Anda.
                        </p>
                      </div>
                      <div>
                        <h4 className="dark:text-white">Pengendalian Vektor</h4>
                        <p className="text-muted-foreground dark:text-slate-400 text-sm">
                          Kendalikan populasi serangga penular penyakit seperti wereng hijau dan kutu daun.
                        </p>
                      </div>
                      <div>
                        <h4 className="dark:text-white">Monitoring Rutin</h4>
                        <p className="text-muted-foreground dark:text-slate-400 text-sm">
                          Lakukan pemantauan rutin untuk deteksi dini gejala penyakit pada tanaman.
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="dark:bg-slate-800 dark:border-slate-700">
                    <CardHeader>
                      <CardTitle className="dark:text-white">Strategi Pengendalian Terpadu</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="dark:text-white">Biologis</h4>
                        <p className="text-muted-foreground dark:text-slate-400 text-sm">
                          Manfaatkan musuh alami seperti predator dan parasitoid untuk mengendalikan hama dan vektor penyakit.
                        </p>
                      </div>
                      <div>
                        <h4 className="dark:text-white">Budidaya</h4>
                        <p className="text-muted-foreground dark:text-slate-400 text-sm">
                          Terapkan pola tanam yang tepat, pengairan intermiten, dan pemupukan berimbang.
                        </p>
                      </div>
                      <div>
                        <h4 className="dark:text-white">Kimia</h4>
                        <p className="text-muted-foreground dark:text-slate-400 text-sm">
                          Gunakan pestisida secara bijak dan bergantian untuk mencegah resistensi.
                        </p>
                      </div>
                      <div>
                        <h4 className="dark:text-white">Fisik/Mekanis</h4>
                        <p className="text-muted-foreground dark:text-slate-400 text-sm">
                          Lakukan rogueing (pencabutan) tanaman sakit dan pembersihan gulma secara teratur.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
