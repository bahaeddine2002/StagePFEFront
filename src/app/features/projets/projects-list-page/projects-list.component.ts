import { Component, OnInit, inject } from "@angular/core";
import { Router } from "@angular/router";

type StaticProjet = {
  id: number;
  codeProjet: string;
  nomProjet: string;
  client: string;
  partenaire: string;
  statut: "En cours" | "Planifié" | "Clôturé";
};

@Component({
  selector: "app-projets-list",
  templateUrl: "./projets-list.component.html",
  styleUrls: ["./projets-list.component.css"],
})
export class ProjetsListComponent implements OnInit {
  private router = inject(Router);

  totalProjets = 0;
  projetsActifs = 0;
  projetsClotures = 0;

  projets: StaticProjet[] = [];
  filteredProjets: StaticProjet[] = [];

  isLoading = false;
  errorMessage = "";
  searchTerm = "";

  ngOnInit(): void {
    this.loadStaticProjects();
  }

  loadStaticProjects(): void {
    this.isLoading = true;
    this.errorMessage = "";

    this.projets = [
      {
        id: 1,
        codeProjet: "PRJ-2026-001",
        nomProjet: "Plateforme de Suivi Budgétaire",
        client: "Banque Zitouna",
        partenaire: "ST2i",
        statut: "En cours",
      },
      {
        id: 2,
        codeProjet: "PRJ-2026-002",
        nomProjet: "Portail RH Interne",
        client: "ST2i Groupe",
        partenaire: "ST2i",
        statut: "Planifié",
      },
      {
        id: 3,
        codeProjet: "PRJ-2025-014",
        nomProjet: "Archivage Intelligent",
        client: "Ministère",
        partenaire: "ST2i",
        statut: "Clôturé",
      },
    ];

    this.filteredProjets = this.projets;
    this.totalProjets = this.projets.length;
    this.projetsActifs = this.projets.filter(
      (p) => p.statut === "En cours" || p.statut === "Planifié",
    ).length;
    this.projetsClotures = this.projets.filter(
      (p) => p.statut === "Clôturé",
    ).length;

    this.isLoading = false;
  }

  setUrl(): void {
    this.router.navigate(["/projets/create"]);
  }

  applySearch(value: string): void {
    this.searchTerm = value.trim().toLowerCase();

    if (!this.searchTerm) {
      this.filteredProjets = this.projets;
      return;
    }

    this.filteredProjets = this.projets.filter((projet) => {
      return (
        projet.codeProjet.toLowerCase().includes(this.searchTerm) ||
        projet.nomProjet.toLowerCase().includes(this.searchTerm) ||
        projet.client.toLowerCase().includes(this.searchTerm) ||
        projet.partenaire.toLowerCase().includes(this.searchTerm) ||
        projet.statut.toLowerCase().includes(this.searchTerm)
      );
    });
  }

  trackByProjetId(index: number, projet: StaticProjet): number {
    return projet.id;
  }

  getProjetInitials(projet: StaticProjet): string {
    return projet.nomProjet
      .split(" ")
      .slice(0, 2)
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase();
  }

  onView(projet: StaticProjet): void {
    this.router.navigate(["/projets", projet.id]);
  }

  onEdit(projet: StaticProjet): void {
    console.log("Edit projet", projet);
  }

  onDelete(projet: StaticProjet): void {
    console.log("Delete projet", projet);
  }
}
