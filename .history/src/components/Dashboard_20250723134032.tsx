import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Activity, AlertTriangle, CheckCircle, TrendingUp } from 'lucide-react';

const diseaseStats = [
  { name: 'Blast', count: 18, color: '#ef4444' },
  { name: 'Blight', count: 15, color: '#f59e0b' },
  { name: 'Tungro', count: 12, color: '#8b5cf6' },
  { name: 'Healthy', count: 35, color: '#10b981' },
];

const monthlyData = [
  { month: 'Jan', classifications: 20, diseases: 8, healthy: 12 },
  { month: 'Feb', classifications: 35, diseases: 15, healthy: 20 },
  { month: 'Mar', classifications: 28, diseases: 12, healthy: 16 },
  { month: 'Apr', classifications: 42, diseases: 18, healthy: 24 },
  { month: 'Mei', classifications: 38, diseases: 16, healthy: 22 },
  { month: 'Jun', classifications: 51, diseases: 22, healthy: 29 },
];

const diseaseBreakdown = [
  { month: 'Jan', blast: 3, blight: 3, tungro: 2 },
  { month: 'Feb', blast: 6, blight: 5, tungro: 4 },
  { month: 'Mar', blast: 5, blight: 4, tungro: 3 },
  { month: 'Apr', blast: 8, blight: 6, tungro: 4 },
  { month: 'Mei', blast: 7, blight: 5, tungro: 4 },
  { month: 'Jun', blast: 9, blight: 8, tungro: 5 },
];

// Custom tooltip components to avoid TypeScript issues
const CustomBarTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
        <p className="font-medium">{`${label}`}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} style={{ color: entry.color }}>
            {`${entry.dataKey}: ${entry.value}`}
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
      <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
        <p className="font-medium">{`${data.name}: ${data.value}`}</p>
      </div>
    );
  }
  return null;
};

export function Dashboard() {
  const totalClassifications = diseaseStats.reduce((sum, item) => sum + item.count, 0);
  const healthyCount = diseaseStats.find(item => item.name === 'Healthy')?.count || 0;
  const diseaseCount = totalClassifications - healthyCount;
  const diseaseRate = ((diseaseCount / totalClassifications) * 100).toFixed(1);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Total Klasifikasi</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{totalClassifications}</div>
            <p className="text-xs text-muted-foreground">
              +12% dari bulan lalu
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Penyakit Terdeteksi</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{diseaseCount}</div>
            <p className="text-xs text-muted-foreground">
              {diseaseRate}% dari total klasifikasi
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Tanaman Sehat</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{healthyCount}</div>
            <p className="text-xs text-muted-foreground">
              {(100 - parseFloat(diseaseRate)).toFixed(1)}% dari total klasifikasi
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Akurasi Model</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">94.2%</div>
            <p className="text-xs text-muted-foreground">
              +2.1% improvement
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Klasifikasi Bulanan</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip content={<CustomBarTooltip />} />
                <Bar dataKey="classifications" fill="hsl(var(--primary))" name="Total" />
                <Bar dataKey="healthy" fill="#10b981" name="Sehat" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Distribusi Klasifikasi</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={diseaseStats}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {diseaseStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomPieTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tren Penyakit Bulanan</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={diseaseBreakdown}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip content={<CustomBarTooltip />} />
              <Bar dataKey="blast" fill="#ef4444" name="Blast" />
              <Bar dataKey="blight" fill="#f59e0b" name="Blight" />
              <Bar dataKey="tungro" fill="#8b5cf6" name="Tungro" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}