import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order, OrderData } from '../models/order';

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

  createOrder(order: OrderData): Observable<Order> {
    return this.http.post<Order>(LOGIN_ENDPOINT, order);
  }
}
