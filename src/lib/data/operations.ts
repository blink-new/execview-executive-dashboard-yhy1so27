import { OperationsMetrics } from '../types';
import { randomInRange, generateDates } from './utils';

/**
 * Generate operations metrics data for a specified time period
 * @param period - Time period for data generation
 * @param count - Number of data points to generate
 * @returns Array of operations metrics
 */
export const generateOperationsData = (
  period: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annually',
  count: number
): OperationsMetrics[] => {
  // Generate date strings based on the period
  const dates = generateDates(period, count);
  
  // Base values for operations metrics
  const baseProductionEfficiency = 87; // 87% efficiency
  const baseInventoryLevel = 450000; // $450K inventory
  const baseInventoryTurnover = 5.2; // 5.2 turns per year
  const baseDeliveryOnTime = 92; // 92% on-time delivery
  const baseAvgDeliveryTime = 3.5; // 3.5 days avg delivery
  const baseQualityScore = 94; // 94% quality score
  const baseDefectRate = 2.8; // 2.8% defect rate
  const baseCapacityUtilization = 82; // 82% capacity utilization
  const baseMaintenanceCost = 85000; // $85K monthly maintenance
  
  // Multipliers for different time periods
  const periodMultiplier = {
    daily: 1/30,
    weekly: 7/30,
    monthly: 1,
    quarterly: 3,
    annually: 12
  };
  
  // Seasonal effects (quarters) - operations usually less seasonal than sales
  const seasonalEffects = [1.0, 0.95, 0.98, 1.05]; // Q1, Q2, Q3, Q4
  
  return dates.map((date, index) => {
    // Calculate which quarter we're in (0-3)
    const month = new Date(date).getMonth();
    const quarterIndex = Math.floor(month / 3);
    const seasonalEffect = seasonalEffects[quarterIndex];
    
    // Apply improvement trend over time (efficiency improves 3-5% YoY)
    const timeProgress = index / count;
    
    // Different metrics improve at different rates
    const efficiencyImprovement = 1 + (timeProgress * randomInRange(0.03, 0.05));
    const qualityImprovement = 1 + (timeProgress * randomInRange(0.02, 0.04));
    const defectImprovement = 1 - (timeProgress * randomInRange(0.04, 0.07)); // Defect rate should decrease
    
    // Apply some random variation
    const variationFactor = randomInRange(0.97, 1.03);
    
    // Calculate cost metrics with all factors applied
    const costMultiplier = periodMultiplier[period] * seasonalEffect * variationFactor;
    
    // Calculate percentage-based metrics
    const productionEfficiency = Math.min(98, baseProductionEfficiency * efficiencyImprovement * variationFactor);
    const deliveryOnTime = Math.min(99, baseDeliveryOnTime * efficiencyImprovement * variationFactor);
    const qualityScore = Math.min(99, baseQualityScore * qualityImprovement * variationFactor);
    const defectRate = Math.max(0.5, baseDefectRate * defectImprovement * variationFactor);
    const capacityUtilization = Math.min(95, baseCapacityUtilization * efficiencyImprovement * variationFactor);
    
    // Calculate inventory metrics
    const inventoryLevel = Math.round(baseInventoryLevel * costMultiplier);
    const inventoryTurnover = baseInventoryTurnover * efficiencyImprovement * variationFactor;
    const averageDeliveryTime = baseAvgDeliveryTime * (1 / efficiencyImprovement) * variationFactor;
    const maintenanceCost = Math.round(baseMaintenanceCost * costMultiplier);
    
    return {
      id: `ops-${date}`,
      date,
      productionEfficiency: Number(productionEfficiency.toFixed(1)),
      inventoryLevel,
      inventoryTurnover: Number(inventoryTurnover.toFixed(2)),
      deliveryOnTime: Number(deliveryOnTime.toFixed(1)),
      averageDeliveryTime: Number(averageDeliveryTime.toFixed(1)),
      qualityScore: Number(qualityScore.toFixed(1)),
      defectRate: Number(defectRate.toFixed(1)),
      capacityUtilization: Number(capacityUtilization.toFixed(1)),
      maintenanceCost
    };
  });
};