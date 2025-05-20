import React from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { 
  BarChart2, 
  DollarSign, 
  ShoppingCart, 
  Truck, 
  Users, 
  Heart,
  Settings,
  LifeBuoy,
  LogOut
} from 'lucide-react';
import {
  Sidebar,
  SidebarTrigger,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';

export function SidebarNav() {
  const { user, logout } = useAuth();
  
  return (
    <Sidebar collapsible="icon" side="left">
      <SidebarHeader className="flex items-center justify-between">
        <div className="flex items-center gap-2 px-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-lg font-semibold text-primary-foreground">
            E
          </div>
          <span className="font-semibold tracking-tight">ExecView</span>
        </div>
        <SidebarTrigger />
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <NavLink to="/dashboard" end>
              {({ isActive }) => (
                <SidebarMenuButton
                  isActive={isActive}
                  tooltip="Dashboard"
                >
                  <BarChart2 className="h-4 w-4" />
                  <span>Dashboard</span>
                </SidebarMenuButton>
              )}
            </NavLink>
          </SidebarMenuItem>
          
          <SidebarMenuItem>
            <NavLink to="/dashboard/financial">
              {({ isActive }) => (
                <SidebarMenuButton
                  isActive={isActive}
                  tooltip="Financial"
                >
                  <DollarSign className="h-4 w-4" />
                  <span>Financial</span>
                </SidebarMenuButton>
              )}
            </NavLink>
          </SidebarMenuItem>
          
          <SidebarMenuItem>
            <NavLink to="/dashboard/sales">
              {({ isActive }) => (
                <SidebarMenuButton
                  isActive={isActive}
                  tooltip="Sales"
                >
                  <ShoppingCart className="h-4 w-4" />
                  <span>Sales</span>
                </SidebarMenuButton>
              )}
            </NavLink>
          </SidebarMenuItem>
          
          <SidebarMenuItem>
            <NavLink to="/dashboard/operations">
              {({ isActive }) => (
                <SidebarMenuButton
                  isActive={isActive}
                  tooltip="Operations"
                >
                  <Truck className="h-4 w-4" />
                  <span>Operations</span>
                </SidebarMenuButton>
              )}
            </NavLink>
          </SidebarMenuItem>
          
          <SidebarMenuItem>
            <NavLink to="/dashboard/customers">
              {({ isActive }) => (
                <SidebarMenuButton
                  isActive={isActive}
                  tooltip="Customers"
                >
                  <Heart className="h-4 w-4" />
                  <span>Customers</span>
                </SidebarMenuButton>
              )}
            </NavLink>
          </SidebarMenuItem>
          
          <SidebarMenuItem>
            <NavLink to="/dashboard/employees">
              {({ isActive }) => (
                <SidebarMenuButton
                  isActive={isActive}
                  tooltip="Employees"
                >
                  <Users className="h-4 w-4" />
                  <span>Employees</span>
                </SidebarMenuButton>
              )}
            </NavLink>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
      
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <NavLink to="/dashboard/settings">
              {({ isActive }) => (
                <SidebarMenuButton
                  isActive={isActive}
                  tooltip="Settings"
                >
                  <Settings className="h-4 w-4" />
                  <span>Settings</span>
                </SidebarMenuButton>
              )}
            </NavLink>
          </SidebarMenuItem>
          
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Help & Support"
            >
              <LifeBuoy className="h-4 w-4" />
              <span>Support</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          
          <SidebarMenuItem>
            <Button 
              variant="ghost" 
              className={cn(
                "w-full justify-start",
                "hover:bg-destructive/10 hover:text-destructive" 
              )}
              onClick={logout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              <span>Log out</span>
            </Button>
          </SidebarMenuItem>
        </SidebarMenu>
        
        {user && (
          <div className="flex items-center gap-2 px-2 py-2">
            <div className="h-8 w-8 rounded-full bg-muted overflow-hidden">
              {user.avatar ? (
                <img 
                  src={user.avatar} 
                  alt={user.name} 
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center bg-primary text-primary-foreground text-sm font-medium">
                  {user.name.charAt(0)}
                </div>
              )}
            </div>
            <div className="flex flex-col text-sm leading-tight">
              <span className="font-medium">{user.name}</span>
              <span className="text-xs text-muted-foreground">{user.role}</span>
            </div>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}