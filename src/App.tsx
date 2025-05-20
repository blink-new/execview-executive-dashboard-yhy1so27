import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { DashboardProvider } from '@/contexts/DashboardContext';
import { Login } from '@/pages/Login';
import { Dashboard } from '@/pages/Dashboard';
import { FinancialDashboard } from '@/pages/FinancialDashboard';
import { SettingsPage } from '@/pages/SettingsPage';
import { DashboardLayout } from '@/components/layout/DashboardLayout';

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <DashboardProvider>
            <Routes>
              <Route path="/login" element={<Login />} />
              
              <Route path="/dashboard" element={<DashboardLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="financial" element={<FinancialDashboard />} />
                <Route path="sales" element={<div>Sales Dashboard Coming Soon</div>} />
                <Route path="operations" element={<div>Operations Dashboard Coming Soon</div>} />
                <Route path="customers" element={<div>Customer Dashboard Coming Soon</div>} />
                <Route path="employees" element={<div>Employee Dashboard Coming Soon</div>} />
                <Route path="settings" element={<SettingsPage />} />
              </Route>
              
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </DashboardProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;