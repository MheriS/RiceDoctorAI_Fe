import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Activity, AlertTriangle, CheckCircle, TrendingUp } from 'lucide-react';
import React, { useEffect, useState } from 'react';

// Custom tooltip components to avoid TypeScript issues
const CustomBarTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-card border border-border rounded-lg p-3 shadow-lg dark:bg-slate-800 dark:border-slate-700">
                <p className="font-medium dark:text-white">{`${label}`}</p>
                {payload.map((entry: any, index: number) => (
                    <p key={index} style={{ color: entry.color }} className="dark:text-slate-200">
                        {`${entry.name}: ${entry.value}`}
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

const CustomPieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
        const data = payload[0];
        return (
            <div className="bg-card border border-border rounded-lg p-3 shadow-lg dark:bg-slate-800 dark:border-slate-700">
                <p className="font-medium dark:text-white">{`${data.name}: ${data.value}`}</p>
            </div>
        );
    }
    return null;
};

// Perbarui antarmuka untuk mencocokkan data yang baru dari API
interface DashboardData {
    total_classifications: number;
    classifications_by_month: { month: string; total: number; healthy: number; diseases: number }[];
    classification_distribution: { label: string; count: number }[];
}

export function Dashboard() {
    const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchDashboardData() {
            try {
                const response = await fetch('http://127.0.0.1:5000/api/dashboard');
                if (!response.ok) {
                    throw new Error('Gagal mengambil data dashboard');
                }
                const data: DashboardData = await response.json();
                setDashboardData(data);
            } catch (err) {
                console.error("Error fetching dashboard data:", err);
            } finally {
                setIsLoading(false);
            }
        }
        fetchDashboardData();
    }, []);

    if (isLoading) {
        return <p>Memuat data dashboard...</p>;
    }

    if (!dashboardData || dashboardData.total_classifications === 0) {
        return <p>Tidak ada data klasifikasi yang tersedia.</p>;
    }
    
    const monthlyBarData = dashboardData.classifications_by_month;
    
    const pieChartData = dashboardData.classification_distribution.map(item => ({
        name: item.label,
        value: item.count,
    }));
    
    const totalClassifications = dashboardData.total_classifications;
    const healthyCount = pieChartData.find(item => item.name === 'healthy')?.value || 0;
    const diseaseCount = totalClassifications - healthyCount;
    const diseaseRate = ((diseaseCount / totalClassifications) * 100).toFixed(1);

    const PIE_COLORS = ['#ef4444', '#f59e0b', '#8b5cf6', '#10b981'];

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="dark:bg-slate-800 dark:border-slate-700">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm dark:text-white">Total Klasifikasi</CardTitle>
                        <Activity className="h-4 w-4 text-muted-foreground dark:text-slate-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold dark:text-white">{totalClassifications}</div>
                        <p className="text-xs text-muted-foreground dark:text-slate-400">
                            +0% dari bulan lalu
                        </p>
                    </CardContent>
                </Card>

                <Card className="dark:bg-slate-800 dark:border-slate-700">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm dark:text-white">Penyakit Terdeteksi</CardTitle>
                        <AlertTriangle className="h-4 w-4 text-muted-foreground dark:text-slate-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold dark:text-white">{diseaseCount}</div>
                        <p className="text-xs text-muted-foreground dark:text-slate-400">
                            {diseaseRate}% dari total klasifikasi
                        </p>
                    </CardContent>
                </Card>

                <Card className="dark:bg-slate-800 dark:border-slate-700">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm dark:text-white">Tanaman Sehat</CardTitle>
                        <CheckCircle className="h-4 w-4 text-muted-foreground dark:text-slate-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold dark:text-white">{healthyCount}</div>
                        <p className="text-xs text-muted-foreground dark:text-slate-400">
                            {(100 - parseFloat(diseaseRate)).toFixed(1)}% dari total klasifikasi
                        </p>
                    </CardContent>
                </Card>

                <Card className="dark:bg-slate-800 dark:border-slate-700">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm dark:text-white">Akurasi Model</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground dark:text-slate-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold dark:text-white">96.4%</div>
                        <p className="text-xs text-muted-foreground dark:text-slate-400">
                            +0% improvement
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="dark:bg-slate-800 dark:border-slate-700">
                    <CardHeader>
                        <CardTitle className="dark:text-white">Klasifikasi Bulanan</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={monthlyBarData}>
                                <CartesianGrid strokeDasharray="3 3" className="stroke-muted-foreground dark:stroke-slate-700" />
                                <XAxis dataKey="month" className="text-sm dark:text-slate-400" />
                                <YAxis className="text-sm dark:text-slate-400" />
                                <Tooltip content={<CustomBarTooltip />} />
                                <Bar dataKey="healthy" fill="#10b981" name="Sehat" />
                                <Bar dataKey="diseases" fill="#ef4444" name="Penyakit" />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card className="dark:bg-slate-800 dark:border-slate-700">
                    <CardHeader>
                        <CardTitle className="dark:text-white">Distribusi Klasifikasi</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={pieChartData}
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                    nameKey="name"
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                >
                                    {pieChartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip content={<CustomPieTooltip />} />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            <Card className="dark:bg-slate-800 dark:border-slate-700">
                <CardHeader>
                    <CardTitle className="dark:text-white">Tren Penyakit Bulanan</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground dark:text-slate-400">
                        Fitur ini membutuhkan data historis yang lebih detail.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}