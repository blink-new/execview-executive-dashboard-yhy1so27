import { FinancialMetrics } from '../types';
import { randomInRange, generateDates } from './utils';

/**
 * Generate financial metrics data for a specified time period
 * @param period - Time period for data generation
 * @param count - Number of data points to generate
 * @returns Array of financial metrics
 */
export const generateFinancialData = (
  period: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annually',
  count: number
): FinancialMetrics[] => {
  // Generate date strings based on the period
  const dates = generateDates(period, count);
  
  // Base values with some realistic variations for a mid-sized tech company
  const baseRevenue = 2_500_000; // $2.5M base for monthly
  const baseExpenses = 1_800_000; // $1.8M base for monthly
  
  // Multipliers for different time periods
  const periodMultiplier = {
    daily: 1/30,
    weekly: 7/30,
    monthly: 1,
    quarterly: 3,
    annually: 12
  };
  
  // Seasonal effects (quarters)
  const seasonalEffects = [1.0, 0.85, 0.9, 1.25]; // Q1, Q2, Q3, Q4
  
  return dates.map((date, index) => {
    // Calculate which quarter we're in (0-3)
    const month = new Date(date).getMonth();
    const quarterIndex = Math.floor(month / 3);
    const seasonalEffect = seasonalEffects[quarterIndex];
    
    // Apply growth trend over time (5-8% YoY growth)
    const timeProgress = index / count;
    const growthFactor = 1 + (timeProgress * randomInRange(0.05, 0.08));
    
    // Apply some random variation
    const variationFactor = randomInRange(0.92, 1.08);
    
    // Calculate base metrics with all factors applied
    const adjustedMultiplier = periodMultiplier[period] * seasonalEffect * growthFactor * variationFactor;
    
    const revenue = Math.round(baseRevenue * adjustedMultiplier);
    
    // Expenses grow slightly slower than revenue (operational efficiency)
    const expenseEfficiency = 0.97; // Expenses grow at 97% the rate of revenue
    const expenses = Math.round(baseExpenses * adjustedMultiplier * expenseEfficiency);
    
    // Calculate derived metrics
    const profit = revenue - expenses;
    const profitMargin = (profit / revenue) * 100;
    
    // Cost breakdowns (percentage of total expenses)
    const operatingCosts = Math.round(expenses * randomInRange(0.55, 0.65));
    const marketingCosts = Math.round(expenses * randomInRange(0.15, 0.25));
    const rdCosts = Math.round(expenses * randomInRange(0.15, 0.20));
    const adminCosts = expenses - operatingCosts - marketingCosts - rdCosts;
    
    // Cash flow is usually higher than profit due to depreciation and other non-cash expenses
    const cashFlow = Math.round(profit * randomInRange(1.1, 1.3));
    
    return {
      id: `fin-${date}`,
      date,
      revenue,
      expenses,
      profit,
      profitMargin: Number(profitMargin.toFixed(2)),
      cashFlow,
      operatingCosts,
      marketingCosts,
      rdCosts,
      adminCosts
    };
  });
};