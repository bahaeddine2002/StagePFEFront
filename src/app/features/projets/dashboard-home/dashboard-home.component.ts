import { Component, OnInit } from "@angular/core";
import { NotificationService } from "src/app/core/services/notification.service";
import { Title } from "@angular/platform-browser";
import { NGXLogger } from "ngx-logger";
import { AuthService } from "src/app/core/services/auth.service";
import { ActivatedRoute } from "@angular/router";
import { MetabaseDashboardService } from "../services/metabase-dashboard.service";

@Component({
  selector: "app-dashboard-home",
  templateUrl: "./dashboard-home.component.html",
  styleUrls: ["./dashboard-home.component.css"],
})
export class DashboardHomeComponent implements OnInit {
  projetId!: number;

  token = "";
  isLoading = false;
  errorMessage = "";

  constructor(
    private route: ActivatedRoute,
    private metabaseDashboardService: MetabaseDashboardService,
  ) {}

  ngOnInit(): void {
    this.projetId = Number(this.route.snapshot.paramMap.get("id"));

    if (!this.projetId) {
      this.errorMessage = "Identifiant du projet introuvable.";
      return;
    }

    this.loadMetabaseDashboard();
  }

  loadMetabaseDashboard(): void {
    this.isLoading = true;
    this.errorMessage = "";

    this.metabaseDashboardService
      .getProjectDashboardToken(this.projetId)
      .subscribe({
        next: (response) => {
          this.token = response.token;
          this.isLoading = false;
        },
        error: () => {
          this.errorMessage =
            "Impossible de charger le tableau de bord Metabase.";
          this.isLoading = false;
        },
      });
  }
}
