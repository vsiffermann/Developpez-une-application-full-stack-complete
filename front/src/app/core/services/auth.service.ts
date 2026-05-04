import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../../shared/models/user.model';

const API_URL = '/api';

export interface AuthResponse {
  user: User;
  token: string;
}

export interface UpdateProfilePayload {
  email?: string;
  username?: string;
  password?: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);

  login(identifier: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${API_URL}/auth/login`, { identifier, password });
  }

  register(email: string, username: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${API_URL}/auth/register`, { email, username, password });
  }

  getMe(): Observable<User> {
    return this.http.get<User>(`${API_URL}/users/me`);
  }

  updateMe(payload: UpdateProfilePayload): Observable<User> {
    return this.http.put<User>(`${API_URL}/users/me`, payload);
  }
}
