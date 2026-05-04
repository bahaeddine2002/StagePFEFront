import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";

import {
  TccAnneeConfigRequest,
  TccAnneeConfigResponse,
  TccRessourceRequest,
  TccRessourceResponse,
} from "../models/tcc";

@Injectable({
  providedIn: "root",
})
export class TccService {
  private readonly baseUrl = `${environment.baseUrl}application-service/api/tcc`;

  constructor(private http: HttpClient) {}

  // =========================
  // PARAMÉTRAGE ANNUEL
  // =========================

  getAnneeConfigs(): Observable<TccAnneeConfigResponse[]> {
    return this.http.get<TccAnneeConfigResponse[]>(`${this.baseUrl}/annees`);
  }

  getAnneeConfigById(id: number): Observable<TccAnneeConfigResponse> {
    return this.http.get<TccAnneeConfigResponse>(
      `${this.baseUrl}/annees/${id}`,
    );
  }

  createAnneeConfig(
    request: TccAnneeConfigRequest,
  ): Observable<TccAnneeConfigResponse> {
    return this.http.post<TccAnneeConfigResponse>(
      `${this.baseUrl}/annees`,
      request,
    );
  }

  updateAnneeConfig(
    id: number,
    request: TccAnneeConfigRequest,
  ): Observable<TccAnneeConfigResponse> {
    return this.http.put<TccAnneeConfigResponse>(
      `${this.baseUrl}/annees/${id}`,
      request,
    );
  }

  deleteAnneeConfig(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/annees/${id}`);
  }

  // =========================
  // TCC RESSOURCES
  // =========================

  getTccRessources(annee?: number): Observable<TccRessourceResponse[]> {
    let params = new HttpParams();

    if (annee) {
      params = params.set("annee", annee);
    }

    return this.http.get<TccRessourceResponse[]>(`${this.baseUrl}/ressources`, {
      params,
    });
  }

  getTccRessourceById(id: number): Observable<TccRessourceResponse> {
    return this.http.get<TccRessourceResponse>(
      `${this.baseUrl}/ressources/${id}`,
    );
  }

  createTccRessource(
    request: TccRessourceRequest,
  ): Observable<TccRessourceResponse> {
    return this.http.post<TccRessourceResponse>(
      `${this.baseUrl}/ressources`,
      request,
    );
  }

  updateTccRessource(
    id: number,
    request: TccRessourceRequest,
  ): Observable<TccRessourceResponse> {
    return this.http.put<TccRessourceResponse>(
      `${this.baseUrl}/ressources/${id}`,
      request,
    );
  }

  deleteTccRessource(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/ressources/${id}`);
  }
}
