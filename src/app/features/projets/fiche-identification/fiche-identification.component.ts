import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ProjetDetailResponse } from "../models/Projets";
import { ProjetService } from "../services/projet.service";

@Component({
  selector: "app-fiche-identification",
  templateUrl: "./fiche-identification.component.html",
  styleUrls: ["./fiche-identification.component.css"],
})
export class FicheIdentificationComponent implements OnInit {
  project?: ProjetDetailResponse;

  loading = false;
  errorMessage = "";

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private projetService: ProjetService,
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get("id"));

    if (!id) {
      this.errorMessage = "Identifiant du projet invalide.";
      return;
    }

    this.loadProjectDetails(id);
  }

  private loadProjectDetails(id: number): void {
    this.loading = true;
    this.errorMessage = "";

    this.projetService.getProjetDetails(id).subscribe({
      next: (response) => {
        this.project = response;
        this.loading = false;
      },
      error: (error) => {
        console.error("Erreur chargement fiche projet", error);
        this.errorMessage =
          "Impossible de charger la fiche d’identification du projet.";
        this.loading = false;
      },
    });
  }

  text(value: string | null | undefined): string {
    return value && value.trim() ? value : "—";
  }

  bool(value: boolean | null | undefined): string {
    if (value === true) return "Oui";
    if (value === false) return "Non";
    return "—";
  }

  number(value: number | null | undefined): string {
    if (value === null || value === undefined) return "—";

    return new Intl.NumberFormat("fr-FR", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 3,
    }).format(value);
  }

  money(value: number | null | undefined): string {
    if (!this.project) return "—";
    if (value === null || value === undefined) return "—";

    return `${this.number(value)} ${this.project.deviseCode || ""}`.trim();
  }

  tnd(value: number | null | undefined): string {
    if (value === null || value === undefined) return "—";
    return `${this.number(value)} TND`;
  }

  jh(value: number | null | undefined): string {
    if (value === null || value === undefined) return "—";
    return `${this.number(value)} J/H`;
  }

  percent(value: number | null | undefined): string {
    if (value === null || value === undefined) return "—";
    return `${this.number(value)} %`;
  }

  date(value: string | null | undefined): string {
    if (!value) return "—";

    const parsedDate = new Date(value);
    if (Number.isNaN(parsedDate.getTime())) return "—";

    return new Intl.DateTimeFormat("fr-FR").format(parsedDate);
  }

  deviseLabel(): string {
    if (!this.project) return "—";

    if (this.project.deviseCode && this.project.deviseLibelle) {
      return `${this.project.deviseCode} - ${this.project.deviseLibelle}`;
    }

    return this.project.deviseCode || this.project.deviseLibelle || "—";
  }

  showTndConversion(): boolean {
    const code = this.project?.deviseCode;
    return !!code && code !== "TND" && code !== "DT";
  }

  alerteRentabilite(): string {
    const value = this.project?.alerteRentabilite;

    if (!value) return "—";

    const labels: Record<string, string> = {
      AUCUNE: "Aucune",
      DI_A_CONFIGURER: "DI à configurer",
    };

    return labels[value] || value;
  }

  onBack(): void {
    this.router.navigate(["/projets"]);
  }

  onEdit(): void {
    if (!this.project) return;
    this.router.navigate(["/projets", this.project.id, "edit"]);
  }

  onExportPdf(): void {
    console.log("Exporter PDF");
  }
}
