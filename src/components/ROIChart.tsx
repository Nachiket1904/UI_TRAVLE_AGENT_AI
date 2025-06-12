
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { generateYearlyData, generateCumulativeData, getValueBreakdown } from '../utils/calculationUtils';
import { TrendingUp, BarChart3, BarChart2, PieChartIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ROIChartProps {
  costs: Record<string, number>;
  values: Record<string, number>;
}

type ChartType = 'yearly' | 'cumulative';

const ROIChart: React.FC<ROIChartProps> = ({ costs, values }) => {
  const [chartType, setChartType] = React.useState<ChartType>('yearly');
  const [selectedYear, setSelectedYear] = React.useState<number>(1);
  
  const yearlyData = React.useMemo(() => 
    generateYearlyData(costs, values, 5), 
    [costs, values]
  );

  const cumulativeData = React.useMemo(() => 
    generateCumulativeData(costs, values, 5), 
    [costs, values]
  );

  const valueBreakdown = React.useMemo(() => 
    getValueBreakdown(values, selectedYear),
    [values, selectedYear]
  );
  // Log valueBreakdown to the console whenever it updates
  React.useEffect(() => {
    console.log('yearlyData Breakdown:', yearlyData);
    console.log('cumulativeData Breakdown:', cumulativeData);
    console.log('valueBreakdown Breakdown:', valueBreakdown);
  }, [yearlyData, cumulativeData,valueBreakdown]);

  const data = chartType === 'yearly' ? yearlyData : cumulativeData;

  // Colors for pie chart
  const COLORS = ['#2563eb', '#10b981', '#f97316', '#8b5cf6'];

  // Format currency for tooltips
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/90 backdrop-blur-sm p-4 border border-border rounded-lg shadow-md">
          <p className="font-medium">Year {label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={`item-${index}`} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.name.includes('ROI') 
                ? `${entry.value.toFixed(1)}%` 
                : formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Calculate the cumulative ROI for 5 years
  const fiveYearROI = React.useMemo(() => {
    const finalYear = cumulativeData[cumulativeData.length - 1];
    return finalYear.cumulativeROI;
  }, [cumulativeData]);

  // Calculate the payback period (first year where cumulative net value > 0)
  const paybackPeriod = React.useMemo(() => {
    const paybackYear = cumulativeData.find(year => year.cumulativeNetValue > 0);
    return paybackYear ? paybackYear.year : '>5';
  }, [cumulativeData]);

  return (
    <div className="w-full space-y-6 animate-slide-up" style={{ animationDelay: '300ms' }}>
      <div className="space-y-2">
        <span className="inline-block px-2.5 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary">
          Results
        </span>
        <h2 className="text-2xl font-semibold">Value Analysis</h2>
        <p className="text-muted-foreground">
          Visualization of costs, benefits, and return on investment over time.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-5 bg-white/60 backdrop-blur-md border border-border rounded-lg shadow-sm">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">5-Year ROI</p>
            <p className="text-3xl font-semibold text-primary mt-2">
              {fiveYearROI.toFixed(1)}%
            </p>
          </div>
        </div>
        
        <div className="p-5 bg-white/60 backdrop-blur-md border border-border rounded-lg shadow-sm">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Payback Period</p>
            <p className="text-3xl font-semibold text-primary mt-2">
              {paybackPeriod} {paybackPeriod === 1 ? 'Year' : 'Years'}
            </p>
          </div>
        </div>
        
        <div className="p-5 bg-white/60 backdrop-blur-md border border-border rounded-lg shadow-sm">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">5-Year Net Value</p>
            <p className="text-3xl font-semibold text-primary mt-2">
              {formatCurrency(cumulativeData[cumulativeData.length - 1].cumulativeNetValue)}
            </p>
          </div>
        </div>
      </div>

      {/* Chart Type Toggle */}
      <div className="flex items-center justify-center gap-3 mb-2">
        <button
          onClick={() => setChartType('yearly')}
          className={cn(
            "px-3 py-1.5 text-sm font-medium rounded-md transition-colors",
            chartType === 'yearly' 
              ? "bg-primary text-white" 
              : "bg-secondary text-foreground hover:bg-secondary/80"
          )}
        >
          Yearly
        </button>
        <button
          onClick={() => setChartType('cumulative')}
          className={cn(
            "px-3 py-1.5 text-sm font-medium rounded-md transition-colors",
            chartType === 'cumulative' 
              ? "bg-primary text-white" 
              : "bg-secondary text-foreground hover:bg-secondary/80"
          )}
        >
          Cumulative
        </button>
      </div>

      {/* All Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Costs vs. Value Chart */}
        <div className="p-5 bg-white/60 backdrop-blur-md border border-border rounded-lg shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-medium">Costs vs. Value</h3>
          </div>

          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="year" />
              <YAxis tickFormatter={(tick) => formatCurrency(tick).replace('$', '$')} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Area 
                type="monotone" 
                dataKey={chartType === 'yearly' ? 'cost' : 'cumulativeCost'} 
                name={chartType === 'yearly' ? 'Yearly Cost' : 'Cumulative Cost'} 
                stackId="1"
                stroke="#ef4444" 
                fill="rgba(239, 68, 68, 0.2)" 
              />
              <Area 
                type="monotone" 
                dataKey={chartType === 'yearly' ? 'value' : 'cumulativeValue'} 
                name={chartType === 'yearly' ? 'Yearly Value' : 'Cumulative Value'} 
                stackId="2"
                stroke="#10b981" 
                fill="rgba(16, 185, 129, 0.2)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Net Value Chart */}
        <div className="p-5 bg-white/60 backdrop-blur-md border border-border rounded-lg shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <BarChart2 className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-medium">Net Value</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="year" />
              <YAxis tickFormatter={(tick) => formatCurrency(tick).replace('$', '$')} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar 
                dataKey={chartType === 'yearly' ? 'netValue' : 'cumulativeNetValue'} 
                name={chartType === 'yearly' ? 'Yearly Net Value' : 'Cumulative Net Value'} 
                fill="#2563eb" 
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* ROI % Chart */}
        <div className="p-5 bg-white/60 backdrop-blur-md border border-border rounded-lg shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-medium">ROI %</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="year" />
              <YAxis 
                tickFormatter={(tick) => `${tick}%`}
                domain={['auto', 'auto']}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line 
                type="monotone" 
                dataKey={chartType === 'yearly' ? 'roi' : 'cumulativeROI'} 
                name={chartType === 'yearly' ? 'Yearly ROI' : 'Cumulative ROI'} 
                stroke="#2563eb" 
                strokeWidth={3}
                dot={{ r: 4 }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Value Breakdown Chart */}
        <div className="p-5 bg-white/60 backdrop-blur-md border border-border rounded-lg shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <PieChartIcon className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-medium">Value Breakdown</h3>
          </div>
          <div className="w-full flex flex-col items-center">
            <div className="mb-4">
              <label className="mr-2 text-sm font-medium">Select Year:</label>
              <select 
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="px-3 py-1.5 text-sm font-medium rounded-md border border-border bg-white/80"
              >
                {[1, 2, 3, 4, 5].map(year => (
                  <option key={year} value={year}>Year {year}</option>
                ))}
              </select>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={valueBreakdown}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {valueBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ROIChart;
