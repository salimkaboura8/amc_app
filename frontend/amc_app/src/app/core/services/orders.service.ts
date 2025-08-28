import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { mapOrderStatus, Order, OrderData, OrderResponse } from '../models/order';

const API_BASE = 'http://localhost:5072';
const LOGIN_ENDPOINT = `${API_BASE}/orders`;

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  constructor(private http: HttpClient) {}

  getOrders(): Observable<Order[]> {
    return this.http
      .get<OrderResponse[]>(LOGIN_ENDPOINT)
      .pipe(map((list) => list.map(mapOrderStatus)));
  }

  createOrder(order: OrderData): Observable<Order> {
    return this.http.post<OrderResponse>(LOGIN_ENDPOINT, order).pipe(map(mapOrderStatus));
  }

  acceptOrder(id: number): Observable<void> {
    return this.http.post<void>(`${LOGIN_ENDPOINT}/${id}/accept`, {});
  }

  refuseOrder(id: number): Observable<void> {
    return this.http.post<void>(`${LOGIN_ENDPOINT}/${id}/refuse`, {});
  }
}
