export interface OrderData {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  date: string;
  nbOfItems: number;
}

export interface Order {
  id?: number;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  date: Date;
  nbOfItems: number;
  price: number;
  status: number;
}
