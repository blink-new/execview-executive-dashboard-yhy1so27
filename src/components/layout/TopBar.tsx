import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '@/contexts/ThemeContext';
import { useDashboard } from '@/contexts/DashboardContext';
import { Bell, Moon, Search, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { TimePeriodSelector } from '@/components/dashboard/TimePeriodSelector';

export function TopBar() {
  const { theme, toggleTheme } = useTheme();
  const { notifications, timePeriod, setTimePeriod, loading, markNotificationAsRead } = useDashboard();
  const [showSearch, setShowSearch] = useState(false);

  // Count unread notifications
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center px-4">
        <div className="md:hidden mr-2">
          <SidebarTrigger />
        </div>
        
        <div className="flex items-center gap-2 md:hidden">
          <Link 
            to="/dashboard" 
            className="font-semibold tracking-tight text-foreground hover:opacity-80"
          >
            ExecView
          </Link>
        </div>
        
        <div className={`${showSearch ? 'flex' : 'hidden'} md:flex flex-1 md:ml-0 ml-auto`}>
          <form className="flex-1 md:flex-initial md:w-96 lg:w-[500px] relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="w-full pl-9 rounded-md border-muted-foreground/20"
            />
          </form>
        </div>

        <div className="flex items-center ml-auto gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setShowSearch(!showSearch)}
          >
            <Search className="h-5 w-5" />
          </Button>

          <Button 
            variant="ghost" 
            size="icon"
            onClick={toggleTheme} 
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-destructive" />}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <div className="flex items-center justify-between px-4 py-2 border-b">
                <span className="font-medium">Notifications</span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-auto p-1 text-xs"
                  onClick={() => notifications.filter(n => !n.read).forEach(n => markNotificationAsRead(n.id))}
                >
                  Mark all as read
                </Button>
              </div>
              <div className="py-2 max-h-[calc(80vh-100px)] overflow-auto">
                {notifications.length > 0 ? (
                  <div className="space-y-2 px-2">
                    {notifications.slice(0, 5).map(notification => (
                      <div 
                        key={notification.id} 
                        className={`p-2 rounded-md text-sm ${notification.read ? '' : 'bg-muted'}`}
                      >
                        <div className="font-medium">{notification.title}</div>
                        <div className="text-xs text-muted-foreground">{notification.message}</div>
                      </div>
                    ))}
                    <DropdownMenuItem asChild className="w-full justify-center mt-2">
                      <Link to="/dashboard">View all</Link>
                    </DropdownMenuItem>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No notifications</p>
                  </div>
                )}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="hidden md:flex items-center gap-2 text-sm">
            <TimePeriodSelector
              value={timePeriod}
              onChange={setTimePeriod}
              disabled={loading}
            />
          </div>
        </div>
      </div>
    </header>
  );
}