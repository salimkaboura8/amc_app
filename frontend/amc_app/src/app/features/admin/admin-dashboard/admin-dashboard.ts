import { Component, OnInit } from '@angular/core';
import { Order, OrderStatus } from '../../../core/models/order';
import { OrdersService } from '../../../core/services/orders.service';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ToolbarModule } from 'primeng/toolbar';
import { DialogModule } from 'primeng/dialog';
import { OrdersTable } from '../../../shared/orders-table/orders-table';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-admin-dashboard',
  imports: [CommonModule, ToolbarModule, ButtonModule, DialogModule, OrdersTable],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.scss',
})
export class AdminDashboard implements OnInit {
  orders: Order[] = [];
  selectedOrder: Order | null = null;
  cols = [
    { field: 'id', header: 'Commande' },
    { field: 'firstName', header: 'Prénom' },
    { field: 'lastName', header: 'Nom' },
    { field: 'date', header: 'Date' },
    { field: 'nbOfItems', header: 'Articles' },
    { field: 'price', header: 'Montant' },
    { field: 'status', header: 'Statut' },
  ];

  constructor(
    private router: Router,
    private ordersService: OrdersService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.ordersService.getOrders().subscribe((orders: Order[]) => {
      this.orders = orders;
    });
  }

  openOrderDialog(order: Order): void {
    this.selectedOrder = order;
  }

  closeDialog(): void {
    this.selectedOrder = null;
  }

  handleAccept(order: Order): void {
    // this.ordersService.acceptOrder(order.id).subscribe(() => {
    //   this.updateOrderStatus(order.id, OrderStatus.ACCEPTEE);
    //   this.closeDialog();
    // });
  }

  handleRefuse(order: Order): void {
    // this.ordersService.refuseOrder(order.id).subscribe(() => {
    //   this.updateOrderStatus(order.id, OrderStatus.REFUSEE);
    //   this.closeDialog();
    // });
  }

  updateOrderStatus(id: string, status: OrderStatus): void {
    // this.orders = this.orders.map((o) => (o.id === id ? { ...o, status } : o));
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['']);
  }
}
