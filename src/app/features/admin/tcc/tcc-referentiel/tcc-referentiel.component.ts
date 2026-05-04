import { Component, OnInit, inject } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { forkJoin } from "rxjs";

import { ToastService } from "src/app/shared/toast/toast.service.ts.service";

import { TccService } from "../../services/tcc.service";
import { UsersService } from "../../services/users.service";

import { TccAnneeConfigResponse, TccRessourceResponse } from "../../models/tcc";

import { UserResponse } from "../../models/users";

type TccTab = "RESSOURCES" | "ANNEES";

@Component({
  selector: "app-tcc-referentiel",
  templateUrl: "./tcc-referentiel.component.html",
  styleUrls: ["./tcc-referentiel.component.css"],
})
export class TccReferentielComponent implements OnInit {
  private fb = inject(FormBuilder);
  private tccService = inject(TccService);
  private usersService = inject(UsersService);
  private toastService = inject(ToastService);

  activeTab: TccTab = "RESSOURCES";

  tccRessources: TccRessourceResponse[] = [];
  anneeConfigs: TccAnneeConfigResponse[] = [];
  users: UserResponse[] = [];

  filteredTccRessources: TccRessourceResponse[] = [];
  filteredAnneeConfigs: TccAnneeConfigResponse[] = [];

  isLoading = false;
  isLoadingUsers = false;
  errorMessage = "";

  searchTerm = "";
  selectedYear: number | "ALL" = "ALL";

  isDeleting = false;
  deletingResourceId: number | null = null;
  deletingConfigId: number | null = null;

  // Paramétrage annuel drawer
  isAnneeDrawerOpen = false;
  isSavingAnneeConfig = false;
  editingAnneeConfigId: number | null = null;

  anneeConfigForm = this.fb.group({
    annee: [
      new Date().getFullYear(),
      [Validators.required, Validators.min(2000), Validators.max(2100)],
    ],
    coefFg: [0.085, [Validators.required, Validators.min(0.000001)]],
  });

  // TCC ressource drawer
  isTccRessourceDrawerOpen = false;
  isSavingTccRessource = false;
  editingTccRessourceId: number | null = null;

  tccRessourceForm = this.fb.group({
    employeId: [null as number | null, [Validators.required]],
    annee: [null as number | null, [Validators.required]],
    tccBase: [
      null as number | null,
      [Validators.required, Validators.min(0.000001)],
    ],
  });

  ngOnInit(): void {
    this.loadPageData();
  }

  loadPageData(): void {
    this.isLoading = true;
    this.isLoadingUsers = true;
    this.errorMessage = "";

    forkJoin({
      ressources: this.tccService.getTccRessources(),
      annees: this.tccService.getAnneeConfigs(),
      users: this.usersService.getUsers(),
    }).subscribe({
      next: ({ ressources, annees, users }) => {
        this.tccRessources = ressources;
        this.anneeConfigs = annees;
        this.users = users;

        this.applyFilters();

        this.isLoading = false;
        this.isLoadingUsers = false;
      },
      error: (error) => {
        console.error("Failed to load TCC data", error);
        this.errorMessage =
          "Une erreur est survenue lors du chargement du référentiel TCC.";
        this.isLoading = false;
        this.isLoadingUsers = false;
      },
    });
  }

  setActiveTab(tab: TccTab): void {
    this.activeTab = tab;
    this.searchTerm = "";
    this.selectedYear = "ALL";
    this.applyFilters();
  }

  applyFilters(): void {
    const normalizedSearch = this.searchTerm.trim().toLowerCase();

    this.filteredTccRessources = this.tccRessources.filter((item) => {
      const matchesSearch =
        !normalizedSearch ||
        item.employeNomComplet?.toLowerCase().includes(normalizedSearch) ||
        item.employeEmail?.toLowerCase().includes(normalizedSearch) ||
        item.employeMatricule?.toLowerCase().includes(normalizedSearch) ||
        item.employeId.toString().includes(normalizedSearch);

      const matchesYear =
        this.selectedYear === "ALL" || item.annee === this.selectedYear;

      return matchesSearch && matchesYear;
    });

    this.filteredAnneeConfigs = this.anneeConfigs.filter((item) => {
      const matchesSearch =
        !normalizedSearch || item.annee.toString().includes(normalizedSearch);

      const matchesYear =
        this.selectedYear === "ALL" || item.annee === this.selectedYear;

      return matchesSearch && matchesYear;
    });
  }

  onSearchChange(value: string): void {
    this.searchTerm = value;
    this.applyFilters();
  }

  onYearChange(value: number | "ALL"): void {
    this.selectedYear = value;
    this.applyFilters();
  }

  get availableYears(): number[] {
    const years = new Set<number>();

    this.anneeConfigs.forEach((config) => years.add(config.annee));
    this.tccRessources.forEach((resource) => years.add(resource.annee));

    return Array.from(years).sort((a, b) => b - a);
  }

  get totalRessourcesCouvertes(): number {
    const uniqueEmployees = new Set(
      this.tccRessources.map((item) => item.employeId),
    );

    return uniqueEmployees.size;
  }

  get totalAnneesConfigurees(): number {
    return this.anneeConfigs.length;
  }

  get tccManquants(): number {
    return 0;
  }

  get hasNoYearConfig(): boolean {
    return !this.isLoading && this.anneeConfigs.length === 0;
  }

  get hasNoTccResources(): boolean {
    return !this.isLoading && this.tccRessources.length === 0;
  }

  get hasFilteredNoTccResources(): boolean {
    return (
      !this.isLoading &&
      this.tccRessources.length > 0 &&
      this.filteredTccRessources.length === 0
    );
  }

  get hasFilteredNoYearConfigs(): boolean {
    return (
      !this.isLoading &&
      this.anneeConfigs.length > 0 &&
      this.filteredAnneeConfigs.length === 0
    );
  }

  formatMoney(value: number | null | undefined): string {
    if (value === null || value === undefined) {
      return "0,000";
    }

    return new Intl.NumberFormat("fr-FR", {
      minimumFractionDigits: 3,
      maximumFractionDigits: 3,
    }).format(value);
  }

  formatCoef(value: number | null | undefined): string {
    if (value === null || value === undefined) {
      return "0";
    }

    return new Intl.NumberFormat("fr-FR", {
      minimumFractionDigits: 3,
      maximumFractionDigits: 6,
    }).format(value);
  }

  formatPercentFromCoef(value: number | null | undefined): string {
    if (value === null || value === undefined) {
      return "0%";
    }

    return (
      new Intl.NumberFormat("fr-FR", {
        minimumFractionDigits: 1,
        maximumFractionDigits: 2,
      }).format(value * 100) + "%"
    );
  }

  getUserFullName(user: UserResponse): string {
    const firstName = (user as any).firstName || "";
    const lastName = (user as any).lastName || "";
    const fullName = `${firstName} ${lastName}`.trim();

    if (fullName) {
      return fullName;
    }

    return (user as any).email || `Utilisateur #${(user as any).id}`;
  }

  getUserMeta(user: UserResponse): string {
    const matricule = (user as any).matricule;
    const email = (user as any).email;

    if (matricule && email) {
      return `${matricule} · ${email}`;
    }

    return matricule || email || "";
  }

  getRessourceCountByYear(annee: number): number {
    return this.tccRessources.filter((resource) => resource.annee === annee)
      .length;
  }

  trackByTccRessourceId(index: number, item: TccRessourceResponse): number {
    return item.id;
  }

  trackByAnneeConfigId(index: number, item: TccAnneeConfigResponse): number {
    return item.id;
  }

  // =========================
  // PARAMÉTRAGE ANNUEL DRAWER
  // =========================

  onCreateAnneeConfig(): void {
    this.editingAnneeConfigId = null;

    this.anneeConfigForm.reset({
      annee: new Date().getFullYear(),
      coefFg: 0.085,
    });

    this.isAnneeDrawerOpen = true;
  }

  onEditAnneeConfig(item: TccAnneeConfigResponse): void {
    this.editingAnneeConfigId = item.id;

    this.anneeConfigForm.reset({
      annee: item.annee,
      coefFg: item.coefFg,
    });

    this.isAnneeDrawerOpen = true;
  }

  closeAnneeDrawer(): void {
    if (this.isSavingAnneeConfig) {
      return;
    }

    this.isAnneeDrawerOpen = false;
    this.editingAnneeConfigId = null;

    this.anneeConfigForm.reset({
      annee: new Date().getFullYear(),
      coefFg: 0.085,
    });
  }

  saveAnneeConfig(): void {
    if (this.anneeConfigForm.invalid) {
      this.anneeConfigForm.markAllAsTouched();
      return;
    }

    const rawValue = this.anneeConfigForm.getRawValue();

    const request = {
      annee: Number(rawValue.annee),
      coefFg: Number(rawValue.coefFg),
    };

    this.isSavingAnneeConfig = true;

    const request$ = this.editingAnneeConfigId
      ? this.tccService.updateAnneeConfig(this.editingAnneeConfigId, request)
      : this.tccService.createAnneeConfig(request);

    request$.subscribe({
      next: () => {
        this.toastService.success(
          this.editingAnneeConfigId
            ? "Le paramétrage annuel a été modifié avec succès."
            : "Le paramétrage annuel a été créé avec succès.",
        );

        this.isSavingAnneeConfig = false;
        this.closeAnneeDrawer();
        this.loadPageData();
      },
      error: (error) => {
        console.error("Save yearly config failed", error);

        this.toastService.error(
          error.error?.message ||
            "Une erreur est survenue lors de l’enregistrement du paramétrage annuel.",
        );

        this.isSavingAnneeConfig = false;
      },
    });
  }

  get anneeControl() {
    return this.anneeConfigForm.get("annee");
  }

  get coefFgControl() {
    return this.anneeConfigForm.get("coefFg");
  }

  get coefFgPercentPreview(): string {
    const value = Number(this.anneeConfigForm.get("coefFg")?.value || 0);

    return new Intl.NumberFormat("fr-FR", {
      minimumFractionDigits: 1,
      maximumFractionDigits: 2,
    }).format(value * 100);
  }

  // =========================
  // TCC RESSOURCE DRAWER
  // =========================

  onCreateTccRessource(): void {
    if (this.anneeConfigs.length === 0) {
      this.toastService.error(
        "Créez d'abord un paramétrage annuel avant d'ajouter un TCC ressource.",
      );
      return;
    }

    this.editingTccRessourceId = null;

    this.tccRessourceForm.reset({
      employeId: null,
      annee: this.anneeConfigs[0]?.annee || null,
      tccBase: null,
    });

    this.isTccRessourceDrawerOpen = true;
  }

  onEditTccRessource(item: TccRessourceResponse): void {
    this.editingTccRessourceId = item.id;

    this.tccRessourceForm.reset({
      employeId: item.employeId,
      annee: item.annee,
      tccBase: item.tccBase,
    });

    this.isTccRessourceDrawerOpen = true;
  }

  closeTccRessourceDrawer(): void {
    if (this.isSavingTccRessource) {
      return;
    }

    this.isTccRessourceDrawerOpen = false;
    this.editingTccRessourceId = null;

    this.tccRessourceForm.reset({
      employeId: null,
      annee: null,
      tccBase: null,
    });
  }

  saveTccRessource(): void {
    if (this.tccRessourceForm.invalid) {
      this.tccRessourceForm.markAllAsTouched();
      return;
    }

    const rawValue = this.tccRessourceForm.getRawValue();

    const request = {
      employeId: Number(rawValue.employeId),
      annee: Number(rawValue.annee),
      tccBase: Number(rawValue.tccBase),
    };

    this.isSavingTccRessource = true;

    const request$ = this.editingTccRessourceId
      ? this.tccService.updateTccRessource(this.editingTccRessourceId, request)
      : this.tccService.createTccRessource(request);

    request$.subscribe({
      next: () => {
        this.toastService.success(
          this.editingTccRessourceId
            ? "Le TCC ressource a été modifié avec succès."
            : "Le TCC ressource a été créé avec succès.",
        );

        this.isSavingTccRessource = false;
        this.closeTccRessourceDrawer();
        this.loadPageData();
      },
      error: (error) => {
        console.error("Save TCC resource failed", error);

        this.toastService.error(
          error.error?.message ||
            "Une erreur est survenue lors de l’enregistrement du TCC ressource.",
        );

        this.isSavingTccRessource = false;
      },
    });
  }

  get employeIdControl() {
    return this.tccRessourceForm.get("employeId");
  }

  get tccRessourceAnneeControl() {
    return this.tccRessourceForm.get("annee");
  }

  get tccBaseControl() {
    return this.tccRessourceForm.get("tccBase");
  }

  get selectedAnneeConfig(): TccAnneeConfigResponse | undefined {
    const selectedYear = Number(this.tccRessourceForm.get("annee")?.value);

    if (!selectedYear) {
      return undefined;
    }

    return this.anneeConfigs.find((config) => config.annee === selectedYear);
  }

  get selectedCoefFg(): number {
    return this.selectedAnneeConfig?.coefFg || 0;
  }

  get tccInclusFgPreview(): number {
    const tccBase = Number(this.tccRessourceForm.get("tccBase")?.value || 0);
    const coefFg = this.selectedCoefFg;

    if (!tccBase || !coefFg) {
      return 0;
    }

    return Number((tccBase * coefFg).toFixed(3));
  }

  // =========================
  // VIEW / DELETE
  // =========================

  onViewTccRessource(item: TccRessourceResponse): void {
    console.log("View TCC ressource", item);
  }

  onDeleteTccRessource(item: TccRessourceResponse): void {
    const confirmed = window.confirm(
      `Voulez-vous vraiment supprimer le TCC de "${
        item.employeNomComplet || "Utilisateur #" + item.employeId
      }" pour l'année ${item.annee} ?`,
    );

    if (!confirmed) {
      return;
    }

    this.isDeleting = true;
    this.deletingResourceId = item.id;

    this.tccService.deleteTccRessource(item.id).subscribe({
      next: () => {
        this.tccRessources = this.tccRessources.filter(
          (resource) => resource.id !== item.id,
        );

        this.applyFilters();

        this.toastService.success(
          "Le TCC ressource a été supprimé avec succès.",
        );
        this.isDeleting = false;
        this.deletingResourceId = null;
      },
      error: (error) => {
        console.error("Delete TCC resource failed", error);

        this.toastService.error(
          error.error?.message ||
            "Une erreur est survenue lors de la suppression du TCC ressource.",
        );

        this.isDeleting = false;
        this.deletingResourceId = null;
      },
    });
  }

  onViewAnneeConfig(item: TccAnneeConfigResponse): void {
    console.log("View yearly config", item);
  }

  onDeleteAnneeConfig(item: TccAnneeConfigResponse): void {
    const confirmed = window.confirm(
      `Voulez-vous vraiment supprimer le paramétrage TCC de l'année ${item.annee} ?`,
    );

    if (!confirmed) {
      return;
    }

    this.isDeleting = true;
    this.deletingConfigId = item.id;

    this.tccService.deleteAnneeConfig(item.id).subscribe({
      next: () => {
        this.anneeConfigs = this.anneeConfigs.filter(
          (config) => config.id !== item.id,
        );

        this.applyFilters();

        this.toastService.success(
          "Le paramétrage annuel a été supprimé avec succès.",
        );

        this.isDeleting = false;
        this.deletingConfigId = null;
      },
      error: (error) => {
        console.error("Delete yearly config failed", error);

        this.toastService.error(
          error.error?.message ||
            "Une erreur est survenue lors de la suppression du paramétrage annuel.",
        );

        this.isDeleting = false;
        this.deletingConfigId = null;
      },
    });
  }
}
