import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";

export type Permissions = {
  id: number;
  code: string;
  libelle: string;
  description: string;
};

@Injectable({
  providedIn: "root",
})
export class PermissionsService {
  private baseUrl = environment.baseUrl;
  constructor(private http: HttpClient) {}

  getPermission() {
    return this.http.get<Permissions[]>(
      this.baseUrl + "administration-service/api/permissions",
    );
  }
}
