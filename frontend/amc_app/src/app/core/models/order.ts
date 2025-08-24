export interface OrderData {
  firstName: string;
  lastName: string;
  phone: string;
  date: string;
  items: number;
}

export interface Order {
  id?: number;
  customerName: string;
  items: Array<{ productId: number; quantity: number }>;
  total: number;
  createdAt?: string;
}
