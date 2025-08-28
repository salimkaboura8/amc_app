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
        const role = this.extractUserRole();
        this.router.navigate([`/${role}/dashboard`]);
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = this.getErrorMessage(error.status);
        form.control.setErrors({ auth: true });
      },
    });
  }

  private extractUserRole(): string {
    const token = this.authService.getToken();
    const payload = token ? JSON.parse(atob(token.split('.')[1])) : null;
    const ROLE_CLAIM = 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role';
    const roles = payload?.[ROLE_CLAIM] || [];
    const roleArray = Array.isArray(roles) ? roles : [roles];
    return roleArray.includes('Admin') ? 'admin' : 'user';
  }

  private getErrorMessage(status: number): string {
    const messages: { [key: number]: string } = {
      401: 'Email ou mot de passe incorrect',
      403: 'Accès non autorisé',
      0: 'Impossible de se connecter au serveur',
    };
    return messages[status] || 'Une erreur est survenue. Veuillez réessayer.';
  }
}
