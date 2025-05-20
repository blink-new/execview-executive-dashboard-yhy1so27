import React, { useState } from 'react';
import { 
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription 
} from '@/components/ui/card';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { 
  AlertTriangle,
  CheckCircle2,
  InfoIcon, 
  XCircle,
  Bell,
  FilterIcon,
  RefreshCw
} from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Notification, NotificationCategory } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

interface NotificationsPanelProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onRefresh: () => void;
  loading?: boolean;
}

export function NotificationsPanel({ 
  notifications, 
  onMarkAsRead, 
  onRefresh,
  loading = false 
}: NotificationsPanelProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'unread'>('all');
  const [filterCategories, setFilterCategories] = useState<NotificationCategory[]>([]);
  
  // Filter notifications based on active tab and category filters
  const filteredNotifications = notifications.filter(notification => {
    // Filter by read/unread status
    if (activeTab === 'unread' && notification.read) {
      return false;
    }
    
    // Filter by categories if any are selected
    if (filterCategories.length > 0 && !filterCategories.includes(notification.category)) {
      return false;
    }
    
    return true;
  });
  
  // Toggle category filter
  const toggleCategoryFilter = (category: NotificationCategory) => {
    setFilterCategories(prev => 
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };
  
  // Get notification icon based on type
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      case 'success':
        return <CheckCircle2 className="h-4 w-4 text-emerald-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-rose-500" />;
      case 'info':
      default:
        return <InfoIcon className="h-4 w-4 text-blue-500" />;
    }
  };
  
  // Get category label and color
  const getCategoryInfo = (category: NotificationCategory) => {
    switch (category) {
      case 'financial':
        return { label: 'Financial', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400' };
      case 'sales':
        return { label: 'Sales', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' };
      case 'operations':
        return { label: 'Operations', color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400' };
      case 'customer':
        return { label: 'Customer', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' };
      case 'employee':
        return { label: 'Employee', color: 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-400' };
      case 'system':
        return { label: 'System', color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400' };
    }
  };
  
  // Get formatted date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.round(diffMs / 1000);
    const diffMin = Math.round(diffSec / 60);
    const diffHour = Math.round(diffMin / 60);
    const diffDay = Math.round(diffHour / 24);
    
    if (diffSec < 60) {
      return 'just now';
    } else if (diffMin < 60) {
      return `${diffMin}m ago`;
    } else if (diffHour < 24) {
      return `${diffHour}h ago`;
    } else if (diffDay < 30) {
      return `${diffDay}d ago`;
    } else {
      return date.toLocaleDateString();
    }
  };
  
  // All available categories
  const allCategories: NotificationCategory[] = [
    'financial', 'sales', 'operations', 'customer', 'employee', 'system'
  ];
  
  // Count unread notifications
  const unreadCount = notifications.filter(n => !n.read).length;
  
  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Bell className="h-5 w-5" />
            <CardTitle>Notifications</CardTitle>
            {unreadCount > 0 && (
              <Badge variant="secondary" className="ml-2">
                {unreadCount} new
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onRefresh}
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <FilterIcon className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {allCategories.map(category => {
                  const info = getCategoryInfo(category);
                  return (
                    <DropdownMenuCheckboxItem
                      key={category}
                      checked={filterCategories.includes(category)}
                      onCheckedChange={() => toggleCategoryFilter(category)}
                    >
                      {info.label}
                    </DropdownMenuCheckboxItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <CardDescription>
          Stay updated with important alerts and updates
        </CardDescription>
      </CardHeader>
      
      <Tabs defaultValue="all" value={activeTab} onValueChange={(value) => setActiveTab(value as 'all' | 'unread')}>
        <div className="px-4">
          <TabsList className="w-full">
            <TabsTrigger value="all" className="flex-1">All</TabsTrigger>
            <TabsTrigger value="unread" className="flex-1">
              Unread
              {unreadCount > 0 && <span className="ml-1">({unreadCount})</span>}
            </TabsTrigger>
          </TabsList>
        </div>
        
        <CardContent className="pt-4">
          <TabsContent value="all" className="m-0">
            <NotificationList 
              notifications={filteredNotifications} 
              getNotificationIcon={getNotificationIcon}
              getCategoryInfo={getCategoryInfo}
              formatDate={formatDate}
              onMarkAsRead={onMarkAsRead}
              emptyMessage="No notifications to display"
            />
          </TabsContent>
          
          <TabsContent value="unread" className="m-0">
            <NotificationList 
              notifications={filteredNotifications} 
              getNotificationIcon={getNotificationIcon}
              getCategoryInfo={getCategoryInfo}
              formatDate={formatDate}
              onMarkAsRead={onMarkAsRead}
              emptyMessage="No unread notifications"
            />
          </TabsContent>
        </CardContent>
      </Tabs>
    </Card>
  );
}

interface NotificationListProps {
  notifications: Notification[];
  getNotificationIcon: (type: string) => React.ReactNode;
  getCategoryInfo: (category: NotificationCategory) => { label: string; color: string };
  formatDate: (dateString: string) => string;
  onMarkAsRead: (id: string) => void;
  emptyMessage: string;
}

function NotificationList({ 
  notifications, 
  getNotificationIcon, 
  getCategoryInfo, 
  formatDate, 
  onMarkAsRead,
  emptyMessage 
}: NotificationListProps) {
  return (
    <ScrollArea className="h-[400px]">
      {notifications.length > 0 ? (
        <div className="space-y-4">
          {notifications.map(notification => (
            <div 
              key={notification.id}
              className={`rounded-lg p-3 transition-colors ${
                notification.read 
                  ? 'bg-background' 
                  : 'bg-muted/50'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5">{getNotificationIcon(notification.type)}</div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-sm font-medium leading-none">
                      {notification.title}
                    </h4>
                    <Badge variant="outline" className={`text-xs ${getCategoryInfo(notification.category).color}`}>
                      {getCategoryInfo(notification.category).label}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{notification.message}</p>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-xs text-muted-foreground">
                      {formatDate(notification.timestamp)}
                    </span>
                    {!notification.read && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-auto py-1 px-2 text-xs"
                        onClick={() => onMarkAsRead(notification.id)}
                      >
                        Mark as read
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="h-full flex items-center justify-center py-8">
          <p className="text-sm text-muted-foreground">{emptyMessage}</p>
        </div>
      )}
    </ScrollArea>
  );
}