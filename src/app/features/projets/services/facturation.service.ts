import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import {
  FacturationEcheanceRequest,
  FacturationPageResponse,
} from "../models/facturation.models";
import { Observable } from "rxjs";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class FacturationService {
  private baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) {}

  getFacturation(projetId: number): Observable<FacturationPageResponse> {
    return this.http.get<FacturationPageResponse>(
      `${this.baseUrl}application-service/api/projets/${projetId}/facturation`,
    );
  }

  createEcheance(
    projetId: number,
    payload: FacturationEcheanceRequest,
  ): Observable<FacturationPageResponse> {
    return this.http.post<FacturationPageResponse>(
      `${this.baseUrl}application-service/api/projets/${projetId}/facturation/echeances`,
      payload,
    );
  }

  updateEcheance(
    projetId: number,
    echeanceId: number,
    payload: FacturationEcheanceRequest,
  ): Observable<FacturationPageResponse> {
    return this.http.put<FacturationPageResponse>(
      `${this.baseUrl}application-service/api/projets/${projetId}/facturation/echeances/${echeanceId}`,
      payload,
    );
  }

  deleteEcheance(
    projetId: number,
    echeanceId: number,
  ): Observable<FacturationPageResponse> {
    return this.http.delete<FacturationPageResponse>(
      `${this.baseUrl}application-service/api/projets/${projetId}/facturation/echeances/${echeanceId}`,
    );
  }
}
