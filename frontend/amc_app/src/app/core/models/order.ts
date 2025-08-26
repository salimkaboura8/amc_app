export interface OrderData {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  date: string;
  nbOfItems: number;
  description: string;
}

export interface Order {
  id?: number;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  date: Date;
  nbOfItems: number;
  price: number;
  description: string;
  status: OrderStatus;
}

export interface OrderResponse {
  id?: number;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  date: Date;
  nbOfItems: number;
  price: number;
  description: string;
  status: number;
}

export enum OrderStatus {
  EN_COURS = 'En cours',
  ACCEPTEE = 'Acceptée',
  REFUSEE = 'Refusée',
}

export function mapOrderStatus(o: OrderResponse): Order {
  return {
    ...o,
    status:
      o.status === 1
        ? OrderStatus.ACCEPTEE
        : o.status === -1
        ? OrderStatus.REFUSEE
        : OrderStatus.EN_COURS,
  };
}
