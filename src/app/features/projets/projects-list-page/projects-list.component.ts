import { Component, OnInit, inject } from "@angular/core";
import { Router } from "@angular/router";
import { finalize } from "rxjs";

import { ProjetService } from "../services/projet.service";
import { ProjetResponse } from "../models/Projets";
@Component({
  selector: "app-projets-list",
  templateUrl: "./projets-list.component.html",
  styleUrls: ["./projets-list.component.css"],
})
export class ProjetsListComponent implements OnInit {
  private router = inject(Router);
  private projetService = inject(ProjetService);

  totalProjets = 0;
  projetsActifs = 0;
  projetsClotures = 0;

  projets: ProjetResponse[] = [];
  filteredProjets: ProjetResponse[] = [];

  isLoading = false;
  errorMessage = "";
  searchTerm = "";

  ngOnInit(): void {
    this.loadProjects();
  }

  loadProjects(): void {
    this.isLoading = true;
    this.errorMessage = "";

    this.projetService
      .getAllProjets()
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (projets) => {
          this.projets = projets || [];
          this.filteredProjets = this.projets;
          this.calculateStats();
        },
        error: (error) => {
          console.error("Erreur lors du chargement des projets", error);
          this.errorMessage =
            "Impossible de charger la liste des projets. Veuillez réessayer.";
          this.projets = [];
          this.filteredProjets = [];
          this.calculateStats();
        },
      });
  }

  private calculateStats(): void {
    this.totalProjets = this.projets.length;

    this.projetsActifs = this.projets.filter((p) =>
      this.isActiveProject(p),
    ).length;

    this.projetsClotures = this.projets.filter((p) =>
      this.isClosedProject(p),
    ).length;
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
      const searchableText = [
        projet.codeProjet,
        projet.nomProjet,
        projet.client,
        projet.partenaire,
        this.getStatutLabel(projet),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchableText.includes(this.searchTerm);
    });
  }

  trackByProjetId(index: number, projet: ProjetResponse): number {
    return projet.id;
  }

  getProjetInitials(projet: ProjetResponse): string {
    return (projet.nomProjet || "Projet")
      .split(" ")
      .slice(0, 2)
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase();
  }

  getStatutLabel(projet: ProjetResponse): string {
    return `Statut #${projet.statutProjetId}`;
  }

  isActiveProject(projet: ProjetResponse): boolean {
    const statut = this.getStatutLabel(projet).toLowerCase();

    return (
      statut.includes("cours") ||
      statut.includes("planifié") ||
      statut.includes("planifie") ||
      statut.includes("actif")
    );
  }

  isClosedProject(projet: ProjetResponse): boolean {
    const statut = this.getStatutLabel(projet).toLowerCase();

    return (
      statut.includes("clôturé") ||
      statut.includes("cloture") ||
      statut.includes("terminé") ||
      statut.includes("termine")
    );
  }

  onView(projet: ProjetResponse): void {
    this.router.navigate(["/projets", projet.id, "vue-ensemble"]);
  }

  onOpenDevisInterne(projet: ProjetResponse): void {
    this.router.navigate(["/projets", projet.id, "devis-interne"]);
  }

  onEdit(projet: ProjetResponse): void {
    this.router.navigate(["/projets", projet.id, "edit"]);
  }

  onDelete(projet: ProjetResponse): void {
    const confirmed = window.confirm(
      `Voulez-vous vraiment supprimer le projet ${projet.codeProjet} ?`,
    );

    if (!confirmed) {
      return;
    }
    this.projetService.deleteProjet(projet.id).subscribe({
      next: () => {
        this.projets = this.projets.filter((p) => p.id !== projet.id);
        this.applySearch(this.searchTerm);
        this.calculateStats();
      },
      error: (error) => {
        console.error("Erreur lors de la suppression du projet", error);
        this.errorMessage =
          "Impossible de supprimer ce projet. Veuillez réessayer.";
      },
    });
  }
}
