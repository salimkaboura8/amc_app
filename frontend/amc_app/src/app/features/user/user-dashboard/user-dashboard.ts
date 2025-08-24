import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { Router } from '@angular/router';
import { OrdersService } from '../../../core/services/orders.service';
import { NewOrderDialogComponent, OrderData } from '../new-order-dialog/new-order-dialog';

type OrderStatus = 'EN_COURS' | 'LIVREE';

type Order = {
  id: string;
  date: string;
  itemsCount: number;
  amount: number;
  status: OrderStatus;
};

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

  constructor(private router: Router, private ordersService: OrdersService) {}

  ngOnInit(): void {
    this.ordersService.getOrders().subscribe((data) => {
      console.log(data);
    });
  }

  openNewOrderDialog(): void {
    this.newOrderDialogVisible = true;
  }

  handleCreateOrder(data: OrderData): void {
    this.newOrderDialogVisible = false;
  }

  closeNewOrderDialog(): void {
    this.newOrderDialogVisible = false;
  }

  logout(): void {
    this.router.navigate(['']);
  }

  statusSeverity(status: OrderStatus): 'success' | 'info' | 'danger' {
    switch (status) {
      case 'LIVREE':
        return 'success';
      case 'EN_COURS':
        return 'info';
    }
  }
}
