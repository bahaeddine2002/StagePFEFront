import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { CreateUserRequest, UserResponse } from "../models/users";

@Injectable({
  providedIn: "root",
})
export class UsersService {
  private baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) {}

  createUser(payload: CreateUserRequest): Observable<UserResponse> {
    return this.http.post<UserResponse>(
      this.baseUrl + "administration-service/api/admin/users",
      payload,
    );
  }
  getUsers(): Observable<UserResponse[]> {
    return this.http.get<UserResponse[]>(
      this.baseUrl + "administration-service/api/admin/users",
    );
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(
      this.baseUrl + `administration-service/api/admin/users/${id}`,
    );
  }
}
