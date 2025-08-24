import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, map, tap } from 'rxjs';
import { StorageService } from './storage.service';

const API_BASE = 'http://localhost:5072';
const LOGIN_ENDPOINT = `${API_BASE}/auth/login`;
const TOKEN_KEY = 'auth_token';

export interface LoginRequest {
  email: string;
  password: string;
}
export interface LoginResponse {
  token: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private storage = inject(StorageService);

  private _token$ = new BehaviorSubject<string | null>(this.getStoredToken());
  readonly token$ = this._token$.asObservable();

  login(credentials: LoginRequest) {
    return this.http.post<LoginResponse>(LOGIN_ENDPOINT, credentials).pipe(
      tap((res) => {
        this.storage.setItem(TOKEN_KEY, res.token);
        this._token$.next(res.token);
      }),
      map(() => void 0)
    );
  }

  logout() {
    this.storage.removeItem(TOKEN_KEY);
    this._token$.next(null);
  }

  getToken() {
    return this._token$.value;
  }

  private getStoredToken(): string | null {
    return this.storage.getItem(TOKEN_KEY);
  }
}
