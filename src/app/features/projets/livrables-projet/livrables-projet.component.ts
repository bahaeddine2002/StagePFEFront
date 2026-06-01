import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { finalize } from "rxjs";

import { ToastService } from "src/app/shared/toast/toast.service.ts.service";
import { LivrablesProjetService } from "../services/livrables-projet.service";
import {
  LivrableCreateRequest,
  LivrableProjetResponse,
  LivrableSuiviUpdateRequest,
} from "../models/livrable-projet.model";

@Component({
  selector: "app-livrables-projet",
  templateUrl: "./livrables-projet.component.html",
  styleUrls: ["./livrables-projet.component.css"],
})
export class LivrablesProjetComponent implements OnInit {
  projectId!: number;

  isLoading = false;
  isSaving = false;
  errorMessage: string | null = null;

  livrables: LivrableProjetResponse[] = [];

  isCreateDrawerOpen = false;

  /**
   * Used to disable only the row currently being updated.
   * This prevents double clicks and conflicting requests.
   */
  updatingLivrableIds = new Set<number>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private livrablesService: LivrablesProjetService,
    private toastService: ToastService,
  ) {}

  ngOnInit(): void {
    const idParam =
      this.route.snapshot.paramMap.get("projectId") ??
      this.route.snapshot.paramMap.get("id");

    if (!idParam || Number.isNaN(Number(idParam))) {
      this.errorMessage = "Identifiant du projet invalide.";
      return;
    }

    this.projectId = Number(idParam);
    this.loadLivrables();
  }

  loadLivrables(): void {
    this.isLoading = true;
    this.errorMessage = null;

    this.livrablesService
      .getLivrables(this.projectId)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (response) => {
          this.livrables = response || [];
        },
        error: (error) => {
          this.errorMessage = this.extractErrorMessage(
            error,
            "Impossible de charger les livrables du projet.",
          );

          this.toastService.error(this.errorMessage);
        },
      });
  }

  openCreateDrawer(): void {
    this.isCreateDrawerOpen = true;
  }

  closeCreateDrawer(): void {
    this.isCreateDrawerOpen = false;
  }

  onLivrableCreated(payload: LivrableCreateRequest): void {
    if (this.isSaving) {
      return;
    }

    this.isSaving = true;

    this.livrablesService
      .createLivrable(this.projectId, payload)
      .pipe(finalize(() => (this.isSaving = false)))
      .subscribe({
        next: () => {
          this.toastService.success("Livrable ajouté avec succès.");
          this.closeCreateDrawer();
          this.loadLivrables();
        },
        error: (error) => {
          const message = this.extractErrorMessage(
            error,
            "Erreur lors de l’ajout du livrable.",
          );

          this.toastService.error(message);
        },
      });
  }

  updateRealise(livrable: LivrableProjetResponse, value: boolean): void {
    if (this.isUpdating(livrable.id)) {
      return;
    }

    const payload: LivrableSuiviUpdateRequest = {
      realise: value,
      livre: value ? livrable.livre : false,
      dateLivraisonReelle: value ? livrable.dateLivraisonReelle : null,
    };

    this.updateSuivi(livrable, payload);
  }

  updateLivre(livrable: LivrableProjetResponse, value: boolean): void {
    if (this.isUpdating(livrable.id)) {
      return;
    }

    const payload: LivrableSuiviUpdateRequest = {
      realise: value ? true : livrable.realise,
      livre: value,
      dateLivraisonReelle: value ? livrable.dateLivraisonReelle : null,
    };

    this.updateSuivi(livrable, payload);
  }

  /**
   * Date réelle can only be changed if the livrable is delivered.
   */
  updateDateReelle(livrable: LivrableProjetResponse, value: string): void {
    if (this.isUpdating(livrable.id)) {
      return;
    }

    if (!livrable.livre) {
      return;
    }

    const payload: LivrableSuiviUpdateRequest = {
      realise: true,
      livre: true,
      dateLivraisonReelle: value || null,
    };

    this.updateSuivi(livrable, payload);
  }

  private updateSuivi(
    livrable: LivrableProjetResponse,
    payload: LivrableSuiviUpdateRequest,
  ): void {
    this.updatingLivrableIds.add(livrable.id);

    this.livrablesService
      .updateSuivi(this.projectId, livrable.id, payload)
      .pipe(
        finalize(() => {
          this.updatingLivrableIds.delete(livrable.id);
        }),
      )
      .subscribe({
        next: (updated) => {
          this.livrables = this.livrables.map((item) =>
            item.id === updated.id ? updated : item,
          );

          this.toastService.success("Suivi du livrable mis à jour.");
        },
        error: (error) => {
          const message = this.extractErrorMessage(
            error,
            "Erreur lors de la mise à jour du livrable.",
          );

          this.toastService.error(message);

          /**
           * Reload because the backend is the source of truth.
           * If the backend rejected/corrected something, we resync the UI.
           */
          this.loadLivrables();
        },
      });
  }

  deleteLivrable(livrable: LivrableProjetResponse): void {
    const confirmed = window.confirm(
      `Voulez-vous supprimer le livrable "${livrable.designation}" ?`,
    );

    if (!confirmed) {
      return;
    }

    this.livrablesService
      .deleteLivrable(this.projectId, livrable.id)
      .subscribe({
        next: () => {
          this.toastService.success("Livrable supprimé avec succès.");
          this.loadLivrables();
        },
        error: (error) => {
          const message = this.extractErrorMessage(
            error,
            "Erreur lors de la suppression du livrable.",
          );

          this.toastService.error(message);
        },
      });
  }

  isUpdating(livrableId: number): boolean {
    return this.updatingLivrableIds.has(livrableId);
  }

  get hasNoLivrables(): boolean {
    return !this.isLoading && !this.errorMessage && this.livrables.length === 0;
  }

  get totalLivrables(): number {
    return this.livrables.length;
  }

  get livrablesRealises(): number {
    return this.livrables.filter((livrable) => livrable.realise).length;
  }

  get livrablesLivres(): number {
    return this.livrables.filter((livrable) => livrable.livre).length;
  }

  get progressionGlobale(): number {
    if (this.totalLivrables === 0) {
      return 0;
    }

    return (this.livrablesLivres / this.totalLivrables) * 100;
  }

  formatDate(value?: string | null): string {
    if (!value) {
      return "—";
    }

    return new Intl.DateTimeFormat("fr-FR").format(new Date(value));
  }

  formatNumber(value?: number | null): string {
    return new Intl.NumberFormat("fr-FR", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 1,
    }).format(value ?? 0);
  }

  formatEcart(value?: number | null): string {
    if (value === null || value === undefined) {
      return "—";
    }

    if (value > 0) {
      return `+${value} j`;
    }

    if (value < 0) {
      return `${value} j`;
    }

    return "0 j";
  }

  getEcartClass(value?: number | null): string {
    if (value === null || value === undefined) {
      return "neutral";
    }

    /**
     * Positive class = good situation.
     * Negative ecart means delivered before planned date.
     */
    if (value < 0) {
      return "positive";
    }

    /**
     * Negative class = late delivery.
     * Positive ecart means delivered after planned date.
     */
    if (value > 0) {
      return "negative";
    }

    return "neutral";
  }

  trackByLivrableId(index: number, livrable: LivrableProjetResponse): number {
    return livrable.id;
  }

  goBack(): void {
    this.router.navigate(["/projets"]);
  }

  private extractErrorMessage(error: any, fallback: string): string {
    return (
      error?.error?.message || error?.error?.error || error?.message || fallback
    );
  }
}
