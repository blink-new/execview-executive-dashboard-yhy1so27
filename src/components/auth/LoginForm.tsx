import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { DEFAULT_CREDENTIALS } from '@/data/mockUsers';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoginFormProps {
  onSuccess?: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSuccess }) => {
  const { loading, error, login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      if (onSuccess) {
        onSuccess();
      }
    } catch (_) {
      // Error is handled by the auth context
    }
  };

  const handleQuickLogin = async (role: keyof typeof DEFAULT_CREDENTIALS) => {
    const { email, password } = DEFAULT_CREDENTIALS[role];
    setEmail(email);
    setPassword(password);
    try {
      await login(email, password);
      if (onSuccess) {
        onSuccess();
      }
    } catch (_) {
      // Error is handled by the auth context
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg animate-fade-in">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">ExecView Dashboard</CardTitle>
        <CardDescription className="text-center">
          Enter your credentials to access your dashboard
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 rounded-md bg-destructive/15 text-destructive flex items-center gap-2 text-sm">
              <AlertCircle className="h-4 w-4" />
              <span>{error}</span>
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="email@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <a 
                href="#" 
                className="text-sm text-primary hover:underline"
                onClick={(e) => {
                  e.preventDefault();
                  alert('In a real app, this would allow password reset.');
                }}
              >
                Forgot password?
              </a>
            </div>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="remember"
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              disabled={loading}
            />
            <Label 
              htmlFor="remember" 
              className="text-sm font-normal cursor-pointer"
            >
              Remember me
            </Label>
          </div>
          
          <Button 
            type="submit" 
            className="w-full"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        <div className="relative w-full">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">
              Quick access demo accounts
            </span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-2 w-full">
          <Button 
            type="button" 
            variant="outline" 
            size="sm"
            onClick={() => handleQuickLogin('admin')}
            disabled={loading}
            className={cn(
              "transition-all border-primary/20 hover:border-primary/40 hover:bg-primary/5",
              loading && "opacity-50 pointer-events-none"
            )}
          >
            Admin
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            size="sm"
            onClick={() => handleQuickLogin('executive')}
            disabled={loading}
            className={cn(
              "transition-all border-primary/20 hover:border-primary/40 hover:bg-primary/5",
              loading && "opacity-50 pointer-events-none"
            )}
          >
            Executive
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            size="sm"
            onClick={() => handleQuickLogin('manager')}
            disabled={loading}
            className={cn(
              "transition-all border-primary/20 hover:border-primary/40 hover:bg-primary/5",
              loading && "opacity-50 pointer-events-none"
            )}
          >
            Manager
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            size="sm"
            onClick={() => handleQuickLogin('analyst')}
            disabled={loading}
            className={cn(
              "transition-all border-primary/20 hover:border-primary/40 hover:bg-primary/5",
              loading && "opacity-50 pointer-events-none"
            )}
          >
            Analyst
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};