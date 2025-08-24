import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { Router } from '@angular/router';
import { OrdersService } from '../../../core/services/orders.service';

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
  imports: [CommonModule, ToolbarModule, ButtonModule, DialogModule, TableModule, TagModule],
  templateUrl: './user-dashboard.html',
  styleUrls: ['./user-dashboard.scss'],
})
export class UserDashboard implements OnInit {
  newOrderDialogVisible = false;

  orders: Order[] = [
    { id: 'CMD-001', date: '2025-08-20', itemsCount: 5, amount: 24.9, status: 'LIVREE' },
    { id: 'CMD-002', date: '2025-08-22', itemsCount: 3, amount: 14.5, status: 'LIVREE' },
    { id: 'CMD-003', date: '2025-08-24', itemsCount: 7, amount: 36.0, status: 'EN_COURS' },
  ];

  constructor(private router: Router, private ordersService: OrdersService) {}

  ngOnInit(): void {
    this.ordersService.getOrders().subscribe((data) => {
      console.log(data);
    });
  }

  openNewOrderDialog(): void {
    this.newOrderDialogVisible = true;
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
