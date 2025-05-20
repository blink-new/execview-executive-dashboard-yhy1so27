import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useDashboard } from '@/contexts/DashboardContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { TimePeriodSelector } from '@/components/dashboard/TimePeriodSelector';
import { ChartCard, defaultChartConfig, currencyFormatter } from '@/components/dashboard/ChartCard';
import { NotificationsPanel } from '@/components/dashboard/NotificationsPanel';
import { Button } from '@/components/ui/button';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { 
  DollarSign, 
  Users, 
  ShoppingCart, 
  Activity,
  RefreshCw,
  Download
} from 'lucide-react';

// Sample colors for chart segments
const CHART_COLORS = [
  'var(--chart-1)',
  'var(--chart-2)',
  'var(--chart-3)',
  'var(--chart-4)',
  'var(--chart-5)',
];

export function Dashboard() {
  const { user } = useAuth();
  const { 
    financial, 
    sales, 
    operations, 
    customer, 
    notifications,
    timePeriod,
    loading,
    setTimePeriod,
    refreshData,
    markNotificationAsRead,
    exportData
  } = useDashboard();

  // Get first name only
  const firstName = user?.name.split(' ')[0] || 'User';

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome back, {firstName}
          </h1>
          <p className="text-muted-foreground">
            Here's what's happening across your business today
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
          metric={customer?.satisfactionScore}
          icon={<Users className="h-4 w-4" />}
          loading={loading}
        />
        
        <MetricCard
          metric={sales?.totalSales}
          icon={<ShoppingCart className="h-4 w-4" />}
          loading={loading}
        />
        
        <MetricCard
          metric={operations?.productionEfficiency}
          icon={<Activity className="h-4 w-4" />}
          loading={loading}
        />
      </div>
      
      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <ChartCard 
          title="Revenue Trend"
          description="Monthly revenue performance"
          loading={loading}
          className="col-span-4"
          actions={
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => exportData('financial')}
              disabled={loading}
            >
              <Download className="h-4 w-4" />
            </Button>
          }
        >
          <LineChart data={financial?.revenueByMonth}>
            {defaultChartConfig.grid}
            {defaultChartConfig.tooltip}
            {defaultChartConfig.xAxis}
            <YAxis 
              tickFormatter={currencyFormatter}
              fontSize={12}
            />
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke="var(--chart-1)" 
              strokeWidth={2} 
              dot={{ stroke: 'var(--chart-1)', strokeWidth: 2, r: 4 }}
              activeDot={{ stroke: 'var(--chart-1)', strokeWidth: 2, r: 6 }}
              name="Revenue"
            />
          </LineChart>
        </ChartCard>
        
        <ChartCard 
          title="Expenses by Category"
          loading={loading}
          className="col-span-3"
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
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <ChartCard 
          title="Sales by Region"
          loading={loading}
          className="col-span-4"
        >
          <BarChart data={sales?.salesByRegion}>
            {defaultChartConfig.grid}
            {defaultChartConfig.tooltip}
            {defaultChartConfig.xAxis}
            <YAxis fontSize={12} />
            <Bar 
              dataKey="value" 
              name="Sales"
              fill="var(--chart-2)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartCard>
        
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>
              Recent alerts and updates
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <NotificationsPanel 
              notifications={notifications}
              onMarkAsRead={markNotificationAsRead}
              onRefresh={refreshData}
              loading={loading}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}