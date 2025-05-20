import { DashboardData, Notification, User, TimePeriod, UserSettings } from '../types';
import { generateFinancialData } from './financial';
import { generateSalesData } from './sales';
import { generateOperationsData } from './operations';
import { generateCustomerData } from './customer';
import { generateEmployeeData } from './employee';
import { STORES, storeData, getAllData, initDatabase } from '../storage';

// Default user accounts
export const defaultUsers: User[] = [
  {
    id: 'admin',
    email: 'admin@execview.com',
    name: 'Admin User',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&h=256&q=80',
    department: 'Executive'
  },
  {
    id: 'executive',
    email: 'exec@execview.com',
    name: 'Jane Executive',
    role: 'executive',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&h=256&q=80',
    department: 'C-Suite'
  },
  {
    id: 'manager',
    email: 'manager@execview.com',
    name: 'Mark Manager',
    role: 'manager',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&h=256&q=80',
    department: 'Sales'
  },
  {
    id: 'viewer',
    email: 'viewer@execview.com',
    name: 'Vicky Viewer',
    role: 'viewer',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&h=256&q=80',
    department: 'Marketing'
  }
];

// Default user settings
export const defaultSettings: UserSettings = {
  theme: 'light',
  dashboardLayout: JSON.stringify({}),
  defaultTimePeriod: 'monthly',
  notificationsEnabled: true
};

/**
 * Generate initial dashboard data
 * @returns Dashboard data with all metrics
 */
export const generateInitialData = (): DashboardData => {
  // Sample counts for each time period
  const dataCounts = {
    daily: 60, // 60 days
    weekly: 26, // 26 weeks (half year)
    monthly: 12, // 12 months (full year)
    quarterly: 8, // 8 quarters (2 years)
    annually: 5 // 5 years
  };
  
  return {
    financial: {
      daily: generateFinancialData('daily', dataCounts.daily),
      weekly: generateFinancialData('weekly', dataCounts.weekly),
      monthly: generateFinancialData('monthly', dataCounts.monthly),
      quarterly: generateFinancialData('quarterly', dataCounts.quarterly),
      annually: generateFinancialData('annually', dataCounts.annually)
    },
    sales: {
      daily: generateSalesData('daily', dataCounts.daily),
      weekly: generateSalesData('weekly', dataCounts.weekly),
      monthly: generateSalesData('monthly', dataCounts.monthly),
      quarterly: generateSalesData('quarterly', dataCounts.quarterly),
      annually: generateSalesData('annually', dataCounts.annually)
    },
    operations: {
      daily: generateOperationsData('daily', dataCounts.daily),
      weekly: generateOperationsData('weekly', dataCounts.weekly),
      monthly: generateOperationsData('monthly', dataCounts.monthly),
      quarterly: generateOperationsData('quarterly', dataCounts.quarterly),
      annually: generateOperationsData('annually', dataCounts.annually)
    },
    customer: {
      daily: generateCustomerData('daily', dataCounts.daily),
      weekly: generateCustomerData('weekly', dataCounts.weekly),
      monthly: generateCustomerData('monthly', dataCounts.monthly),
      quarterly: generateCustomerData('quarterly', dataCounts.quarterly),
      annually: generateCustomerData('annually', dataCounts.annually)
    },
    employee: {
      daily: generateEmployeeData('daily', dataCounts.daily),
      weekly: generateEmployeeData('weekly', dataCounts.weekly),
      monthly: generateEmployeeData('monthly', dataCounts.monthly),
      quarterly: generateEmployeeData('quarterly', dataCounts.quarterly),
      annually: generateEmployeeData('annually', dataCounts.annually)
    }
  };
};

/**
 * Generate sample notifications
 * @returns Array of notifications
 */
export const generateNotifications = (): Notification[] => {
  const notifications: Notification[] = [
    {
      id: 'notif-1',
      type: 'warning',
      title: 'Cash Flow Alert',
      message: 'Q3 cash flow projections below target by 12%. Review financial dashboard.',
      timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 min ago
      read: false,
      category: 'financial'
    },
    {
      id: 'notif-2',
      type: 'success',
      title: 'Sales Target Achieved',
      message: 'APAC region has exceeded Q3 sales targets by 8%. Congratulations to the team!',
      timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(), // 2 hours ago
      read: true,
      category: 'sales'
    },
    {
      id: 'notif-3',
      type: 'info',
      title: 'New Customer Insights',
      message: 'Customer satisfaction score increased by 0.5 points this month.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
      read: false,
      category: 'customer'
    },
    {
      id: 'notif-4',
      type: 'error',
      title: 'Inventory Alert',
      message: 'Product X inventory levels critically low. Expected stockout in 5 days.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(), // 8 hours ago
      read: false,
      category: 'operations'
    },
    {
      id: 'notif-5',
      type: 'warning',
      title: 'Employee Turnover Increase',
      message: 'Engineering department turnover rate increased by 2.5% this month.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
      read: true,
      category: 'employee'
    },
    {
      id: 'notif-6',
      type: 'info',
      title: 'Operations Update',
      message: 'Production efficiency improved by 3% over the last quarter.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(), // 1.5 days ago
      read: false,
      category: 'operations'
    },
    {
      id: 'notif-7',
      type: 'success',
      title: 'Budget Approval',
      message: 'Q4 marketing budget has been approved.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
      read: true,
      category: 'financial'
    }
  ];
  
  return notifications;
};

/**
 * Initialize the data store with initial data if it doesn't exist
 */
export const initializeDataIfNeeded = async (): Promise<void> => {
  try {
    // Initialize database
    await initDatabase();
    
    // Check if financial data exists
    const existingFinancialData = await getAllData(STORES.FINANCIAL);
    
    if (!existingFinancialData || existingFinancialData.length === 0) {
      console.log('No existing data found. Initializing with mock data...');
      
      // Generate initial data
      const initialData = generateInitialData();
      
      // Store data in IndexedDB
      await storeData(STORES.FINANCIAL, initialData.financial.monthly);
      await storeData(STORES.SALES, initialData.sales.monthly);
      await storeData(STORES.OPERATIONS, initialData.operations.monthly);
      await storeData(STORES.CUSTOMER, initialData.customer.monthly);
      await storeData(STORES.EMPLOYEE, initialData.employee.monthly);
      
      // Store notification data
      const notifications = generateNotifications();
      await storeData(STORES.NOTIFICATIONS, notifications);
      
      // Store users
      await storeData(STORES.USERS, defaultUsers);
      
      // Store default settings for each user
      const userSettings = defaultUsers.map(user => ({
        id: user.id,
        ...defaultSettings
      }));
      await storeData(STORES.SETTINGS, userSettings);
      
      console.log('Mock data initialized successfully');
    } else {
      console.log('Data already exists in the database');
    }
  } catch (error) {
    console.error('Error initializing data:', error);
    throw error;
  }
};

/**
 * Reset all data back to initial state
 */
export const resetAllData = async (): Promise<void> => {
  try {
    console.log('Resetting all data to initial state...');
    
    // Generate fresh data
    const initialData = generateInitialData();
    
    // Store data in IndexedDB
    await storeData(STORES.FINANCIAL, initialData.financial.monthly);
    await storeData(STORES.SALES, initialData.sales.monthly);
    await storeData(STORES.OPERATIONS, initialData.operations.monthly);
    await storeData(STORES.CUSTOMER, initialData.customer.monthly);
    await storeData(STORES.EMPLOYEE, initialData.employee.monthly);
    
    // Generate new notifications
    const notifications = generateNotifications();
    await storeData(STORES.NOTIFICATIONS, notifications);
    
    console.log('Data reset completed successfully');
  } catch (error) {
    console.error('Error resetting data:', error);
    throw error;
  }
};

/**
 * Mock data service to simulate API calls
 */
export const dataService = {
  /**
   * Get data with artificial delay to simulate API call
   * @param storeName Store to fetch data from
   * @returns Promise resolving to the requested data
   */
  getData: async <T>(
    storeName: string
  ): Promise<T[]> => {
    // Add artificial delay for realism (300-800ms)
    const delay = Math.random() * 500 + 300;
    
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        try {
          const data = await getAllData<T>(storeName);
          resolve(data);
        } catch (error) {
          reject(error);
        }
      }, delay);
    });
  },
  
  /**
   * Update item with artificial delay
   * @param storeName Store name
   * @param item Item to update
   * @returns Promise that resolves when the update is complete
   */
  updateItem: async <T extends { id: string }>(
    storeName: string,
    item: T
  ): Promise<void> => {
    // Add artificial delay for realism (300-600ms)
    const delay = Math.random() * 300 + 300;
    
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        try {
          // Simulate occasional API failures (5% chance)
          if (Math.random() < 0.05) {
            throw new Error('Simulated API failure');
          }
          
          await import('../storage').then(({ updateItem }) => 
            updateItem(storeName, item)
          );
          resolve();
        } catch (error) {
          reject(error);
        }
      }, delay);
    });
  }
};