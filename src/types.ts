export type Product = {
  id: number;
  price: number;
  categories: string[];
  stock: number;
  brand: string;
};

export type RoomCategory = {
  id: number;
  name: string;
};

export interface User {
  id: string;
  email: string;
  role: string;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
}
