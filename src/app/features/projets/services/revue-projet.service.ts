import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";

import {
  RevueProjet,
  RevueProjetCreateRequest,
  RevueProjetPeriode,
  RevueProjetUpdateRequest,
} from "../models/revue-projet";

@Injectable({
  providedIn: "root",
})
export class RevueProjetService {
  private baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) {}

  getPeriodesDisponibles(projetId: number): Observable<RevueProjetPeriode[]> {
    return this.http.get<RevueProjetPeriode[]>(
      `${this.baseUrl}application-service/api/projets/${projetId}/revues-projet/periodes`,
    );
  }

  getRevuesByProjet(projetId: number): Observable<RevueProjet[]> {
    return this.http.get<RevueProjet[]>(
      `${this.baseUrl}application-service/api/projets/${projetId}/revues-projet`,
    );
  }

  getRevueByPeriode(
    projetId: number,
    periode: string,
  ): Observable<RevueProjet> {
    const params = new HttpParams().set("periode", periode);

    return this.http.get<RevueProjet>(
      `${this.baseUrl}application-service/api/projets/${projetId}/revues-projet/periode`,
      { params },
    );
  }

  createRevue(
    projetId: number,
    payload: RevueProjetCreateRequest,
  ): Observable<RevueProjet> {
    return this.http.post<RevueProjet>(
      `${this.baseUrl}application-service/api/projets/${projetId}/revues-projet`,
      payload,
    );
  }

  updateRevue(
    projetId: number,
    revueId: number,
    payload: RevueProjetUpdateRequest,
  ): Observable<RevueProjet> {
    return this.http.put<RevueProjet>(
      `${this.baseUrl}application-service/api/projets/${projetId}/revues-projet/${revueId}`,
      payload,
    );
  }

  deleteRevue(projetId: number, revueId: number): Observable<void> {
    return this.http.delete<void>(
      `${this.baseUrl}application-service/api/projets/${projetId}/revues-projet/${revueId}`,
    );
  }
}
