import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Order, OrderStatus } from '../../core/models/order';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-orders-table',
  standalone: true,
  imports: [
    CommonModule,
    TagModule,
    ProgressSpinnerModule,
    TableModule,
    DialogModule,
    ButtonModule,
  ],
  templateUrl: './orders-table.html',
  styleUrl: './orders-table.scss',
})
export class OrdersTable {
  @Input({ required: true }) orders: Order[] = [];
  @Input() cols = [
    { field: 'id', header: 'Commande' },
    { field: 'firstName', header: 'Prénom' },
    { field: 'lastName', header: 'Nom' },
    { field: 'phoneNumber', header: 'Téléphone' },
    { field: 'date', header: 'Date' },
    { field: 'nbOfItems', header: 'Articles' },
    { field: 'price', header: 'Montant' },
    { field: 'status', header: 'Statut' },
  ];
  @Input() emptyMessage = 'Aucune commande pour le moment.';
  @Input() sortField: keyof Order = 'date';
  @Input() sortOrder: 1 | -1 = -1;
  @Input() showPaginator = false;
  @Input() rows = 10;
  @Input() rowsPerPageOptions: number[] = [5, 10, 20];
  @Input() isAdmin = false;

  @Output() acceptOrder = new EventEmitter<number>();
  @Output() refuseOrder = new EventEmitter<number>();

  detailsVisible = false;
  selectedOrder: Order | null = null;
  OrderStatus = OrderStatus;
  isLoading = false;

  openDetails(order: Order) {
    this.selectedOrder = order;
    this.detailsVisible = true;
  }

  closeDetails() {
    this.detailsVisible = false;
    this.selectedOrder = null;
    this.isLoading = false;
  }

  statusLabel(status: OrderStatus): string {
    switch (status) {
      case OrderStatus.ACCEPTEE:
        return 'Livrée';
      case OrderStatus.REFUSEE:
        return 'Refusée';
      default:
        return 'En cours';
    }
  }

  statusSeverity(status: OrderStatus): 'info' | 'success' | 'danger' {
    switch (status) {
      case OrderStatus.EN_COURS:
        return 'info';
      case OrderStatus.ACCEPTEE:
        return 'success';
      case OrderStatus.REFUSEE:
        return 'danger';
      default:
        return 'info';
    }
  }

  getFieldValue(order: any, field: string): any {
    return order[field];
  }

  accept(orderId: number) {
    this.isLoading = true;

    this.acceptOrder.emit(orderId);

    setTimeout(() => {
      this.closeDetails();
    }, 500);
  }

  refuse(orderId: number) {
    this.isLoading = true;

    this.refuseOrder.emit(orderId);

    setTimeout(() => {
      this.closeDetails();
    }, 500);
  }
}
