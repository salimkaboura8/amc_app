import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { Router } from '@angular/router';

type AuthUser = {
  email: string;
  password: string;
};

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    MessageModule,
  ],
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent {
  isAdmin = false;

  user: AuthUser = {
    email: '',
    password: '',
  };

  constructor(private router: Router) {}

  toggleUserType(): void {
    this.isAdmin = !this.isAdmin;
  }

  onSubmit(form: NgForm): void {
    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }
    const role = this.isAdmin ? 'admin' : 'user';
    this.router.navigate([`/${role}/dashboard`]);
  }
}
