import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MetricWithTrend, TrendDirection } from '@/lib/types';
import { ArrowUpIcon, ArrowDownIcon, ArrowRightIcon, Loader2Icon } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface MetricCardProps {
  metric: MetricWithTrend | null;
  icon: React.ReactNode;
  loading?: boolean;
  onClick?: () => void;
}

export function MetricCard({ metric, icon, loading = false, onClick }: MetricCardProps) {
  // Format value based on the format property or default to number
  const formatValue = (value: number, format?: string): string => {
    if (!format) return value.toLocaleString();
    
    switch (format) {
      case 'currency':
        return `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      case 'percent':
        return `${value.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%`;
      case 'integer':
        return value.toLocaleString(undefined, { maximumFractionDigits: 0 });
      default:
        return value.toLocaleString();
    }
  };
  
  // Get trend icon and color
  const getTrendIndicator = (trend: TrendDirection) => {
    switch (trend) {
      case 'up':
        return {
          icon: <ArrowUpIcon className="mr-1 h-4 w-4" />,
          color: 'text-emerald-500'
        };
      case 'down':
        return {
          icon: <ArrowDownIcon className="mr-1 h-4 w-4" />,
          color: 'text-rose-500'
        };
      case 'neutral':
        return {
          icon: <ArrowRightIcon className="mr-1 h-4 w-4" />,
          color: 'text-yellow-500'
        };
    }
  };

  return (
    <Card className={onClick ? 'cursor-pointer hover:bg-accent/10 transition-colors' : ''} onClick={onClick}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          {metric?.name || 'Loading...'}
        </CardTitle>
        <div className="h-4 w-4 text-muted-foreground">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center space-x-2">
            <Loader2Icon className="h-4 w-4 animate-spin text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Loading...</span>
          </div>
        ) : metric ? (
          <>
            <div className="text-2xl font-bold">
              {formatValue(metric.value, metric.format)}
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <p className="text-xs text-muted-foreground flex items-center">
                    {metric.trend && (
                      <span className={`flex items-center ${getTrendIndicator(metric.trend).color}`}>
                        {getTrendIndicator(metric.trend).icon}
                        {metric.changePercentage > 0 ? '+' : ''}
                        {metric.changePercentage.toFixed(1)}%
                      </span>
                    )}
                    <span className="ml-1">from previous period</span>
                  </p>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Previous: {formatValue(metric.previousValue, metric.format)}</p>
                  {metric.description && <p className="text-xs mt-1">{metric.description}</p>}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </>
        ) : (
          <div className="text-sm text-muted-foreground">No data available</div>
        )}
      </CardContent>
    </Card>
  );
}