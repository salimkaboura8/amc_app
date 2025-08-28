import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

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
  isLoading = false;
  errorMessage = '';

  user: AuthUser = {
    email: '',
    password: '',
  };

  constructor(private router: Router, private authService: AuthService) {}

  toggleUserType(): void {
    this.isAdmin = !this.isAdmin;
    this.errorMessage = ''; // Clear error when switching
  }

  onSubmit(form: NgForm): void {
    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const { email, password } = form.value;
    this.authService.login({ email, password }).subscribe({
      next: () => {
        const token = this.authService.getToken();
        const payload = token ? JSON.parse(atob(token.split('.')[1])) : null;
        const roles: string[] = payload?.[
          'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'
        ]
          ? Array.isArray(payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'])
            ? payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']
            : [payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']]
          : [];
        const role = roles.includes('Admin') ? 'admin' : 'user';
        this.router.navigate([`/${role}/dashboard`]);
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        // Handle different error types
        if (error.status === 401) {
          this.errorMessage = 'Email ou mot de passe incorrect';
        } else if (error.status === 403) {
          this.errorMessage = 'Accès non autorisé';
        } else if (error.status === 0) {
          this.errorMessage = 'Impossible de se connecter au serveur';
        } else {
          this.errorMessage = 'Une erreur est survenue. Veuillez réessayer.';
        }
        form.control.setErrors({ auth: true });
      },
    });
  }
}
