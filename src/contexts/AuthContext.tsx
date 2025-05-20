import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthState } from '@/lib/types';
import { dataService } from '@/lib/data';
import { STORES } from '@/lib/storage';

// Default auth state
const defaultAuthState: AuthState = {
  isAuthenticated: false,
  user: null,
  loading: true,
  error: null
};

// Keys for localStorage
const AUTH_TOKEN_KEY = 'execview_auth_token';
const AUTH_USER_KEY = 'execview_auth_user';

// Create context
interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>(defaultAuthState);

  // Initialize auth state from localStorage on mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = localStorage.getItem(AUTH_TOKEN_KEY);
        const userJson = localStorage.getItem(AUTH_USER_KEY);
        
        if (token && userJson) {
          const user = JSON.parse(userJson) as User;
          setAuthState({
            isAuthenticated: true,
            user,
            loading: false,
            error: null
          });
        } else {
          setAuthState({
            ...defaultAuthState,
            loading: false
          });
        }
      } catch (_) {
        setAuthState({
          ...defaultAuthState,
          loading: false,
          error: 'Failed to initialize authentication'
        });
      }
    };

    initAuth();
  }, []);

  // Login function - password is unused in this mock implementation
  const login = async (email: string, _password: string): Promise<void> => {
    setAuthState(prevState => ({
      ...prevState,
      loading: true,
      error: null
    }));

    try {
      // Simulate API call delay for realism
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // In a real app, we would make an API call here
      // Instead, we'll fetch from our mock data
      const users = await dataService.getData<User>(STORES.USERS);
      
      // Find user by email (case insensitive)
      // In this mock version, we're not actually checking passwords
      const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
      
      if (user) {
        // Create a simple token (in a real app, this would come from the server)
        const token = `mock-token-${user.id}-${Date.now()}`;
        
        // Store in localStorage
        localStorage.setItem(AUTH_TOKEN_KEY, token);
        localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
        
        setAuthState({
          isAuthenticated: true,
          user,
          loading: false,
          error: null
        });
      } else {
        setAuthState(prevState => ({
          ...prevState,
          loading: false,
          error: 'Invalid email or password'
        }));
      }
    } catch (_) {
      setAuthState(prevState => ({
        ...prevState,
        loading: false,
        error: 'Login failed. Please try again.'
      }));
    }
  };

  // Logout function
  const logout = (): void => {
    // Clear localStorage
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);
    
    // Reset auth state
    setAuthState({
      ...defaultAuthState,
      loading: false
    });
  };

  // Build context value
  const contextValue: AuthContextType = {
    isAuthenticated: authState.isAuthenticated,
    user: authState.user,
    loading: authState.loading,
    error: authState.error,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for accessing auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};