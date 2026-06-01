import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";

import {
  OrganisationRequest,
  OrganisationResponse,
  TypeOrganisation,
} from "../models/organisation.model";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class OrganisationService {
  private readonly baseUrl =
    environment.baseUrl + "application-service/api/organisations";

  constructor(private readonly http: HttpClient) {}

  createOrganisation(
    request: OrganisationRequest,
  ): Observable<OrganisationResponse> {
    return this.http.post<OrganisationResponse>(this.baseUrl, request);
  }

  getAllOrganisations(): Observable<OrganisationResponse[]> {
    return this.http.get<OrganisationResponse[]>(this.baseUrl);
  }

  getOrganisationsByType(
    type: TypeOrganisation,
  ): Observable<OrganisationResponse[]> {
    const params = new HttpParams().set("type", type);

    return this.http.get<OrganisationResponse[]>(this.baseUrl, { params });
  }

  getActiveOrganisationsByType(
    type: TypeOrganisation,
  ): Observable<OrganisationResponse[]> {
    const params = new HttpParams().set("type", type);

    return this.http.get<OrganisationResponse[]>(`${this.baseUrl}/active`, {
      params,
    });
  }

  getOrganisationById(id: number): Observable<OrganisationResponse> {
    return this.http.get<OrganisationResponse>(`${this.baseUrl}/${id}`);
  }

  updateOrganisation(
    id: number,
    request: OrganisationRequest,
  ): Observable<OrganisationResponse> {
    return this.http.put<OrganisationResponse>(
      `${this.baseUrl}/${id}`,
      request,
    );
  }

  deleteOrganisation(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
