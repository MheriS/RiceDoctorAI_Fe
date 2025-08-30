// File: src/components/ClassificationHistory.tsx

import React, { useState, useEffect } from 'react';
import { Calendar, Eye } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';

// Tipe data yang dibutuhkan
interface HistoryItem {
    id: string;
    date: string;
    image: string;
    disease: string;
    confidence: number;
    severity: 'low' | 'medium' | 'high';
    image_filename?: string;
}

// Komponen ini sekarang akan mengambil datanya sendiri
export function ClassificationHistory() {
    // State untuk menyimpan data riwayat dan status loading
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // useEffect untuk mengambil data saat komponen pertama kali dirender
    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const apiUrl = 'http://127.0.0.1:5000/api/history';
                console.log("Mencoba mengambil data dari URL:", apiUrl); // Untuk debugging
                
                const response = await fetch(apiUrl);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data: HistoryItem[] = await response.json();
                setHistory(data);

            } catch (error) {
                console.error("Gagal memuat riwayat:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchHistory();
    }, []); // Array kosong berarti efek ini hanya berjalan sekali

    // Fungsi handler untuk tombol detail (bisa Anda kembangkan nanti)
    const handleViewDetail = (item: HistoryItem) => {
        console.log('Melihat detail untuk:', item);
    };
    
    // Fungsi helper untuk varian badge
    const getBadgeVariant = (severity: string) => {
        if (severity === 'high') return 'destructive';
        if (severity === 'medium') return 'default';
        return 'secondary';
    };

    // Tampilan saat sedang memuat data
    if (isLoading) {
        return (
            <Card className="dark:bg-slate-800 dark:border-slate-700">
                <CardHeader>
                    <CardTitle className="dark:text-white">Riwayat Klasifikasi</CardTitle>
                </CardHeader>
                <CardContent className="text-center py-8 dark:text-slate-400">
                    Memuat riwayat...
                </CardContent>
            </Card>
        );
    }

    // Tampilan jika tidak ada data riwayat
    if (history.length === 0) {
        return (
            <Card className="dark:bg-slate-800 dark:border-slate-700">
                <CardHeader>
                    <CardTitle className="dark:text-white">Riwayat Klasifikasi</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground text-center py-8 dark:text-slate-400">
                        Belum ada riwayat klasifikasi
                    </p>
                </CardContent>
            </Card>
        );
    }
    
    // Tampilan utama jika data sudah ada
    return (
        <Card className="dark:bg-slate-800 dark:border-slate-700">
            <CardHeader>
                <CardTitle className="dark:text-white">Riwayat Klasifikasi</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                {history.map((item) => (
                    <div
                        key={item.id}
                        className="flex items-start space-x-4 rounded-lg border p-3 dark:border-slate-700"
                    >
                        <img
                            src={`http://127.0.0.1:5000${item.image}`}
                            alt={item.disease}
                            className="h-16 w-16 rounded-md object-cover sm:h-20 sm:w-20"
                            onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/150'; }}
                        />
                        <div className="flex-1 space-y-1">
                            <div className="flex flex-col items-start sm:flex-row sm:items-center sm:justify-between">
                                <h4 className="font-bold capitalize dark:text-white">{item.disease}</h4>
                                <Badge
                                    variant={getBadgeVariant(item.severity)}
                                    className="mt-1 capitalize sm:mt-0"
                                >
                                    {item.severity}
                                </Badge>
                            </div>
                            <div className="flex flex-col items-start space-y-1 text-sm text-muted-foreground dark:text-slate-400 sm:flex-row sm:items-center sm:space-x-4 sm:space-y-0">
                                <div className="flex items-center space-x-1">
                                    <Calendar className="h-3 w-3" />
                                    <span>{item.date.split(' ')[0]}</span>
                                </div>
                                <span>Kepercayaan: {item.confidence.toFixed(2)}%</span>
                            </div>
                            {item.image_filename && (
                                <p className="hidden pt-1 text-xs text-gray-500 sm:block sm:truncate">
                                    File: {item.image_filename}
                                </p>
                            )}
                        </div>
                        <Button
                            size="sm"
                            onClick={() => handleViewDetail(item)}
                            className="self-center !bg-white !text-gray-800 !border-gray-300 hover:!bg-gray-100 dark:!bg-slate-800 dark:!text-white dark:!border-neutral-700 dark:hover:!bg-slate-700"
                        >
                            <Eye className="h-4 w-4 sm:mr-2" />
                            <span className="hidden sm:inline">Detail</span>
                        </Button>
                    </div>
                ))}
                </div>
            </CardContent>
        </Card>
    );
}