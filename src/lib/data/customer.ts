import { CustomerMetrics } from '../types';
import { randomInRange, generateDates } from './utils';

/**
 * Generate customer metrics data for a specified time period
 * @param period - Time period for data generation
 * @param count - Number of data points to generate
 * @returns Array of customer metrics
 */
export const generateCustomerData = (
  period: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annually',
  count: number
): CustomerMetrics[] => {
  // Generate date strings based on the period
  const dates = generateDates(period, count);
  
  // Base values for customer metrics
  const baseSatisfactionScore = 7.8; // 1-10 scale
  const baseNps = 42; // Net Promoter Score
  const baseChurnRate = 2.2; // 2.2% monthly churn
  const baseCustomerLifetimeValue = 24000; // $24K CLV
  const baseActiveCustomers = 1250; // 1,250 active customers
  const baseNewCustomers = 85; // 85 new customers per month
  const baseSupportTickets = 320; // 320 tickets per month
  const baseSupportResponseTime = 6.5; // 6.5 hours
  const baseCustomerAcquisitionCost = 2800; // $2,800 CAC
  
  // Multipliers for different time periods
  const periodMultiplier = {
    daily: 1/30,
    weekly: 7/30,
    monthly: 1,
    quarterly: 3,
    annually: 12
  };
  
  // Seasonal effects (quarters)
  const seasonalEffects = [1.0, 0.98, 0.95, 1.08]; // Q1, Q2, Q3, Q4
  
  return dates.map((date, index) => {
    // Calculate which quarter we're in (0-3)
    const month = new Date(date).getMonth();
    const quarterIndex = Math.floor(month / 3);
    const seasonalEffect = seasonalEffects[quarterIndex];
    
    // Apply growth trend over time
    const timeProgress = index / count;
    
    // Different metrics trend at different rates
    const customersGrowth = 1 + (timeProgress * randomInRange(0.06, 0.09)); // 6-9% customer growth
    const satisfactionImprovement = 1 + (timeProgress * randomInRange(0.01, 0.03)); // 1-3% satisfaction improvement
    const churnReduction = 1 - (timeProgress * randomInRange(0.03, 0.05)); // 3-5% churn reduction
    const responseTimeImprovement = 1 - (timeProgress * randomInRange(0.05, 0.08)); // 5-8% response time improvement
    
    // Apply some random variation
    const variationFactor = randomInRange(0.96, 1.04);
    
    // Calculate count metrics with all factors applied
    const countMultiplier = periodMultiplier[period] * seasonalEffect * customersGrowth * variationFactor;
    
    // Calculate percentage and score-based metrics
    const satisfactionScore = Math.min(9.5, baseSatisfactionScore * satisfactionImprovement * variationFactor);
    const nps = Math.min(70, baseNps * satisfactionImprovement * variationFactor);
    const churnRate = Math.max(0.8, baseChurnRate * churnReduction * variationFactor);
    
    // Calculate count-based metrics
    const activeCustomers = Math.round(baseActiveCustomers * customersGrowth * variationFactor);
    const newCustomers = Math.round(baseNewCustomers * countMultiplier);
    const supportTickets = Math.round(baseSupportTickets * countMultiplier);
    
    // Calculate financial metrics
    const customerLifetimeValue = Math.round(baseCustomerLifetimeValue * satisfactionImprovement * (1/churnReduction) * variationFactor);
    const customerAcquisitionCost = Math.round(baseCustomerAcquisitionCost * (1 - (timeProgress * 0.02)) * variationFactor); // CAC improves over time
    
    // Support response time
    const supportResponseTime = baseSupportResponseTime * responseTimeImprovement * variationFactor;
    
    return {
      id: `cust-${date}`,
      date,
      satisfactionScore: Number(satisfactionScore.toFixed(1)),
      nps: Math.round(nps),
      churnRate: Number(churnRate.toFixed(1)),
      customerLifetimeValue,
      activeCustomers,
      newCustomers,
      supportTickets,
      supportResponseTime: Number(supportResponseTime.toFixed(1)),
      customerAcquisitionCost
    };
  });
};