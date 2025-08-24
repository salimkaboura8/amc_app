import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Order {
  id?: number;
  customerName: string;
  items: Array<{ productId: number; quantity: number }>;
  total: number;
  createdAt?: string;
}

const API_BASE = 'http://localhost:5072';
const LOGIN_ENDPOINT = `${API_BASE}/orders`;

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  constructor(private http: HttpClient) {}

  getOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(LOGIN_ENDPOINT);
  }

  createOrder(order: Order): Observable<Order> {
    return this.http.post<Order>(LOGIN_ENDPOINT, order);
  }
}
