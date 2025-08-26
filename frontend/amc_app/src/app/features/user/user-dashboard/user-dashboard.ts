import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { Router } from '@angular/router';
import { OrdersService } from '../../../core/services/orders.service';
import { NewOrderDialogComponent } from '../new-order-dialog/new-order-dialog';
import { Order, OrderData, OrderStatus } from '../../../core/models/order';
import { AuthService } from '../../../core/services/auth.service';
import { OrdersTable } from '../../../shared/orders-table/orders-table';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    ToolbarModule,
    ButtonModule,
    DialogModule,
    TableModule,
    TagModule,
    NewOrderDialogComponent,
    OrdersTable,
  ],
  templateUrl: './user-dashboard.html',
  styleUrls: ['./user-dashboard.scss'],
})
export class UserDashboard implements OnInit {
  newOrderDialogVisible = false;
  today = new Date();
  orders: Order[] = [];

  constructor(
    private router: Router,
    private authService: AuthService,
    private ordersService: OrdersService
  ) {}

  ngOnInit(): void {
    this.ordersService.getOrders().subscribe((orders: Order[]) => {
      this.orders = orders;
    });
  }

  openNewOrderDialog(): void {
    this.newOrderDialogVisible = true;
  }

  handleCreateOrder(data: OrderData): void {
    this.ordersService.createOrder(data).subscribe((created) => {
      this.newOrderDialogVisible = false;
      this.orders = [created, ...this.orders];
    });
  }

  closeNewOrderDialog(): void {
    this.newOrderDialogVisible = false;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['']);
  }

  statusLabel(status: 0 | 1 | -1): OrderStatus {
    switch (status) {
      case 1:
        return OrderStatus.ACCEPTEE;
      case -1:
        return OrderStatus.REFUSEE;
      default:
        return OrderStatus.EN_COURS;
    }
  }

  statusSeverity(status: 0 | 1 | -1): 'success' | 'info' | 'danger' {
    switch (status) {
      case 1:
        return 'success';
      case -1:
        return 'danger';
      default:
        return 'info';
    }
  }
}
