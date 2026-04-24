import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { CreateRoleRequest } from "../models/roles";
import { environment } from "src/environments/environment";
import { Observable } from "rxjs";
import { RoleResponse } from "../models/roles";

@Injectable({
  providedIn: "root",
})
export class RolesService {
  private baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) {}

  getRoles() {
    return this.http.get<RoleResponse[]>(
      this.baseUrl + "administration-service/api/profiles",
    );
  }

  createRole(payload: CreateRoleRequest): Observable<any> {
    return this.http.post(
      this.baseUrl + "administration-service/api/profiles",
      payload,
    );
  }

  deleteRole(id: number): Observable<void> {
    return this.http.delete<void>(
      this.baseUrl + `administration-service/api/profiles/${id}`,
    );
  }
}
