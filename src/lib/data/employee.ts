import { EmployeeMetrics } from '../types';
import { randomInRange, generateDates } from './utils';

/**
 * Generate employee metrics data for a specified time period
 * @param period - Time period for data generation
 * @param count - Number of data points to generate
 * @returns Array of employee metrics
 */
export const generateEmployeeData = (
  period: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annually',
  count: number
): EmployeeMetrics[] => {
  // Generate date strings based on the period
  const dates = generateDates(period, count);
  
  // Base values for employee metrics
  const baseHeadcount = 180; // 180 employees
  const baseNewHires = 6; // 6 new hires per month
  const baseTurnoverRate = 1.8; // 1.8% monthly turnover
  const baseProductivityScore = 7.4; // 7.4 out of 10
  const baseEngagementScore = 7.2; // 7.2 out of 10
  const baseRetentionRate = 97.5; // 97.5% annual retention
  const baseTrainingCost = 35000; // $35K monthly training cost
  const baseAverageTenure = 22; // 22 months average tenure
  
  // Base department ratios
  const baseDepartmentData = {
    engineering: 70, // 70 engineers
    sales: 35, // 35 sales staff
    marketing: 20, // 20 marketing staff
    operations: 25, // 25 operations staff
    support: 20, // 20 support staff
    admin: 10, // 10 admin staff
  };
  
  // Multipliers for different time periods
  const periodMultiplier = {
    daily: 1/30,
    weekly: 7/30,
    monthly: 1,
    quarterly: 3,
    annually: 12
  };
  
  // Seasonal effects (quarters) - hiring usually more seasonal than other metrics
  const hiringSeasonalEffects = [1.2, 0.8, 1.1, 0.9]; // Q1, Q2, Q3, Q4
  
  return dates.map((date, index) => {
    // Calculate which quarter we're in (0-3)
    const month = new Date(date).getMonth();
    const quarterIndex = Math.floor(month / 3);
    const hiringSeasonalEffect = hiringSeasonalEffects[quarterIndex];
    
    // Apply growth trend over time for headcount (5-8% YoY growth)
    const timeProgress = index / count;
    const headcountGrowth = 1 + (timeProgress * randomInRange(0.05, 0.08));
    
    // Different metrics trend at different rates
    const productivityImprovement = 1 + (timeProgress * randomInRange(0.02, 0.04)); // 2-4% productivity improvement
    const engagementImprovement = 1 + (timeProgress * randomInRange(0.01, 0.03)); // 1-3% engagement improvement
    const turnoverReduction = 1 - (timeProgress * randomInRange(0.02, 0.04)); // 2-4% turnover reduction
    
    // Apply some random variation
    const variationFactor = randomInRange(0.97, 1.03);
    
    // Calculate headcount
    const headcount = Math.round(baseHeadcount * headcountGrowth * variationFactor);
    
    // Calculate hiring metrics with seasonal effects
    const hiringMultiplier = periodMultiplier[period] * hiringSeasonalEffect * headcountGrowth * variationFactor;
    const newHires = Math.round(baseNewHires * hiringMultiplier);
    
    // Calculate percentage and score-based metrics
    const turnoverRate = Math.max(0.9, baseTurnoverRate * turnoverReduction * variationFactor);
    const productivityScore = Math.min(9.0, baseProductivityScore * productivityImprovement * variationFactor);
    const engagementScore = Math.min(9.0, baseEngagementScore * engagementImprovement * variationFactor);
    
    // Retention rate is inverse of turnover rate (scaled for period)
    const retentionRate = 100 - (turnoverRate * 12); // Annualized
    
    // Calculate financial metrics
    const trainingCost = Math.round(baseTrainingCost * periodMultiplier[period] * headcountGrowth * variationFactor);
    
    // Calculate tenure - generally increases over time with better retention
    const averageTenure = baseAverageTenure * (1 + (timeProgress * 0.1)) * variationFactor;
    
    // Department headcounts - grow proportionally but with some variation between departments
    const engineeringGrowth = headcountGrowth * randomInRange(0.95, 1.05); // Engineering grows slightly faster
    const salesGrowth = headcountGrowth * randomInRange(0.98, 1.02);
    const marketingGrowth = headcountGrowth * randomInRange(0.97, 1.03);
    const operationsGrowth = headcountGrowth * randomInRange(0.93, 1.07);
    const supportGrowth = headcountGrowth * randomInRange(0.96, 1.04);
    const adminGrowth = headcountGrowth * randomInRange(0.90, 1.10); // Admin varies more
    
    // Calculate department headcounts
    const departmentData = {
      engineering: Math.round(baseDepartmentData.engineering * engineeringGrowth * variationFactor),
      sales: Math.round(baseDepartmentData.sales * salesGrowth * variationFactor),
      marketing: Math.round(baseDepartmentData.marketing * marketingGrowth * variationFactor),
      operations: Math.round(baseDepartmentData.operations * operationsGrowth * variationFactor),
      support: Math.round(baseDepartmentData.support * supportGrowth * variationFactor),
      admin: Math.round(baseDepartmentData.admin * adminGrowth * variationFactor)
    };
    
    // Ensure all departments sum to total headcount
    const departmentSum = Object.values(departmentData).reduce((sum, val) => sum + val, 0);
    const adjustmentFactor = headcount / departmentSum;
    
    Object.keys(departmentData).forEach(key => {
      departmentData[key as keyof typeof departmentData] = Math.round(
        departmentData[key as keyof typeof departmentData] * adjustmentFactor
      );
    });
    
    // Fix any rounding errors to ensure exact match to headcount
    const finalSum = Object.values(departmentData).reduce((sum, val) => sum + val, 0);
    if (finalSum !== headcount) {
      const diff = headcount - finalSum;
      departmentData.operations += diff; // Add or subtract the difference from operations
    }
    
    return {
      id: `emp-${date}`,
      date,
      headcount,
      newHires,
      turnoverRate: Number(turnoverRate.toFixed(1)),
      productivityScore: Number(productivityScore.toFixed(1)),
      engagementScore: Number(engagementScore.toFixed(1)),
      retentionRate: Number(retentionRate.toFixed(1)),
      trainingCost,
      averageTenure: Number(averageTenure.toFixed(1)),
      departmentData
    };
  });
};