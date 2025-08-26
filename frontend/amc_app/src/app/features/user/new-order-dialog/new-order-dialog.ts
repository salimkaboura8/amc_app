import { Component, EventEmitter, Output, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { DatePickerModule } from 'primeng/datepicker';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import { TextareaModule } from 'primeng/textarea';
import { OrderData } from '../../../core/models/order';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-new-order-dialog',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    DatePickerModule,
    InputNumberModule,
    TextareaModule,
    ButtonModule,
    DialogModule,
  ],
  templateUrl: './new-order-dialog.html',
  styleUrls: ['./new-order-dialog.scss'],
})
export class NewOrderDialogComponent {
  @Input() initialDate: Date | null = null;

  @Output() submitOrder = new EventEmitter<OrderData>();
  @Output() onCancel = new EventEmitter<void>();

  private fb = inject(FormBuilder);

  form = this.fb.group({
    firstName: ['', [Validators.required, Validators.maxLength(64)]],
    lastName: ['', [Validators.required, Validators.maxLength(64)]],
    phone: ['', [Validators.required, Validators.maxLength(32)]],
    date: [this.initialDate, [Validators.required]],
    items: [1, [Validators.required, Validators.min(1)]],
    description: [''],
  });

  initialFormValue = this.form.getRawValue();
  visible = true;

  submit() {
    if (this.form.invalid) return;
    const v = this.form.value;
    const date = v.date instanceof Date ? v.date.toISOString().substring(0, 10) : String(v.date);
    this.submitOrder.emit({
      firstName: String(v.firstName),
      lastName: String(v.lastName),
      phoneNumber: String(v.phone),
      date,
      nbOfItems: Number(v.items),
      description: String(v.description),
    });
  }

  close(): void {
    this.form.reset(this.initialFormValue);
    this.onCancel.emit();
  }
}
