/**
 * Data generation utilities for creating realistic mock data
 */

/**
 * Generate random number within a range
 * @param min - Minimum value
 * @param max - Maximum value
 * @returns Random number between min and max
 */
export const randomInRange = (min: number, max: number): number => {
  return Math.random() * (max - min) + min;
};

/**
 * Generate array of sequential dates based on the time period
 * @param period - Time period (daily, weekly, monthly, quarterly, annually)
 * @param count - Number of data points to generate
 * @returns Array of ISO date strings
 */
export const generateDates = (
  period: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annually', 
  count: number
): string[] => {
  const today = new Date();
  const dates: string[] = [];
  
  // Create a function to add the appropriate time unit
  const addPeriod = (date: Date, periodType: string): Date => {
    const newDate = new Date(date);
    
    switch (periodType) {
      case 'daily':
        newDate.setDate(date.getDate() - 1);
        break;
      case 'weekly':
        newDate.setDate(date.getDate() - 7);
        break;
      case 'monthly':
        newDate.setMonth(date.getMonth() - 1);
        break;
      case 'quarterly':
        newDate.setMonth(date.getMonth() - 3);
        break;
      case 'annually':
        newDate.setFullYear(date.getFullYear() - 1);
        break;
    }
    
    return newDate;
  };
  
  // Format date to YYYY-MM-DD
  const formatDate = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };
  
  // Generate dates going backward from today
  let currentDate = today;
  
  for (let i = 0; i < count; i++) {
    dates.push(formatDate(currentDate));
    currentDate = addPeriod(currentDate, period);
  }
  
  // Reverse so dates are in ascending order
  return dates.reverse();
};

/**
 * Generate trend with random variation around a center value
 * @param baseValue - Base value
 * @param trendFactor - Rate of trend change (positive or negative)
 * @param variationRange - Range of random variation as percentage of base value
 * @param count - Number of data points to generate
 * @returns Array of values following the trend
 */
export const generateTrend = (
  baseValue: number,
  trendFactor: number,
  variationRange: number,
  count: number
): number[] => {
  const result: number[] = [];
  
  for (let i = 0; i < count; i++) {
    // Calculate trend component (linear growth/decline)
    const trendComponent = baseValue * (1 + (trendFactor * i / count));
    
    // Calculate random variation
    const variationAmount = trendComponent * (randomInRange(-variationRange, variationRange));
    
    // Combine trend and variation
    const value = trendComponent + variationAmount;
    
    result.push(Number(value.toFixed(2)));
  }
  
  return result;
};

/**
 * Generate cyclical pattern with random variation
 * @param baseValue - Base value
 * @param amplitude - Amplitude of the cycle as percentage of base value
 * @param periodCount - Number of full periods to complete
 * @param variationRange - Range of random variation as percentage of base value
 * @param count - Number of data points to generate
 * @returns Array of values following a cyclical pattern
 */
export const generateCyclicalPattern = (
  baseValue: number,
  amplitude: number,
  periodCount: number,
  variationRange: number,
  count: number
): number[] => {
  const result: number[] = [];
  
  for (let i = 0; i < count; i++) {
    // Calculate position in the cycle (0 to 2π * periods)
    const cyclePosition = (i / count) * Math.PI * 2 * periodCount;
    
    // Calculate cycle component
    const cycleComponent = baseValue * (1 + amplitude * Math.sin(cyclePosition));
    
    // Calculate random variation
    const variationAmount = baseValue * randomInRange(-variationRange, variationRange);
    
    // Combine cycle and variation
    const value = cycleComponent + variationAmount;
    
    result.push(Number(value.toFixed(2)));
  }
  
  return result;
};

/**
 * Apply seasonal effects to a data series
 * @param values - Base values to apply seasonal effects to
 * @param seasonalFactors - Array of factors for each season (e.g., [1.2, 0.8, 0.9, 1.1] for quarters)
 * @returns Array with seasonal effects applied
 */
export const applySeasonalEffects = (
  values: number[],
  seasonalFactors: number[]
): number[] => {
  return values.map((value, index) => {
    const seasonIndex = index % seasonalFactors.length;
    return Number((value * seasonalFactors[seasonIndex]).toFixed(2));
  });
};