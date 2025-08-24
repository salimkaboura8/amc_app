export interface OrderData {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  date: string;
  nbOfItems: number;
}

export interface Order {
  id?: number;
  customerName: string;
  items: Array<{ productId: number; quantity: number }>;
  total: number;
  createdAt?: string;
}
