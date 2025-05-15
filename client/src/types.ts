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
  role: "customer" | "admin" | "deliverer";
}

export type AuthContextType = {
  user: User | null;
  loading: boolean;
  logout: () => Promise<void>;
};

export type Order = {
  order_id: number;
  status: string;
  time: string;
};

export type OrderItem = {
  product_id: number;
  quantity: number;
  price_at_order: string;
};

export type SelectedOrder = {
  order: Order;
  items: OrderItem[];
};
