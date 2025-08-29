import { Camera, CheckCircle, XCircle, Info, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';
import contohGambarBenar from '../assets/IMG_0615.jpg';
import contohGambarSalah from '../assets/IMG_011.jpg';

export function ClassificationGuide() {
  return (
    <div className="space-y-6">
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          <strong>Penting:</strong> Model AI ini dilatih menggunakan gambar daun tunggal dengan background putih. 
          Ikuti panduan di bawah untuk mendapatkan hasil klasifikasi yang optimal.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Camera className="h-5 w-5" />
            <span>Cara Mengambil Foto yang Benar</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="mb-3 flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Foto yang Benar</span>
              </h4>
              <div className="space-y-3">
                <div className="border-2 border-green-200 rounded-lg p-4 bg-green-50/50">
                  <ImageWithFallback
                    src={contohGambarBenar}
                    alt="Contoh foto yang benar"
                    className="w-full h-72 object-contain rounded mb-2"
                  />
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    ✓ Benar
                  </Badge>
                </div>
                <ul className="text-sm space-y-1">
                  <li>• Satu daun tunggal</li>
                  <li>• Background putih bersih</li>
                  <li>• Daun terlihat jelas dan utuh</li>
                  <li>• Pencahayaan yang cukup</li>
                  <li>• Tidak ada bayangan yang mengganggu</li>
                </ul>
              </div>
            </div>

            <div>
              <h4 className="mb-3 flex items-center space-x-2">
                <XCircle className="h-4 w-4 text-red-500" />
                <span>Foto yang Salah</span>
              </h4>
              <div className="space-y-3">
                <div className="border-2 border-red-200 rounded-lg p-4 bg-red-50/50">
                  <ImageWithFallback
                    src={contohGambarSalah}
                    alt="Contoh foto yang salah"
                    className="w-full h-72 object-contain rounded mb-2"
                  />
                  <Badge variant="destructive" className="bg-red-100 text-red-900">
                    ✗ Salah
                  </Badge>
                </div>
                <ul className="text-sm space-y-1">
                  <li>• Multiple daun atau tanaman utuh</li>
                  <li>• Background berwarna atau kompleks</li>
                  <li>• Daun terpotong atau tidak utuh</li>
                  <li>• Pencahayaan kurang atau berlebihan</li>
                  <li>• Ada objek lain dalam frame</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Persiapan Pengambilan Foto</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <h4>1. Siapkan Background Putih</h4>
                <p className="text-muted-foreground text-sm">
                  Gunakan kertas putih, kain putih, atau dinding putih bersih sebagai background.
                </p>
              </div>
              
              <div>
                <h4>2. Pilih Daun yang Representatif</h4>
                <p className="text-muted-foreground text-sm">
                  Pilih daun yang menunjukkan gejala penyakit dengan jelas (jika ada) atau daun sehat yang representatif.
                </p>
              </div>
              
              <div>
                <h4>3. Pastikan Pencahayaan Cukup</h4>
                <p className="text-muted-foreground text-sm">
                  Gunakan cahaya alami atau lampu yang merata. Hindari flash yang terlalu terang.
                </p>
              </div>
              
              <div>
                <h4>4. Bersihkan Daun</h4>
                <p className="text-muted-foreground text-sm">
                  Bersihkan debu atau kotoran pada daun agar gejala penyakit terlihat jelas.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Teknik Pengambilan Foto</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <h4>1. Posisi Kamera</h4>
                <p className="text-muted-foreground text-sm">
                  Posisikan kamera tegak lurus dengan daun, jarak sekitar 20-30 cm.
                </p>
              </div>
              
              <div>
                <h4>2. Fokus yang Tajam</h4>
                <p className="text-muted-foreground text-sm">
                  Pastikan seluruh daun dalam fokus yang tajam. Tap pada layar untuk fokus manual.
                </p>
              </div>
              
              <div>
                <h4>3. Isi Frame Penuh</h4>
                <p className="text-muted-foreground text-sm">
                  Posisikan daun memenuhi sebagian besar frame tanpa terpotong.
                </p>
              </div>
              
              <div>
                <h4>4. Hindari Bayangan</h4>
                <p className="text-muted-foreground text-sm">
                  Pastikan tidak ada bayangan dari tangan atau kamera yang menutupi daun.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Spesifikasi Gambar Optimal</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <h4>Resolusi</h4>
              <p className="text-muted-foreground text-sm">
                Minimum 224x224 px<br/>
                Maksimal 2048x2048 px
              </p>
            </div>
            
            <div className="text-center p-4 border rounded-lg">
              <h4>Format File</h4>
              <p className="text-muted-foreground text-sm">
                JPG, JPEG, PNG<br/>
                Maksimal 5MB
              </p>
            </div>
            
            <div className="text-center p-4 border rounded-lg">
              <h4>Kualitas</h4>
              <p className="text-muted-foreground text-sm">
                Gambar tajam<br/>
                Tidak blur atau pecah
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          <strong>Tips untuk Hasil Terbaik:</strong> Ambil beberapa foto dari daun yang sama dengan sudut yang sedikit berbeda, 
          lalu pilih yang paling jelas dan representatif untuk diklasifikasi.
        </AlertDescription>
      </Alert>
    </div>
  );
}