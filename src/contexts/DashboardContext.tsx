import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  DashboardData, 
  TimePeriod, 
  FinancialSummary,
  SalesSummary,
  OperationsSummary,
  CustomerSummary,
  EmployeeSummary,
  Notification
} from '@/lib/types';
import { dataService } from '@/lib/data';
import { STORES, initDatabase } from '@/lib/storage';

// Default time period
const DEFAULT_TIME_PERIOD: TimePeriod = 'monthly';

interface DashboardContextState {
  financial: FinancialSummary | null;
  sales: SalesSummary | null;
  operations: OperationsSummary | null;
  customer: CustomerSummary | null;
  employee: EmployeeSummary | null;
  notifications: Notification[];
  timePeriod: TimePeriod;
  lastUpdated: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: DashboardContextState = {
  financial: null,
  sales: null,
  operations: null,
  customer: null,
  employee: null,
  notifications: [],
  timePeriod: DEFAULT_TIME_PERIOD,
  lastUpdated: null,
  loading: true,
  error: null
};

interface DashboardContextValue extends DashboardContextState {
  setTimePeriod: (period: TimePeriod) => void;
  refreshData: () => Promise<void>;
  resetData: () => Promise<void>;
  markNotificationAsRead: (id: string) => Promise<void>;
  exportData: (section: keyof DashboardData) => void;
}

const DashboardContext = createContext<DashboardContextValue | undefined>(undefined);

export const DashboardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<DashboardContextState>(initialState);
  const [dbInitialized, setDbInitialized] = useState<boolean>(false);

  // Initialize the database
  useEffect(() => {
    async function initialize() {
      try {
        await initDatabase();
        setDbInitialized(true);
        
        // Also initialize data if needed
        await import('@/lib/data').then(({ initializeDataIfNeeded }) => 
          initializeDataIfNeeded()
        );
      } catch (error) {
        console.error('Failed to initialize database', error);
        setState(prev => ({
          ...prev,
          loading: false,
          error: 'Failed to initialize database. Please try again.'
        }));
      }
    }
    
    initialize();
  }, []);

  // Load data based on the selected time period
  const loadData = useCallback(async (period: TimePeriod = state.timePeriod) => {
    // Skip loading if database isn't initialized yet
    if (!dbInitialized) {
      return;
    }
    
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      // Fetch financial data
      const financialData = await dataService.getData<FinancialSummary>(STORES.FINANCIAL);
      
      // Fetch sales data
      const salesData = await dataService.getData<SalesSummary>(STORES.SALES);
      
      // Fetch operations data
      const operationsData = await dataService.getData<OperationsSummary>(STORES.OPERATIONS);
      
      // Fetch customer data
      const customerData = await dataService.getData<CustomerSummary>(STORES.CUSTOMER);
      
      // Fetch employee data
      const employeeData = await dataService.getData<EmployeeSummary>(STORES.EMPLOYEE);
      
      // Fetch notifications
      const notifications = await dataService.getData<Notification>(STORES.NOTIFICATIONS);
      
      setState({
        financial: financialData[0] || null,
        sales: salesData[0] || null,
        operations: operationsData[0] || null,
        customer: customerData[0] || null,
        employee: employeeData[0] || null,
        notifications: notifications,
        timePeriod: period,
        lastUpdated: new Date().toISOString(),
        loading: false,
        error: null
      });
    } catch (error) {
      console.error('Failed to load dashboard data', error);
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: 'Failed to load dashboard data. Please try again.' 
      }));
    }
  }, [state.timePeriod, dbInitialized]);

  // Load data once database is initialized
  useEffect(() => {
    if (dbInitialized) {
      loadData();
    }
  }, [dbInitialized, loadData]);

  // Change time period and reload data
  const setTimePeriod = useCallback((period: TimePeriod) => {
    loadData(period);
  }, [loadData]);

  // Refresh data
  const refreshData = useCallback(async () => {
    await loadData();
  }, [loadData]);

  // Reset data to initial state
  const resetData = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      // Call the reset data function
      await import('@/lib/data').then(({ resetAllData }) => resetAllData());
      
      // Reload data after reset
      await loadData();
    } catch (error) {
      console.error('Failed to reset data', error);
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: 'Failed to reset data. Please try again.' 
      }));
    }
  }, [loadData]);

  // Mark notification as read
  const markNotificationAsRead = useCallback(async (id: string) => {
    try {
      // Find notification
      const notification = state.notifications.find(n => n.id === id);
      
      if (notification) {
        // Update notification
        const updatedNotification = { ...notification, read: true };
        
        // Update in storage
        await dataService.updateItem(STORES.NOTIFICATIONS, updatedNotification);
        
        // Update state
        setState(prev => ({
          ...prev,
          notifications: prev.notifications.map(n => 
            n.id === id ? updatedNotification : n
          )
        }));
      }
    } catch (error) {
      console.error('Failed to mark notification as read', error);
    }
  }, [state.notifications]);

  // Export data as CSV
  const exportData = useCallback((section: keyof DashboardData) => {
    const data = state[section];
    if (!data) return;

    // Convert data to CSV
    let csv = '';
    const headers: string[] = [];
    
    // Add headers based on the first object's keys
    if (Array.isArray(data)) {
      // Handle array data (like notifications)
      if (data.length > 0) {
        Object.keys(data[0]).forEach(key => {
          headers.push(key);
        });
        
        csv += headers.join(',') + '\n';
        
        // Add rows
        data.forEach(item => {
          const row = headers.map(header => {
            const value = item[header as keyof typeof item];
            return typeof value === 'string' ? `"${value}"` : value;
          });
          csv += row.join(',') + '\n';
        });
      }
    } else {
      // Handle object data (like financial, sales, etc.)
      Object.keys(data).forEach(key => {
        headers.push(key);
      });
      
      csv += headers.join(',') + '\n';
      
      // Add single row
      const row = headers.map(header => {
        const value = data[header as keyof typeof data];
        return typeof value === 'string' ? `"${value}"` : value;
      });
      csv += row.join(',') + '\n';
    }
    
    // Create download link
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', `${section}_data_${state.timePeriod}.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }, [state]);

  const contextValue: DashboardContextValue = {
    ...state,
    setTimePeriod,
    refreshData,
    resetData,
    markNotificationAsRead,
    exportData
  };

  return (
    <DashboardContext.Provider value={contextValue}>
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = (): DashboardContextValue => {
  const context = useContext(DashboardContext);
  
  if (context === undefined) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  
  return context;
};