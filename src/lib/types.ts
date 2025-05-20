// User Roles
export type UserRole = 'admin' | 'executive' | 'manager' | 'analyst';

// User 
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  department?: string;
}

// Authentication
export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  error: string | null;
}

// Time Periods
export type TimePeriod = 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annually';

// Theme
export type Theme = 'light' | 'dark';

// Trend Direction
export type TrendDirection = 'up' | 'down' | 'neutral';

// Metric with trend
export interface MetricWithTrend {
  id: string;
  name: string;
  value: number;
  format?: string;
  previousValue: number;
  changePercentage: number;
  trend: TrendDirection;
  description?: string;
}

// Chart Data Point
export interface ChartDataPoint {
  date: string;
  value: number;
  [key: string]: any; // For additional data points
}

// Basic Metric
export interface Metric {
  id: string;
  name: string;
  value: number;
  format?: string;
  description?: string;
}

// Notification
export type NotificationPriority = 'low' | 'medium' | 'high' | 'critical';

export type NotificationCategory = 
  | 'financial' 
  | 'sales' 
  | 'operations' 
  | 'customer' 
  | 'employee' 
  | 'system';

export interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  priority: NotificationPriority;
  category: NotificationCategory;
}

// Financial Data Types
export interface FinancialSummary {
  revenue: MetricWithTrend;
  expenses: MetricWithTrend;
  profitMargin: MetricWithTrend;
  cashFlow: MetricWithTrend;
  revenueByMonth: ChartDataPoint[];
  expensesByCategory: Metric[];
}

// Sales Data Types
export interface SalesSummary {
  totalSales: MetricWithTrend;
  conversionRate: MetricWithTrend;
  averageDealSize: MetricWithTrend;
  salesPipeline: Metric[];
  salesByRegion: Metric[];
  topProducts: Metric[];
}

// Operations Data Types
export interface OperationsSummary {
  productionEfficiency: MetricWithTrend;
  inventoryLevel: MetricWithTrend;
  deliveryPerformance: MetricWithTrend;
  qualityScore: MetricWithTrend;
  inventoryTrend: ChartDataPoint[];
  qualityByProduct: Metric[];
}

// Customer Data Types
export interface CustomerSummary {
  satisfactionScore: MetricWithTrend;
  churnRate: MetricWithTrend;
  lifetimeValue: MetricWithTrend;
  ticketVolume: MetricWithTrend;
  satisfactionTrend: ChartDataPoint[];
  ticketsByType: Metric[];
}

// Employee Data Types
export interface EmployeeSummary {
  headcount: MetricWithTrend;
  productivity: MetricWithTrend;
  engagementScore: MetricWithTrend;
  retentionRate: MetricWithTrend;
  headcountByDepartment: Metric[];
  engagementTrend: ChartDataPoint[];
}

// Dashboard Data
export interface DashboardData {
  financial: FinancialSummary;
  sales: SalesSummary;
  operations: OperationsSummary;
  customer: CustomerSummary;
  employee: EmployeeSummary;
  notifications: Notification[];
  lastUpdated: string;
}