import { SalesMetrics } from '../types';
import { randomInRange, generateDates, applySeasonalEffects } from './utils';

/**
 * Generate sales metrics data for a specified time period
 * @param period - Time period for data generation
 * @param count - Number of data points to generate
 * @returns Array of sales metrics
 */
export const generateSalesData = (
  period: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annually',
  count: number
): SalesMetrics[] => {
  // Generate date strings based on the period
  const dates = generateDates(period, count);
  
  // Base values for a mid-sized tech company
  const baseNewDeals = 45; // Monthly base new deals
  const baseClosedDeals = 35; // Monthly base closed deals
  const basePipeline = 1_500_000; // $1.5M monthly pipeline
  const baseAvgDealSize = 42_000; // $42K average deal size
  
  // Multipliers for different time periods
  const periodMultiplier = {
    daily: 1/30,
    weekly: 7/30,
    monthly: 1,
    quarterly: 3,
    annually: 12
  };
  
  // Seasonal effects (quarters)
  const seasonalEffects = [0.9, 0.85, 0.95, 1.3]; // Q1, Q2, Q3, Q4
  
  // Product list
  const products = [
    'Enterprise Platform',
    'Cloud Storage',
    'Analytics Suite',
    'Security Pro',
    'API Services',
    'Mobile SDK',
    'IoT Gateway',
    'ML Toolkit'
  ];
  
  return dates.map((date, index) => {
    // Calculate which quarter we're in (0-3)
    const month = new Date(date).getMonth();
    const quarterIndex = Math.floor(month / 3);
    const seasonalEffect = seasonalEffects[quarterIndex];
    
    // Apply growth trend over time (7-10% YoY growth)
    const timeProgress = index / count;
    const growthFactor = 1 + (timeProgress * randomInRange(0.07, 0.10));
    
    // Apply some random variation
    const variationFactor = randomInRange(0.90, 1.10);
    
    // Calculate base metrics with all factors applied
    const adjustedMultiplier = periodMultiplier[period] * seasonalEffect * growthFactor * variationFactor;
    
    // Generate metrics
    const newDeals = Math.round(baseNewDeals * adjustedMultiplier);
    const closedDeals = Math.round(baseClosedDeals * adjustedMultiplier);
    const pipeline = Math.round(basePipeline * adjustedMultiplier * randomInRange(0.95, 1.05));
    const averageDealSize = Math.round(baseAvgDealSize * adjustedMultiplier * randomInRange(0.97, 1.03));
    
    // Calculate derived metrics
    const conversionRate = Number(((closedDeals / newDeals) * 100).toFixed(1));
    const salesCycle = Math.round(randomInRange(28, 42)); // 28-42 days sales cycle
    
    // Regional distribution (always sums to 100%)
    let northAmerica = randomInRange(45, 55);
    let europe = randomInRange(20, 30);
    let asiaPacific = randomInRange(15, 25);
    
    // Ensure regions sum to 100%
    const regionSum = northAmerica + europe + asiaPacific;
    northAmerica = (northAmerica / regionSum) * 100;
    europe = (europe / regionSum) * 100;
    asiaPacific = (asiaPacific / regionSum) * 100;
    const latinAmerica = 100 - northAmerica - europe - asiaPacific;
    
    // Generate top products
    const shuffledProducts = [...products].sort(() => Math.random() - 0.5);
    const topProducts = shuffledProducts.slice(0, 5).map(name => {
      const productRevenue = Math.round(basePipeline * adjustedMultiplier * randomInRange(0.05, 0.3));
      const quantity = Math.round(productRevenue / averageDealSize * randomInRange(0.8, 1.2));
      return { name, revenue: productRevenue, quantity };
    });
    
    // Sort products by revenue (highest first)
    topProducts.sort((a, b) => b.revenue - a.revenue);
    
    return {
      id: `sales-${date}`,
      date,
      newDeals,
      closedDeals,
      pipeline,
      conversionRate,
      averageDealSize,
      salesCycle,
      regionData: {
        northAmerica: Number(northAmerica.toFixed(1)),
        europe: Number(europe.toFixed(1)),
        asiaPacific: Number(asiaPacific.toFixed(1)),
        latinAmerica: Number(latinAmerica.toFixed(1))
      },
      topProducts
    };
  });
};