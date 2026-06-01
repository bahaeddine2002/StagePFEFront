import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { finalize } from "rxjs";

import {
  FacturationEcheanceResponse,
  FacturationPageResponse,
} from "../models/facturation.models";
import { FacturationService } from "../services/facturation.service";
import { ToastService } from "src/app/shared/toast/toast.service.ts.service";

@Component({
  selector: "app-facturation",
  templateUrl: "./facturation.component.html",
  styleUrls: ["./facturation.component.css"],
})
export class FacturationComponent implements OnInit {
  projetId!: number;

  facturation: FacturationPageResponse | null = null;

  isLoading = false;
  isDeletingEcheanceId: number | null = null;

  searchTerm = "";

  isFormDrawerOpen = false;
  isDetailsDrawerOpen = false;

  selectedEcheance: FacturationEcheanceResponse | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private facturationService: FacturationService,
    private toastService: ToastService,
  ) {}

  ngOnInit(): void {
    this.projetId = Number(this.route.snapshot.paramMap.get("id"));

    if (!this.projetId) {
      this.toastService.error("Projet introuvable dans l'URL.");
      this.goBack();
      return;
    }

    this.loadFacturation();
  }

  loadFacturation(): void {
    this.isLoading = true;

    this.facturationService
      .getFacturation(this.projetId)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (response) => {
          this.facturation = response;
        },
        error: (error) => {
          const message = this.extractErrorMessage(
            error,
            "Erreur lors du chargement de la facturation.",
          );

          this.toastService.error(message);
        },
      });
  }

  get echeances(): FacturationEcheanceResponse[] {
    return this.facturation?.echeances || [];
  }

  get filteredEcheances(): FacturationEcheanceResponse[] {
    const term = this.searchTerm.trim().toLowerCase();

    if (!term) {
      return this.echeances;
    }

    return this.echeances.filter((echeance) => {
      return (
        echeance.description?.toLowerCase().includes(term) ||
        echeance.evenement?.toLowerCase().includes(term) ||
        echeance.referenceFacture?.toLowerCase().includes(term)
      );
    });
  }

  get hasEcheances(): boolean {
    return this.echeances.length > 0;
  }

  openAddDrawer(): void {
    if (!this.facturation) {
      this.toastService.error(
        "Impossible d'ajouter une échéance avant le chargement de la facturation.",
      );
      return;
    }

    this.selectedEcheance = null;
    this.isFormDrawerOpen = true;
  }

  openEditDrawer(echeance: FacturationEcheanceResponse): void {
    if (!this.facturation) {
      this.toastService.error(
        "Impossible de modifier cette échéance pour le moment.",
      );
      return;
    }

    this.selectedEcheance = echeance;
    this.isFormDrawerOpen = true;
  }

  closeFormDrawer(): void {
    this.isFormDrawerOpen = false;
    this.selectedEcheance = null;
  }

  openDetailsDrawer(echeance: FacturationEcheanceResponse): void {
    this.selectedEcheance = echeance;
    this.isDetailsDrawerOpen = true;
  }

  closeDetailsDrawer(): void {
    this.isDetailsDrawerOpen = false;
    this.selectedEcheance = null;
  }

  onEcheanceSaved(response: FacturationPageResponse): void {
    this.facturation = response;
    this.closeFormDrawer();

    this.toastService.success("Échéance enregistrée avec succès.");
  }

  deleteEcheance(echeance: FacturationEcheanceResponse): void {
    const confirmed = confirm(
      `Voulez-vous supprimer l'échéance ${echeance.ordre} ?`,
    );

    if (!confirmed) {
      return;
    }

    if (!this.facturation) {
      this.toastService.error(
        "Impossible de supprimer cette échéance pour le moment.",
      );
      return;
    }

    this.isDeletingEcheanceId = echeance.id;

    this.facturationService
      .deleteEcheance(this.projetId, echeance.id)
      .pipe(finalize(() => (this.isDeletingEcheanceId = null)))
      .subscribe({
        next: (response) => {
          this.facturation = response;
          this.toastService.success("Échéance supprimée avec succès.");
        },
        error: (error) => {
          const message = this.extractErrorMessage(
            error,
            "Erreur lors de la suppression de l'échéance.",
          );

          this.toastService.error(message);
        },
      });
  }

  goBack(): void {
    this.router.navigate(["/projets"]);
  }

  trackByEcheanceId(
    index: number,
    echeance: FacturationEcheanceResponse,
  ): number {
    return echeance.id;
  }

  formatMoney(value: number | null | undefined): string {
    const amount = value ?? 0;

    return new Intl.NumberFormat("fr-FR", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 3,
    }).format(amount);
  }

  formatPercent(value: number | null | undefined): string {
    const amount = value ?? 0;

    return new Intl.NumberFormat("fr-FR", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  }

  getPaiementLabel(statutPaiement: string): string {
    switch (statutPaiement) {
      case "PAYE":
        return "Payé";
      case "PARTIELLEMENT_PAYE":
        return "Partiel";
      case "NON_PAYE":
      default:
        return "Non payé";
    }
  }

  getFactureLabel(echeance: FacturationEcheanceResponse): string {
    return echeance.facture ? "Facturé" : "Non facturé";
  }

  getRegleLabel(echeance: FacturationEcheanceResponse): string {
    return echeance.regle ? "Réglé" : "Non réglé";
  }

  private extractErrorMessage(error: any, fallback: string): string {
    if (error?.error?.message) {
      return error.error.message;
    }

    if (error?.message) {
      return error.message;
    }

    return fallback;
  }

  isProjectCurrencyTnd(): boolean {
    return (this.facturation?.deviseCode || "TND").toUpperCase() === "TND";
  }

  getDeviseCode(): string {
    return this.facturation?.deviseCode || "TND";
  }

  getPaiementClass(statutPaiement: string): string {
    switch (statutPaiement) {
      case "PAYE":
        return "status-success";
      case "PARTIELLEMENT_PAYE":
        return "status-warning";
      case "NON_PAYE":
      default:
        return "status-muted";
    }
  }
}
