import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { MetabaseEmbedResponse } from "../models/metabase-embed";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class MetabaseDashboardService {
  private readonly apiUrl =
    environment.baseUrl + "application-service/api/projets";

  constructor(private http: HttpClient) {}

  getProjectDashboardToken(
    projetId: number,
  ): Observable<MetabaseEmbedResponse> {
    return this.http.get<MetabaseEmbedResponse>(
      `${this.apiUrl}/${projetId}/metabase-dashboard-token`,
    );
  }
}
