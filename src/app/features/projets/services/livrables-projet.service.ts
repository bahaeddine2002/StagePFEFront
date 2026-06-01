import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

import { environment } from "src/environments/environment";
import {
  LivrableCreateRequest,
  LivrableProjetResponse,
  LivrableSuiviUpdateRequest,
} from "../models/livrable-projet.model";

@Injectable({
  providedIn: "root",
})
export class LivrablesProjetService {
  private baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) {}

  getLivrables(projetId: number): Observable<LivrableProjetResponse[]> {
    return this.http.get<LivrableProjetResponse[]>(
      this.baseUrl + `application-service/api/projets/${projetId}/livrables`,
    );
  }

  createLivrable(
    projetId: number,
    payload: LivrableCreateRequest,
  ): Observable<LivrableProjetResponse> {
    return this.http.post<LivrableProjetResponse>(
      this.baseUrl + `application-service/api/projets/${projetId}/livrables`,
      payload,
    );
  }

  updateSuivi(
    projetId: number,
    livrableId: number,
    payload: LivrableSuiviUpdateRequest,
  ): Observable<LivrableProjetResponse> {
    return this.http.patch<LivrableProjetResponse>(
      this.baseUrl +
        `application-service/api/projets/${projetId}/livrables/${livrableId}/status`,
      payload,
    );
  }

  deleteLivrable(projetId: number, livrableId: number): Observable<void> {
    return this.http.delete<void>(
      this.baseUrl +
        `application-service/api/projets/${projetId}/livrables/${livrableId}`,
    );
  }
}
