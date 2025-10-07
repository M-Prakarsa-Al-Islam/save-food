import React, { createContext, useState, useEffect } from 'react';
import { Role, type AuthenticatedUser, type Restaurant, type User } from '../types';

// --- MOCK DATA (MOVED FROM DataContext) ---
export const INITIAL_MOCK_RESTAURANTS: Restaurant[] = [
    { id: 'resto-1', name: 'Bakery Sehat', address: 'Jl. Roti Enak No. 1', type: 'Bakery', contact: '08123', rewardPoints: 150, lat: -6.21, lng: 106.81, role: Role.PARTNER, email: 'resto1@test.com' },
    { id: 'resto-2', name: 'Warung Nasi Ibu', address: 'Jl. Kenyang No. 5', type: 'Warung', contact: '08234', rewardPoints: 80, lat: -6.22, lng: 106.82, role: Role.PARTNER, email: 'resto2@test.com' },
    { id: 'resto-3', name: 'Kopi Pagi', address: 'Jl. Kafein No. 10', type: 'Kafe', contact: '08345', rewardPoints: 250, lat: -6.20, lng: 106.83, role: Role.PARTNER, email: 'resto3@test.com' },
];

export const INITIAL_MOCK_USERS: User[] = [
    { id: 'user-1', name: 'Andi', email: 'andi@test.com', phone: '08987', role: Role.USER }
];

interface AuthContextType {
  currentUser: AuthenticatedUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, role: Role) => Promise<void>;
  register: (details: any) => Promise<void>;
  logout: () => void;
  users: User[];
  restaurants: Restaurant[];
  updateRestaurantPoints: (restaurantId: string, points: number) => void;
  updateUserProfile: (userId: string, role: Role, details: Partial<User | Restaurant>) => Promise<void>;
  deleteUserProfile: (userId: string, role: Role) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<AuthenticatedUser | null>(null);
  const [users, setUsers] = useState<User[]>(INITIAL_MOCK_USERS);
  const [restaurants, setRestaurants] = useState<Restaurant[]>(INITIAL_MOCK_RESTAURANTS);

  useEffect(() => {
    const storedUser = localStorage.getItem('savefood_user');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email: string, password: string, role: Role): Promise<void> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        let user: AuthenticatedUser | undefined;
        if (role === Role.USER) {
          user = users.find(u => u.email === email);
        } else {
          user = restaurants.find(r => r.email === email);
        }

        if (user) { // No password check for mock
          setCurrentUser(user);
          localStorage.setItem('savefood_user', JSON.stringify(user));
          resolve();
        } else {
          reject(new Error('Email atau password salah.'));
        }
      }, 500);
    });
  };
  
  const register = async (details: any): Promise<void> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const emailExists = users.some(u => u.email === details.email) || restaurants.some(r => r.email === details.email);
        if (emailExists) {
            return reject(new Error('Email sudah terdaftar.'));
        }

        let newUser: AuthenticatedUser;
        if (details.role === Role.USER) {
            const user: User = {
                id: `user-${Date.now()}`,
                email: details.email,
                name: details.name,
                phone: details.phone,
                role: Role.USER,
            };
            setUsers(prev => [...prev, user]);
            newUser = user;
        } else { // PARTNER
            const restaurant: Restaurant = {
                id: `resto-${Date.now()}`,
                email: details.email,
                name: details.name,
                role: Role.PARTNER,
                rewardPoints: 0,
                address: "Alamat Baru (mohon lengkapi)",
                type: "Restoran",
                contact: details.phone,
                lat: -6.200,
                lng: 106.800,
            };
            setRestaurants(prev => [...prev, restaurant]);
            newUser = restaurant;
        }
        
        // Log in the new user
        setCurrentUser(newUser);
        localStorage.setItem('savefood_user', JSON.stringify(newUser));
        resolve();
      }, 500);
    });
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('savefood_user');
  };

  const updateRestaurantPoints = (restaurantId: string, points: number) => {
    setRestaurants(prev => prev.map(resto => 
        resto.id === restaurantId ? { ...resto, rewardPoints: resto.rewardPoints + points } : resto
    ));
  };
  
  const updateUserProfile = async (userId: string, role: Role, details: Partial<User | Restaurant>): Promise<void> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            if (role === Role.USER) {
                setUsers(prev => prev.map(u => u.id === userId ? { ...u, ...details } as User : u));
            } else {
                setRestaurants(prev => prev.map(r => r.id === userId ? { ...r, ...details } as Restaurant : r));
            }
            
            if (currentUser && currentUser.id === userId) {
                const updatedUser = { ...currentUser, ...details };
                setCurrentUser(updatedUser as AuthenticatedUser);
                localStorage.setItem('savefood_user', JSON.stringify(updatedUser));
            }
            resolve();
        }, 300);
    });
  };

  const deleteUserProfile = async (userId: string, role: Role): Promise<void> => {
      return new Promise((resolve) => {
          setTimeout(() => {
              if (role === Role.USER) {
                  setUsers(prev => prev.filter(u => u.id !== userId));
              } else {
                  setRestaurants(prev => prev.filter(r => r.id !== userId));
              }
              logout(); // Logout after deletion
              resolve();
          }, 300);
      });
  };


  return (
    <AuthContext.Provider value={{ currentUser, isAuthenticated: !!currentUser, login, register, logout, users, restaurants, updateRestaurantPoints, updateUserProfile, deleteUserProfile }}>
      {children}
    </AuthContext.Provider>
  );
};