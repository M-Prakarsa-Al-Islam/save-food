export enum Role {
  USER = 'USER',
  PARTNER = 'PARTNER',
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: Role.USER;
  avatarUrl?: string;
}

export interface Restaurant {
  id: string;
  name:string;
  address: string;
  type: string;
  contact: string;
  rewardPoints: number;
  lat: number;
  lng: number;
  role: Role.PARTNER;
  email: string;
  avatarUrl?: string;
}

export interface FoodItem {
  id: string;
  restaurantId: string;
  name: string;
  description?: string;
  imageUrl: string;
  stock: number;
  originalPrice: number;
  discountedPrice: number;
  expiresAt: Date;
  isSurpriseMeal: boolean;
  category: string;
  pickupAddress: string;
  pickupLat: number;
  pickupLng: number;
}

export interface Reservation {
  id: string;
  userId: string;
  foodItemId: string;
  reservationCode: string;
  qrCodeValue: string;
  createdAt: Date;
  status: 'active' | 'completed' | 'cancelled';
}

export type AuthenticatedUser = (User | Restaurant) & { role: Role };