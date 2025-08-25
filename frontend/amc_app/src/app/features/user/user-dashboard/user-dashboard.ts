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
import { Order, OrderData } from '../../../core/models/order';
import { AuthService } from '../../../core/services/auth.service';

export enum OrderStatusEnum {
  EN_COURS = 'En cours',
  LIVREE = 'Livrée',
}

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

  statusLabel(status: 0 | 1): OrderStatusEnum {
    return status === 0 ? OrderStatusEnum.EN_COURS : OrderStatusEnum.LIVREE;
  }

  statusSeverity(status: 0 | 1): 'success' | 'info' {
    return status === 1 ? 'success' : 'info';
  }
}
