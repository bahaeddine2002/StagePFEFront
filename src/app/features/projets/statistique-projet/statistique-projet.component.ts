import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { finalize } from "rxjs";

import { RevueProjetService } from "../services/revue-projet.service";

import {
  ActiveStatistiqueTab,
  DraftRevueForm,
  RevueProjet,
  RevueProjetCreateRequest,
  RevueProjetPeriode,
  RevueProjetUpdateRequest,
} from "../models/revue-projet";

@Component({
  selector: "app-statistique-projet",
  templateUrl: "./statistique-projet.component.html",
  styleUrls: ["./statistique-projet.component.css"],
})
export class StatistiqueProjetComponent implements OnInit {
  projetId!: number;

  activeTab: ActiveStatistiqueTab = "monthly";

  periodes: RevueProjetPeriode[] = [];
  selectedPeriode = "";

  selectedRevue: RevueProjet | null = null;
  historyRevues: RevueProjet[] = [];

  isLoadingPeriodes = false;
  isLoadingRevue = false;
  isLoadingHistory = false;
  isCreating = false;
  isSaving = false;
  isDeleting = false;

  errorMessage = "";
  successMessage = "";

  private revueRequestCounter = 0;

  private readonly defaultDateFinPrevisionnelle = "2026-07-27";

  draftRevueForm: DraftRevueForm = {
    earnedValuePourcentage: null,
    dateFinPrevisionnelle: this.defaultDateFinPrevisionnelle,
    observationsFaitsMarquants: "",
  };

  constructor(
    private route: ActivatedRoute,
    private revueProjetService: RevueProjetService,
  ) {}

  ngOnInit(): void {
    this.projetId = Number(this.route.snapshot.paramMap.get("id"));

    if (!this.projetId) {
      this.errorMessage = "Identifiant du projet introuvable.";
      return;
    }

    this.loadInitialData();
  }

  get selectedPeriodeInfo(): RevueProjetPeriode | undefined {
    return this.periodes.find((periode) => {
      return periode.periode === this.selectedPeriode;
    });
  }

  get hasSelectedRevueForCurrentPeriode(): boolean {
    return (
      !!this.selectedRevue &&
      !!this.selectedPeriode &&
      this.selectedRevue.periode === this.selectedPeriode
    );
  }

  get canSave(): boolean {
    return (
      this.hasSelectedRevueForCurrentPeriode &&
      !this.isSaving &&
      !this.isLoadingRevue
    );
  }

  get canCreate(): boolean {
    return (
      !this.isCreating &&
      !this.isLoadingRevue &&
      !!this.selectedPeriode &&
      !!this.selectedPeriodeInfo &&
      !this.selectedPeriodeInfo.revueExiste &&
      this.draftRevueForm.earnedValuePourcentage !== null &&
      this.draftRevueForm.earnedValuePourcentage !== undefined &&
      !!this.draftRevueForm.dateFinPrevisionnelle
    );
  }

  loadInitialData(): void {
    this.loadPeriodes();
    this.loadHistory();
  }

  loadPeriodes(): void {
    this.isLoadingPeriodes = true;
    this.errorMessage = "";
    this.successMessage = "";

    this.selectedPeriode = "";
    this.clearSelectedRevue();
    this.resetDraftRevueForm();

    this.revueProjetService
      .getPeriodesDisponibles(this.projetId)
      .pipe(
        finalize(() => {
          this.isLoadingPeriodes = false;
        }),
      )
      .subscribe({
        next: (periodes) => {
          this.periodes = periodes || [];

          if (this.periodes.length === 0) {
            this.selectedPeriode = "";
            this.clearSelectedRevue();
            this.errorMessage =
              "Aucune période de revue disponible pour ce projet.";
            return;
          }

          // Important:
          // We do NOT auto-select the first month.
          // This avoids showing data for a month that is not created.
          this.selectedPeriode = "";
          this.clearSelectedRevue();
          this.resetDraftRevueForm();
        },
        error: () => {
          this.periodes = [];
          this.selectedPeriode = "";
          this.clearSelectedRevue();
          this.errorMessage =
            "Impossible de charger les périodes de revue du projet.";
        },
      });
  }

  loadHistory(): void {
    this.isLoadingHistory = true;

    this.revueProjetService
      .getRevuesByProjet(this.projetId)
      .pipe(
        finalize(() => {
          this.isLoadingHistory = false;
        }),
      )
      .subscribe({
        next: (revues) => {
          this.historyRevues = [...(revues || [])].sort((a, b) => {
            return b.periode.localeCompare(a.periode);
          });
        },
        error: () => {
          this.errorMessage = "Impossible de charger l’historique des revues.";
        },
      });
  }

  loadSelectedPeriode(): void {
    this.successMessage = "";
    this.errorMessage = "";

    this.clearSelectedRevue();

    const periodeInfo = this.selectedPeriodeInfo;

    if (!periodeInfo) {
      this.resetDraftRevueForm();
      this.isLoadingRevue = false;
      return;
    }

    if (!periodeInfo.revueExiste) {
      this.resetDraftRevueForm();
      this.isLoadingRevue = false;
      return;
    }

    this.loadRevueByPeriode(periodeInfo.periode);
  }

  loadRevueByPeriode(periode: string): void {
    const requestId = ++this.revueRequestCounter;

    this.isLoadingRevue = true;
    this.errorMessage = "";
    this.clearSelectedRevue();

    this.revueProjetService
      .getRevueByPeriode(this.projetId, periode)
      .pipe(
        finalize(() => {
          if (requestId === this.revueRequestCounter) {
            this.isLoadingRevue = false;
          }
        }),
      )
      .subscribe({
        next: (revue) => {
          if (requestId !== this.revueRequestCounter) {
            return;
          }

          if (this.selectedPeriode !== periode) {
            return;
          }

          if (!revue || revue.periode !== this.selectedPeriode) {
            this.clearSelectedRevue();
            return;
          }

          this.selectedRevue = revue;
        },
        error: () => {
          if (requestId !== this.revueRequestCounter) {
            return;
          }

          this.clearSelectedRevue();
          this.errorMessage =
            "Impossible de charger la revue de la période sélectionnée.";
        },
      });
  }

  setTab(tab: ActiveStatistiqueTab): void {
    this.activeTab = tab;

    if (tab === "history") {
      this.loadHistory();
    }
  }

  onPeriodeChange(value: string): void {
    this.selectedPeriode = value;

    this.clearSelectedRevue();
    this.resetDraftRevueForm();
    this.errorMessage = "";
    this.successMessage = "";

    if (!value) {
      return;
    }

    this.loadSelectedPeriode();
  }

  resetDraftRevueForm(): void {
    this.draftRevueForm = {
      earnedValuePourcentage: null,
      dateFinPrevisionnelle: this.defaultDateFinPrevisionnelle,
      observationsFaitsMarquants: "",
    };
  }

  createRevue(): void {
    const periodeInfo = this.selectedPeriodeInfo;

    if (!periodeInfo) {
      this.errorMessage = "Veuillez sélectionner une période.";
      return;
    }

    if (periodeInfo.revueExiste) {
      this.errorMessage = "Une revue existe déjà pour cette période.";
      return;
    }

    if (
      this.draftRevueForm.earnedValuePourcentage === null ||
      this.draftRevueForm.earnedValuePourcentage === undefined
    ) {
      this.errorMessage = "Veuillez saisir l’Earned Value.";
      return;
    }

    if (!this.draftRevueForm.dateFinPrevisionnelle) {
      this.errorMessage = "Veuillez saisir la date de fin prévisionnelle.";
      return;
    }

    const payload: RevueProjetCreateRequest = {
      periode: periodeInfo.periode,
      earnedValuePourcentage: this.draftRevueForm.earnedValuePourcentage,
      dateFinPrevisionnelle: this.draftRevueForm.dateFinPrevisionnelle,
      observationsFaitsMarquants:
        this.draftRevueForm.observationsFaitsMarquants || "",
    };

    this.isCreating = true;
    this.errorMessage = "";
    this.successMessage = "";

    this.revueProjetService
      .createRevue(this.projetId, payload)
      .pipe(
        finalize(() => {
          this.isCreating = false;
        }),
      )
      .subscribe({
        next: (created) => {
          this.selectedPeriode = created.periode;
          this.selectedRevue = created;

          this.updatePeriodeAfterCreate(created);
          this.loadHistory();

          this.successMessage = "Revue créée avec succès.";
        },
        error: () => {
          this.errorMessage =
            "Impossible de créer la revue. Vérifiez que la période n’existe pas déjà.";
        },
      });
  }

  saveRevue(): void {
    if (!this.hasSelectedRevueForCurrentPeriode || !this.selectedRevue) {
      return;
    }

    const payload: RevueProjetUpdateRequest = {
      earnedValuePourcentage: this.selectedRevue.earnedValuePourcentage,
      dateFinPrevisionnelle: this.selectedRevue.dateFinPrevisionnelle,
      observationsFaitsMarquants:
        this.selectedRevue.observationsFaitsMarquants || "",
    };

    this.isSaving = true;
    this.errorMessage = "";
    this.successMessage = "";

    this.revueProjetService
      .updateRevue(this.projetId, this.selectedRevue.id, payload)
      .pipe(
        finalize(() => {
          this.isSaving = false;
        }),
      )
      .subscribe({
        next: (updated) => {
          if (updated.periode !== this.selectedPeriode) {
            return;
          }

          this.selectedRevue = updated;
          this.loadHistory();

          this.successMessage = "Revue enregistrée avec succès.";
        },
        error: () => {
          this.errorMessage = "Impossible d’enregistrer la revue sélectionnée.";
        },
      });
  }

  deleteSelectedRevue(): void {
    if (!this.hasSelectedRevueForCurrentPeriode || !this.selectedRevue) {
      return;
    }

    const confirmed = confirm(
      "Voulez-vous vraiment supprimer cette revue projet ?",
    );

    if (!confirmed) {
      return;
    }

    const revueId = this.selectedRevue.id;

    this.isDeleting = true;
    this.errorMessage = "";
    this.successMessage = "";

    this.revueProjetService
      .deleteRevue(this.projetId, revueId)
      .pipe(
        finalize(() => {
          this.isDeleting = false;
        }),
      )
      .subscribe({
        next: () => {
          this.successMessage = "Revue supprimée avec succès.";

          this.clearSelectedRevue();

          const periode = this.selectedPeriodeInfo;

          if (periode) {
            periode.revueExiste = false;
            periode.revueId = null;
          }

          this.resetDraftRevueForm();
          this.loadHistory();
        },
        error: () => {
          this.errorMessage = "Impossible de supprimer cette revue.";
        },
      });
  }

  viewRevue(revue: RevueProjet): void {
    this.activeTab = "monthly";
    this.selectedPeriode = revue.periode;

    this.clearSelectedRevue();

    const periode = this.periodes.find((item) => {
      return item.periode === revue.periode;
    });

    if (periode) {
      periode.revueExiste = true;
      periode.revueId = revue.id;
    }

    this.loadRevueByPeriode(revue.periode);
  }

  onBack(): void {
    window.history.back();
  }

  trackByPeriode(_: number, periode: RevueProjetPeriode): string {
    return periode.periode;
  }

  trackByRevue(_: number, revue: RevueProjet): number {
    return revue.id;
  }

  private clearSelectedRevue(): void {
    this.selectedRevue = null;
  }

  private updatePeriodeAfterCreate(created: RevueProjet): void {
    const periode = this.periodes.find((item) => {
      return item.periode === created.periode;
    });

    if (periode) {
      periode.revueExiste = true;
      periode.revueId = created.id;
      return;
    }

    this.periodes.push({
      periode: created.periode,
      monthKey: created.periode.substring(0, 7),
      label: this.formatMonthLabel(created.periode),
      revueExiste: true,
      revueId: created.id,
    });
  }

  formatMoney(value: number | null | undefined): string {
    if (value === null || value === undefined) {
      return "Non disponible";
    }

    return new Intl.NumberFormat("fr-FR", {
      minimumFractionDigits: 3,
      maximumFractionDigits: 3,
    }).format(value);
  }

  formatPercent(value: number | null | undefined): string {
    if (value === null || value === undefined) {
      return "Non disponible";
    }

    return `${new Intl.NumberFormat("fr-FR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value)}%`;
  }

  formatJh(value: number | null | undefined): string {
    if (value === null || value === undefined) {
      return "Non disponible";
    }

    return `${new Intl.NumberFormat("fr-FR", {
      minimumFractionDigits: 3,
      maximumFractionDigits: 3,
    }).format(value)} J/H`;
  }

  formatDate(value: string | null | undefined): string {
    if (!value) {
      return "Non disponible";
    }

    const parts = value.split("-");

    if (parts.length !== 3) {
      return value;
    }

    const year = Number(parts[0]);
    const month = Number(parts[1]);
    const day = Number(parts[2]);

    const date = new Date(year, month - 1, day);

    return new Intl.DateTimeFormat("fr-FR").format(date);
  }

  formatMonthLabel(value: string): string {
    const parts = value.split("-");

    if (parts.length < 2) {
      return value;
    }

    const year = Number(parts[0]);
    const month = Number(parts[1]);

    const date = new Date(year, month - 1, 1);

    return new Intl.DateTimeFormat("fr-FR", {
      month: "short",
      year: "numeric",
    }).format(date);
  }

  isNegative(value: number | null | undefined): boolean {
    return value !== null && value !== undefined && value < 0;
  }
}
