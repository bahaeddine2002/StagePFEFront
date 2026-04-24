import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, tap } from "rxjs";
import { environment } from "src/environments/environment";
import { LoginRequest, LoginResponse } from "../models/auth";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private baseUrl = environment.baseUrl;
  private readonly TOKEN_KEY = "access_token";
  private readonly USER_KEY = "current_user";

  constructor(private http: HttpClient) {}

  login(payload: LoginRequest): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(
        this.baseUrl + "administration-service/api/auth/login",
        payload,
      )
      .pipe(
        tap((response) => {
          this.setSession(response);
        }),
      );
  }

  setSession(response: LoginResponse): void {
    localStorage.setItem(this.TOKEN_KEY, response.token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(response));
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getCurrentUser(): LoginResponse | null {
    const raw = localStorage.getItem(this.USER_KEY);
    return raw ? JSON.parse(raw) : null;
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }

  getPermissions(): string[] {
    const user = this.getCurrentUser();
    return user?.permissionCodes ?? [];
  }

  hasPermission(permission: string): boolean {
    return this.getPermissions().includes(permission);
  }

  hasAnyPermission(permissions: string[]): boolean {
    const userPermissions = this.getPermissions();

    if (!permissions.length) {
      return false;
    }

    return permissions.some((permission) =>
      userPermissions.includes(permission),
    );
  }

  hasAllPermissions(permissions: string[]): boolean {
    const userPermissions = this.getPermissions();

    if (!permissions.length) {
      return false;
    }

    return permissions.every((permission) =>
      userPermissions.includes(permission),
    );
  }
}
