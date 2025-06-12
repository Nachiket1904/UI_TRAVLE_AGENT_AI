
// Utility functions for ROI calculations

// Calculate the yearly costs based on the cost parameters
export function calculateYearlyCosts(
  costs: Record<string, number>,
  year: number
): number {
  // One-time implementation cost only applies to first year
  const implementationCost = year === 1 ? costs.implementation : 0;
  
  // Monthly costs converted to yearly
  const apiYearlyCost = costs.api * 12;
  const infrastructureYearlyCost = costs.infrastructure * 12;
  
  // Annual maintenance cost
  const maintenanceCost = costs.maintenance;
  
  // Apply cost scaling factors based on the year
  // Implementation costs decrease over time, API costs might increase with usage
  const apiScalingFactor = 1 + (year - 1) * 0.1; // 10% increase per year for API costs
  const maintenanceScalingFactor = 1 + (year - 1) * 0.05; // 5% increase per year for maintenance
  
  return (
    implementationCost +
    apiYearlyCost * apiScalingFactor +
    infrastructureYearlyCost +
    maintenanceCost * maintenanceScalingFactor
  );
}

// Calculate the yearly value based on the value parameters
export function calculateYearlyValue(
  values: Record<string, number>,
  year: number
): { total: number; breakdown: Record<string, number> } {
  // Base productivity value calculation
  const hoursPerYear = 2080; // 52 weeks * 40 hours
  const productivityHoursSaved = 
    values['employees-impacted'] * 
    hoursPerYear * 
    (values.productivity / 100);
  
  const productivityValue = productivityHoursSaved * values['hourly-cost'];
  
  // Cost reduction value - now directly tied to hourly cost and employees impacted
  const annualEmployeeCost = values['employees-impacted'] * values['hourly-cost'] * hoursPerYear;
  const costReductionValue = annualEmployeeCost * (values['cost-reduction'] / 100);
  
  // Revenue growth value - increased impact from revenue-growth parameter
  // Assuming $100k base revenue per employee
  const baseRevenue = values['employees-impacted'] * 100000;
  const revenueGrowthValue = baseRevenue * (values['revenue-growth'] / 100);
  
  // Customer satisfaction value - stronger link to customer-satisfaction parameter
  // Estimate based on revenue impact
  const customerSatisfactionValue = 
    baseRevenue * 0.08 * (values['customer-satisfaction'] / 100); // Increased from 0.05 to 0.08
  
  // Apply scaling factors based on the year
  // Value typically increases in later years as adoption improves
  const scalingFactor = 1 + (year - 1) * 0.15; // 15% increase per year
  
  // Create breakdown of values
  const breakdown = {
    'Productivity': productivityValue * scalingFactor,
    'Cost Reduction': costReductionValue * scalingFactor,
    'Revenue Growth': revenueGrowthValue * scalingFactor,
    'Customer Satisfaction': customerSatisfactionValue * scalingFactor
  };
  
  const total = (
    productivityValue + 
    costReductionValue + 
    revenueGrowthValue + 
    customerSatisfactionValue
  ) * scalingFactor;
  
  return { total, breakdown };
}

// Calculate the ROI (Return on Investment) for a given year
export function calculateROI(
  costs: Record<string, number>,
  values: Record<string, number>,
  year: number
): number {
  const yearlyCost = calculateYearlyCosts(costs, year);
  const { total: yearlyValue } = calculateYearlyValue(values, year);
  
  // ROI formula: (Net Profit / Cost of Investment) * 100
  return ((yearlyValue - yearlyCost) / yearlyCost) * 100;
}

// Calculate the cumulative ROI over multiple years
export function calculateCumulativeROI(
  costs: Record<string, number>,
  values: Record<string, number>,
  years: number
): number {
  let totalCost = 0;
  let totalValue = 0;
  
  for (let year = 1; year <= years; year++) {
    totalCost += calculateYearlyCosts(costs, year);
    totalValue += calculateYearlyValue(values, year).total;
  }
  
  // Cumulative ROI formula
  return ((totalValue - totalCost) / totalCost) * 100;
}

// Generate yearly data for charts
export function generateYearlyData(
  costs: Record<string, number>,
  values: Record<string, number>,
  years: number = 5
) {
  const yearlyData = [];
  
  for (let year = 1; year <= years; year++) {
    const yearlyCost = calculateYearlyCosts(costs, year);
    const { total: yearlyValue, breakdown } = calculateYearlyValue(values, year);
    const roi = calculateROI(costs, values, year);
    
    yearlyData.push({
      year,
      cost: yearlyCost,
      value: yearlyValue,
      netValue: yearlyValue - yearlyCost,
      roi,
      ...breakdown
    });
  }
  
  return yearlyData;
}

// Generate cumulative data for charts
export function generateCumulativeData(
  costs: Record<string, number>,
  values: Record<string, number>,
  years: number = 5
) {
  const cumulativeData = [];
  let cumulativeCost = 0;
  let cumulativeValue = 0;
  let cumulativeBreakdown = {
    'Productivity': 0,
    'Cost Reduction': 0,
    'Revenue Growth': 0,
    'Customer Satisfaction': 0
  };
  
  for (let year = 1; year <= years; year++) {
    const yearlyCost = calculateYearlyCosts(costs, year);
    const { total: yearlyValue, breakdown } = calculateYearlyValue(values, year);
    
    cumulativeCost += yearlyCost;
    cumulativeValue += yearlyValue;
    
    // Update cumulative breakdown
    Object.keys(cumulativeBreakdown).forEach(key => {
      cumulativeBreakdown[key] += breakdown[key];
    });
    
    // Cumulative ROI formula
    const cumulativeROI = ((cumulativeValue - cumulativeCost) / cumulativeCost) * 100;
    
    cumulativeData.push({
      year,
      cumulativeCost,
      cumulativeValue,
      cumulativeNetValue: cumulativeValue - cumulativeCost,
      cumulativeROI,
      ...cumulativeBreakdown
    });
  }
  
  return cumulativeData;
}

// Get the value breakdown for pie chart
export function getValueBreakdown(
  values: Record<string, number>,
  year: number = 1
): { name: string; value: number }[] {
  const { breakdown } = calculateYearlyValue(values, year);
  
  return Object.entries(breakdown).map(([name, value]) => ({
    name,
    value
  }));
}
