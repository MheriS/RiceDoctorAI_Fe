import { Calendar, Eye } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface HistoryItem {
  id: string;
  date: string;
  image: string;
  disease: string;
  confidence: number;
  severity: 'low' | 'medium' | 'high';
}

interface ClassificationHistoryProps {
  history: HistoryItem[];
  onViewDetail: (item: HistoryItem) => void;
}

export function ClassificationHistory({ history, onViewDetail }: ClassificationHistoryProps) {
  if (history.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Riwayat Klasifikasi</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            Belum ada riwayat klasifikasi
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Riwayat Klasifikasi</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {history.map((item) => (
            <div key={item.id} className="flex items-center space-x-4 p-4 border rounded-lg">
              <ImageWithFallback
                src={item.image}
                alt="Rice plant"
                className="w-16 h-16 object-cover rounded-md"
              />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4>{item.disease}</h4>
                  <Badge 
                    variant={item.severity === 'high' ? 'destructive' : 'secondary'}
                    className="capitalize"
                  >
                    {item.severity}
                  </Badge>
                </div>
                <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-1">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-3 w-3" />
                    <span>{item.date}</span>
                  </div>
                  <span>Kepercayaan: {item.confidence}%</span>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onViewDetail(item)}
              >
                <Eye className="h-4 w-4 mr-2" />
                Detail
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}