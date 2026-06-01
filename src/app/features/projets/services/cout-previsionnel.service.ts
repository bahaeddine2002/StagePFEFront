import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import {
  CoutPrevisionnelResponse,
  CoutPrevisionnelSaveRequest,
} from "../models/cout-previsionnel.model";

@Injectable({
  providedIn: "root",
})
export class CoutPrevisionnelService {
  private baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) {}

  getCoutPrevisionnel(projectId: number): Observable<CoutPrevisionnelResponse> {
    return this.http.get<CoutPrevisionnelResponse>(
      this.baseUrl +
        `application-service/api/projets/${projectId}/cout-previsionnel`,
    );
  }

  saveCoutPrevisionnel(
    projectId: number,
    payload: CoutPrevisionnelSaveRequest,
  ): Observable<void> {
    return this.http.put<void>(
      this.baseUrl +
        `application-service/api/projets/${projectId}/cout-previsionnel`,
      payload,
    );
  }
}
