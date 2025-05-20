import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ResponsiveContainer, Tooltip as RechartsTooltip, Legend, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ChartCardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  loading?: boolean;
  error?: string | null;
  onRefresh?: () => void;
  actions?: React.ReactNode;
}

export function ChartCard({
  title,
  description,
  children,
  loading = false,
  error = null,
  onRefresh,
  actions
}: ChartCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between pb-2">
        <div>
          <CardTitle>{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </div>
        {actions && <div>{actions}</div>}
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="h-[300px] w-full flex items-center justify-center">
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Loading chart data...</p>
            </div>
          </div>
        ) : error ? (
          <div className="h-[300px] w-full flex items-center justify-center">
            <div className="flex flex-col items-center gap-2 max-w-md text-center">
              <p className="text-sm text-destructive">{error}</p>
              {onRefresh && (
                <Button variant="outline" size="sm" onClick={onRefresh}>
                  Try Again
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              {children}
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export const defaultChartConfig = {
  grid: <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />,
  tooltip: <RechartsTooltip contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }} />,
  legend: <Legend />,
  xAxis: <XAxis dataKey="name" fontSize={12} />,
  yAxis: <YAxis fontSize={12} />,
};

// Custom formatter for currency values
export const currencyFormatter = (value: number) => {
  return `$${value.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
};

// Custom formatter for percentage values
export const percentFormatter = (value: number) => {
  return `${value.toFixed(1)}%`;
};

// Custom formatter for number values
export const numberFormatter = (value: number) => {
  return value.toLocaleString();
};