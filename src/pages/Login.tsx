import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginForm } from '@/components/auth/LoginForm';
import { useAuth } from '@/contexts/AuthContext';

export function Login() {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  
  // If already authenticated, redirect to dashboard
  useEffect(() => {
    if (isAuthenticated && !loading) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, loading, navigate]);

  const handleLoginSuccess = () => {
    navigate('/dashboard');
  };

  // Show loading state while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-center">
          <div className="h-12 w-12 mx-auto rounded-full bg-primary/20 mb-4"></div>
          <div className="h-4 w-32 bg-muted rounded mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-slate-50 to-slate-100 dark:from-gray-900 dark:to-gray-950">
      <div className="w-full max-w-md mb-8">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-primary">ExecView</h1>
          <p className="text-muted-foreground mt-2">Executive Dashboard</p>
        </div>
        
        <LoginForm onSuccess={handleLoginSuccess} />
        
        <p className="text-center text-xs text-muted-foreground mt-6">
          This is a demo application with mock data. <br />
          No real authentication is happening.
        </p>
      </div>
    </div>
  );
}