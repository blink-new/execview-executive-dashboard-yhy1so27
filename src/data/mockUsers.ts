import { User } from '@/lib/types';

// Mock user data for the authentication system
export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Alexander Mitchell',
    email: 'admin@execview.com',
    role: 'admin',
    avatar: 'https://i.pravatar.cc/150?img=1',
    department: 'Executive'
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'executive@execview.com',
    role: 'executive',
    avatar: 'https://i.pravatar.cc/150?img=5',
    department: 'Executive'
  },
  {
    id: '3',
    name: 'Michael Williams',
    email: 'manager@execview.com',
    role: 'manager',
    avatar: 'https://i.pravatar.cc/150?img=3',
    department: 'Sales'
  },
  {
    id: '4',
    name: 'Emily Davis',
    email: 'analyst@execview.com',
    role: 'analyst',
    avatar: 'https://i.pravatar.cc/150?img=4',
    department: 'Finance'
  }
];

// Function to find a user by email and password
export const findUserByCredentials = (email: string, password: string): User | null => {
  // In a real system, you would hash passwords, but for this mock system
  // we're just checking the email and using a dummy password "password" for all users
  const user = mockUsers.find(user => user.email.toLowerCase() === email.toLowerCase());
  
  // For the MVP, any password will work as long as the email matches
  return user && password ? user : null;
};

// Default login credentials
export const DEFAULT_CREDENTIALS = {
  admin: { email: 'admin@execview.com', password: 'password' },
  executive: { email: 'executive@execview.com', password: 'password' },
  manager: { email: 'manager@execview.com', password: 'password' },
  analyst: { email: 'analyst@execview.com', password: 'password' }
};