import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { API_URL } from '../../../services/api.service';
import { AuthResponseDto } from '../../models/dtos/auth-response.dto';
import { LoginRequestDto } from '../../models/dtos/login-request.dto';
import { RegisterRequestDto } from '../../models/dtos/register-request.dto';
import { UserDto } from '../../models/dtos/user.dto';

const TOKEN_KEY = 'token';
const USER_KEY = 'user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  currentUser = signal<UserDto | null>(null);
  isLoggedIn = signal(false);

  constructor() {
    const savedUser = localStorage.getItem(USER_KEY);
    const savedToken = localStorage.getItem(TOKEN_KEY);

    if (savedUser && savedToken) {
      this.currentUser.set(JSON.parse(savedUser));
      this.isLoggedIn.set(true);
    }
  }

  login(request: LoginRequestDto) {
    return this.http.post<AuthResponseDto>(`${API_URL}/auth/sign-in`, request);
  }

  register(request: RegisterRequestDto) {
    return this.http.post<AuthResponseDto>(`${API_URL}/auth/sign-up`, request);
  }

  me() {
    return this.http.get<UserDto>(`${API_URL}/auth/me`);
  }

  setSession(response: AuthResponseDto) {
    localStorage.setItem(TOKEN_KEY, response.token);
    localStorage.setItem(USER_KEY, JSON.stringify(response.user));
    this.currentUser.set(response.user);
    this.isLoggedIn.set(true);
  }

  logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    this.currentUser.set(null);
    this.isLoggedIn.set(false);
    this.router.navigate(['/login']);
  }
}
