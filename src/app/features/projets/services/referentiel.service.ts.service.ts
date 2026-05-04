import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { ReferentielItem } from "../models/ReferentielItem";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class ReferentielServiceTs {
  private baseUrl =
    environment.baseUrl + "nomenclature-service/api/referentiels";

  constructor(private http: HttpClient) {}

  getBusinessModels(): Observable<ReferentielItem[]> {
    return this.http.get<ReferentielItem[]>(`${this.baseUrl}/business-models`);
  }

  getTypesEngagement(): Observable<ReferentielItem[]> {
    return this.http.get<ReferentielItem[]>(`${this.baseUrl}/types-engagement`);
  }

  getDevises(): Observable<ReferentielItem[]> {
    return this.http.get<ReferentielItem[]>(`${this.baseUrl}/devises`);
  }

  getStatutsProjet(): Observable<ReferentielItem[]> {
    return this.http.get<ReferentielItem[]>(`${this.baseUrl}/statuts-projet`);
  }
}
