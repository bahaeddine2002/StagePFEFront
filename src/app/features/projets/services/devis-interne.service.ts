import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import {
  CreateLigneHonoraireRequest,
  DevisInterneResponse,
  TccResolved,
} from "../models/devis-interne";

@Injectable({
  providedIn: "root",
})
export class DevisInterneService {
  private baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) {}

  getByProjetId(projetId: number): Observable<DevisInterneResponse> {
    return this.http.get<DevisInterneResponse>(
      `${this.baseUrl}application-service/api/projets/${projetId}/devis-interne`,
    );
  }

  createForProjet(projetId: number): Observable<DevisInterneResponse> {
    return this.http.post<DevisInterneResponse>(
      `${this.baseUrl}application-service/api/projets/${projetId}/devis-interne`,
      {},
    );
  }

  addLigneHonoraire(
    diId: number,
    payload: CreateLigneHonoraireRequest,
  ): Observable<DevisInterneResponse> {
    return this.http.post<DevisInterneResponse>(
      `${this.baseUrl}application-service/api/devis-internes/${diId}/lignes/honoraires`,
      payload,
    );
  }

  updateLigneHonoraire(
    ligneId: number,
    payload: CreateLigneHonoraireRequest,
  ): Observable<DevisInterneResponse> {
    return this.http.put<DevisInterneResponse>(
      `${this.baseUrl}application-service/api/devis-internes/lignes/${ligneId}`,
      payload,
    );
  }

  deleteLigneHonoraire(
    diId: number,
    ligneId: number,
  ): Observable<DevisInterneResponse> {
    return this.http.delete<DevisInterneResponse>(
      `${this.baseUrl}application-service/api/devis-internes/${diId}/lignes/honoraires/${ligneId}`,
    );
  }

  resolveTcc(employeId: number, annee: number): Observable<TccResolved> {
    const params = new HttpParams()
      .set("employeId", employeId)
      .set("annee", annee);

    return this.http.get<TccResolved>(
      `${this.baseUrl}application-service/api/tcc/resolve`,
      { params },
    );
  }
}
