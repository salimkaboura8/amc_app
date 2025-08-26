import { Component, Input } from '@angular/core';
import { Order, OrderStatus } from '../../core/models/order';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { TagModule } from 'primeng/tag';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-orders-table',
  imports: [CommonModule, TagModule, TableModule, DialogModule],
  templateUrl: './orders-table.html',
  styleUrl: './orders-table.scss',
})
export class OrdersTable {
  @Input({ required: true }) orders: Order[] = [];
  @Input() cols = [
    { field: 'id', header: 'Commande' },
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

  detailsVisible = false;
  selectedOrder: Order | null = null;

  openDetails(order: Order) {
    this.selectedOrder = order;
    this.detailsVisible = true;
  }

  closeDetails() {
    this.detailsVisible = false;
    this.selectedOrder = null;
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

  statusSeverity(status: OrderStatus): 'info' | 'success' {
    return status === OrderStatus.EN_COURS ? 'info' : 'success';
  }
}
