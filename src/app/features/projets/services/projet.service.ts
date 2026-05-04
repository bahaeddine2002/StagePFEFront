import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { HttpClient } from "@angular/common/http";
import {
  ProjetResponse,
  ProjetCreateRequest,
  ProjetDetailResponse,
} from "../models/Projets";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class ProjetService {
  private readonly baseUrl =
    environment.baseUrl + "application-service/api/projets";

  constructor(private http: HttpClient) {}

  createProjet(payload: ProjetCreateRequest): Observable<ProjetResponse> {
    return this.http.post<ProjetResponse>(this.baseUrl, payload);
  }

  getProjetById(id: number): Observable<ProjetResponse> {
    return this.http.get<ProjetResponse>(`${this.baseUrl}/${id}`);
  }

  getProjetDetails(id: number): Observable<ProjetDetailResponse> {
    return this.http.get<ProjetDetailResponse>(`${this.baseUrl}/${id}/details`);
  }
}
