import React from 'react';
import { useDashboard } from '@/contexts/DashboardContext';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { ChartCard, defaultChartConfig, currencyFormatter, percentFormatter } from '@/components/dashboard/ChartCard';
import { TimePeriodSelector } from '@/components/dashboard/TimePeriodSelector';
import { Button } from '@/components/ui/button';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, ComposedChart, Area } from 'recharts';
import { 
  DollarSign, 
  TrendingDown, 
  TrendingUp, 
  Wallet,
  RefreshCw,
  Download
} from 'lucide-react';

// Chart colors
const CHART_COLORS = [
  'var(--chart-1)',
  'var(--chart-2)',
  'var(--chart-3)',
  'var(--chart-4)',
  'var(--chart-5)',
];

export function FinancialDashboard() {
  const { 
    financial,
    timePeriod,
    loading,
    setTimePeriod,
    refreshData,
    exportData
  } = useDashboard();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Financial Dashboard</h1>
          <p className="text-muted-foreground">
            Track revenue, expenses, profitability and cash flow
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
          <TimePeriodSelector 
            value={timePeriod} 
            onChange={setTimePeriod}
            disabled={loading} 
          />
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => refreshData()}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => exportData('financial')}
            disabled={loading}
          >
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {/* Key metrics */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          metric={financial?.revenue}
          icon={<DollarSign className="h-4 w-4" />}
          loading={loading}
        />
        
        <MetricCard
          metric={financial?.expenses}
          icon={<TrendingDown className="h-4 w-4" />}
          loading={loading}
        />
        
        <MetricCard
          metric={financial?.profitMargin}
          icon={<TrendingUp className="h-4 w-4" />}
          loading={loading}
        />
        
        <MetricCard
          metric={financial?.cashFlow}
          icon={<Wallet className="h-4 w-4" />}
          loading={loading}
        />
      </div>
      
      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard 
          title="Revenue vs Expenses"
          description="Monthly comparison"
          loading={loading}
        >
          <ComposedChart data={financial?.revenueByMonth}>
            {defaultChartConfig.grid}
            {defaultChartConfig.tooltip}
            {defaultChartConfig.xAxis}
            <YAxis 
              tickFormatter={currencyFormatter}
              fontSize={12}
            />
            <Area
              type="monotone"
              dataKey="revenue"
              fill="var(--chart-1)"
              stroke="var(--chart-1)"
              fillOpacity={0.2}
              name="Revenue"
            />
            <Line 
              type="monotone" 
              dataKey="expenses" 
              stroke="var(--chart-2)" 
              strokeWidth={2}
              name="Expenses"
            />
            {defaultChartConfig.legend}
          </ComposedChart>
        </ChartCard>
        
        <ChartCard 
          title="Expenses by Category"
          loading={loading}
        >
          <PieChart>
            {defaultChartConfig.tooltip}
            {defaultChartConfig.legend}
            <Pie
              data={financial?.expensesByCategory}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            >
              {financial?.expensesByCategory.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={CHART_COLORS[index % CHART_COLORS.length]} 
                />
              ))}
            </Pie>
          </PieChart>
        </ChartCard>

        <ChartCard 
          title="Profit Margin Trend"
          description="Monthly profit margin percentage"
          loading={loading}
        >
          <LineChart data={financial?.revenueByMonth}>
            {defaultChartConfig.grid}
            {defaultChartConfig.tooltip}
            {defaultChartConfig.xAxis}
            <YAxis 
              tickFormatter={percentFormatter}
              fontSize={12}
            />
            <Line 
              type="monotone" 
              dataKey="profitMargin" 
              stroke="var(--chart-3)" 
              strokeWidth={2} 
              dot={{ stroke: 'var(--chart-3)', strokeWidth: 2, r: 4 }}
              activeDot={{ stroke: 'var(--chart-3)', strokeWidth: 2, r: 6 }}
              name="Profit Margin"
            />
          </LineChart>
        </ChartCard>
        
        <ChartCard 
          title="Cash Flow Analysis"
          loading={loading}
        >
          <BarChart data={financial?.revenueByMonth}>
            {defaultChartConfig.grid}
            {defaultChartConfig.tooltip}
            {defaultChartConfig.xAxis}
            <YAxis 
              tickFormatter={currencyFormatter}
              fontSize={12}
            />
            <Bar 
              dataKey="cashFlow" 
              name="Cash Flow"
              fill="var(--chart-4)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartCard>
      </div>
    </div>
  );
}