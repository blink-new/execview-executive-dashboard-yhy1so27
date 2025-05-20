import { ChartDataPoint, TrendDirection } from '@/lib/types';

/**
 * Generates a random value between min and max
 */
export function getRandomValue(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Generates a random array of values with a general trend direction
 */
export function generateTrendData(
  length: number,
  minValue: number,
  maxValue: number,
  trend: TrendDirection,
  volatility = 0.1
): number[] {
  const result: number[] = [];
  let currentValue = getRandomValue(minValue, maxValue);
  
  result.push(currentValue);
  
  for (let i = 1; i < length; i++) {
    const range = maxValue - minValue;
    let changeAmount = range * volatility * Math.random();
    
    // Apply trend direction bias
    if (trend === 'up') {
      changeAmount = Math.random() < 0.7 ? changeAmount : -changeAmount * 0.5;
    } else if (trend === 'down') {
      changeAmount = Math.random() < 0.7 ? -changeAmount : changeAmount * 0.5;
    } else {
      changeAmount = Math.random() < 0.5 ? changeAmount : -changeAmount;
    }
    
    currentValue += changeAmount;
    
    // Ensure within bounds
    currentValue = Math.min(Math.max(currentValue, minValue), maxValue);
    
    result.push(currentValue);
  }
  
  return result;
}

/**
 * Generates chart data points with dates
 */
export function generateChartData(
  months = 12,
  minValue = 1000,
  maxValue = 10000,
  trend: TrendDirection = 'up',
  startDate = new Date(new Date().getFullYear(), 0, 1) // Jan 1 of current year
): ChartDataPoint[] {
  const values = generateTrendData(months, minValue, maxValue, trend);
  
  return values.map((value, index) => {
    const date = new Date(startDate);
    date.setMonth(date.getMonth() + index);
    
    return {
      date: date.toISOString().slice(0, 10), // YYYY-MM-DD format
      value: Math.round(value)
    };
  });
}

/**
 * Calculates percentage change between two values
 */
export function calculatePercentChange(current: number, previous: number): number {
  if (previous === 0) return 0;
  return parseFloat(((current - previous) / previous * 100).toFixed(1));
}

/**
 * Determines trend direction based on percentage change
 */
export function determineTrend(percentChange: number): TrendDirection {
  if (percentChange > 0) return 'up';
  if (percentChange < 0) return 'down';
  return 'neutral';
}

/**
 * Formats currency values
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
}

/**
 * Formats percentage values
 */
export function formatPercentage(value: number): string {
  return `${value.toFixed(1)}%`;
}

/**
 * Creates a metric with trend info
 */
export function createMetricWithTrend(
  id: string,
  name: string,
  currentValue: number,
  previousValue: number,
  formatType?: 'currency' | 'percentage' | 'number',
  description?: string
) {
  const changePercentage = calculatePercentChange(currentValue, previousValue);
  const trend = determineTrend(changePercentage);
  
  let format: string | undefined;
  if (formatType === 'currency') format = 'currency';
  else if (formatType === 'percentage') format = 'percentage';
  
  return {
    id,
    name,
    value: currentValue,
    format,
    previousValue,
    changePercentage,
    trend,
    description
  };
}