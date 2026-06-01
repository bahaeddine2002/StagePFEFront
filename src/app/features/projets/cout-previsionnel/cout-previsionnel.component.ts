import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { finalize } from "rxjs";

import { CoutPrevisionnelService } from "../services/cout-previsionnel.service";
import {
  CoutPrevisionnelMonth,
  CoutPrevisionnelResource,
  CoutPrevisionnelResponse,
  CoutPrevisionnelSaveRequest,
} from "../models/cout-previsionnel.model";
import { ToastService } from "src/app/shared/toast/toast.service.ts.service";

type ActiveTab = "PLAN_CHARGE" | "COUTS_CALCULES";

@Component({
  selector: "app-cout-previsionnel",
  templateUrl: "./cout-previsionnel.component.html",
  styleUrls: ["./cout-previsionnel.component.css"],
})
export class CoutPrevisionnelComponent implements OnInit {
  activeTab: ActiveTab = "PLAN_CHARGE";

  projectId!: number;

  isLoading = false;
  isSaving = false;
  isDirty = false;
  errorMessage: string | null = null;

  selectedYear: number | null = null;
  selectedResource = "ALL";
  searchTerm = "";

  projectName = "—";
  projectPeriod = "—";
  devise = "TND";

  allMonths: CoutPrevisionnelMonth[] = [];
  resources: CoutPrevisionnelResource[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private coutPrevisionnelService: CoutPrevisionnelService,
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
    this.loadCoutPrevisionnel();
  }

  loadCoutPrevisionnel(): void {
    this.isLoading = true;
    this.errorMessage = null;

    this.coutPrevisionnelService
      .getCoutPrevisionnel(this.projectId)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (response) => {
          this.applyResponse(response);
          this.isDirty = false;
        },
        error: (error) => {
          this.errorMessage = this.extractErrorMessage(
            error,
            "Impossible de charger le coût prévisionnel.",
          );
          this.toastService.error(this.errorMessage);
        },
      });
  }

  private applyResponse(response: CoutPrevisionnelResponse): void {
    this.projectName = response.nomProjet || "—";
    this.devise = response.devise || "TND";
    this.projectPeriod = this.buildProjectPeriod(
      response.dateDebut,
      response.dateFin,
    );

    this.allMonths = response.months || [];
    this.resources = response.resources || [];

    if (!this.selectedYear && this.availableYears.length > 0) {
      this.selectedYear = this.availableYears[0];
    }

    if (
      this.selectedYear &&
      this.availableYears.length > 0 &&
      !this.availableYears.includes(this.selectedYear)
    ) {
      this.selectedYear = this.availableYears[0];
    }
  }

  // =========================================================
  // Months / filters
  // =========================================================

  get months(): CoutPrevisionnelMonth[] {
    if (!this.selectedYear) {
      return this.allMonths;
    }

    return this.allMonths.filter((month) => {
      return this.getYearFromMonthKey(month.key) === this.selectedYear;
    });
  }

  get availableYears(): number[] {
    const years = this.allMonths
      .map((month) => this.getYearFromMonthKey(month.key))
      .filter((year): year is number => year !== null);

    return Array.from(new Set(years)).sort((a, b) => a - b);
  }

  get filteredResources(): CoutPrevisionnelResource[] {
    const normalizedSearch = this.searchTerm.trim().toLowerCase();

    return this.resources.filter((resource) => {
      const matchesResource =
        this.selectedResource === "ALL" ||
        resource.ligneDevisInterneId === Number(this.selectedResource);

      const nom = (resource.nomComplet || "").toLowerCase();
      const matricule = (resource.matricule || "").toLowerCase();
      const designation = (resource.designation || "").toLowerCase();

      const matchesSearch =
        !normalizedSearch ||
        nom.includes(normalizedSearch) ||
        matricule.includes(normalizedSearch) ||
        designation.includes(normalizedSearch);

      return matchesResource && matchesSearch;
    });
  }

  get hasNoResources(): boolean {
    return !this.isLoading && !this.errorMessage && this.resources.length === 0;
  }

  // =========================================================
  // Global stats cards = all project years
  // =========================================================

  get totalResourcesPlanifiees(): number {
    return this.resources.length;
  }

  get totalJoursPrevusGlobal(): number {
    return this.resources.reduce((total, resource) => {
      return (
        total + this.getResourceTotalDaysForMonths(resource, this.allMonths)
      );
    }, 0);
  }

  get totalCoutPrevisionnelGlobal(): number {
    return this.resources.reduce((total, resource) => {
      return (
        total + this.getResourceTotalCostForMonths(resource, this.allMonths)
      );
    }, 0);
  }

  get budgetConsommePercent(): number {
    // TODO: Replace this later with budgetProjet from backend/project detail.
    const budgetProjet = 720000;

    if (budgetProjet <= 0) {
      return 0;
    }

    return (this.totalCoutPrevisionnelGlobal / budgetProjet) * 100;
  }

  // =========================================================
  // Table totals = selected year + current filters
  // =========================================================

  get totalJoursPrevusAnnee(): number {
    return this.filteredResources.reduce((total, resource) => {
      return total + this.getResourceTotalDaysForMonths(resource, this.months);
    }, 0);
  }

  get totalCoutPrevisionnelAnnee(): number {
    return this.filteredResources.reduce((total, resource) => {
      return total + this.getResourceTotalCostForMonths(resource, this.months);
    }, 0);
  }

  get selectedYearLabel(): string {
    return this.selectedYear ? this.selectedYear.toString() : "Toutes années";
  }

  // =========================================================
  // UI actions
  // =========================================================

  setActiveTab(tab: ActiveTab): void {
    this.activeTab = tab;
  }

  onYearChange(year: number): void {
    this.selectedYear = year;
  }

  onResourceChange(resourceId: string): void {
    this.selectedResource = resourceId;
  }

  onSearchChange(value: string): void {
    this.searchTerm = value;
  }

  resetFilters(): void {
    this.selectedResource = "ALL";
    this.searchTerm = "";

    if (this.availableYears.length > 0) {
      this.selectedYear = this.availableYears[0];
    }
  }

  updateDays(
    resource: CoutPrevisionnelResource,
    monthKey: string,
    event: Event,
  ): void {
    const input = event.target as HTMLInputElement;
    const rawValue = input.value;

    if (rawValue === "") {
      resource.jours[monthKey] = null;
      this.isDirty = true;
      return;
    }

    const value = Number(rawValue);

    if (Number.isNaN(value)) {
      resource.jours[monthKey] = null;
      this.isDirty = true;
      return;
    }

    if (value < 0) {
      this.toastService.error("Le nombre de jours ne peut pas être négatif.");
      input.value = resource.jours[monthKey]?.toString() ?? "";
      return;
    }

    resource.jours[monthKey] = value;
    this.isDirty = true;
  }

  save(): void {
    if (!this.isDirty || this.isSaving) {
      return;
    }

    const payload: CoutPrevisionnelSaveRequest = {
      resources: this.resources.map((resource) => ({
        ligneDevisInterneId: resource.ligneDevisInterneId,
        jours: resource.jours,
      })),
    };

    this.isSaving = true;

    this.coutPrevisionnelService
      .saveCoutPrevisionnel(this.projectId, payload)
      .pipe(finalize(() => (this.isSaving = false)))
      .subscribe({
        next: () => {
          this.toastService.success(
            "Coût prévisionnel enregistré avec succès.",
          );
          this.isDirty = false;
          this.loadCoutPrevisionnel();
        },
        error: (error) => {
          const message = this.extractErrorMessage(
            error,
            "Erreur lors de l’enregistrement du coût prévisionnel.",
          );
          this.toastService.error(message);
        },
      });
  }

  recalculate(): void {
    this.toastService.success("Les coûts sont recalculés automatiquement.");
  }

  exportExcel(): void {
    this.toastService.error("L’export Excel n’est pas encore disponible.");
  }

  goBack(): void {
    this.router.navigate(["/projets"]);
  }

  goToDevisInterne(): void {
    this.router.navigate(["/projets", this.projectId, "di"]);
  }

  // =========================================================
  // Calculations
  // =========================================================

  getResourceTotalDays(resource: CoutPrevisionnelResource): number {
    return this.getResourceTotalDaysForMonths(resource, this.months);
  }

  getResourceTotalCost(resource: CoutPrevisionnelResource): number {
    return this.getResourceTotalCostForMonths(resource, this.months);
  }

  private getResourceTotalDaysForMonths(
    resource: CoutPrevisionnelResource,
    months: CoutPrevisionnelMonth[],
  ): number {
    return months.reduce((total, month) => {
      return total + (resource.jours[month.key] ?? 0);
    }, 0);
  }

  private getResourceTotalCostForMonths(
    resource: CoutPrevisionnelResource,
    months: CoutPrevisionnelMonth[],
  ): number {
    return (
      this.getResourceTotalDaysForMonths(resource, months) * (resource.tjm ?? 0)
    );
  }

  getMonthTotalDays(monthKey: string): number {
    return this.filteredResources.reduce((total, resource) => {
      return total + (resource.jours[monthKey] ?? 0);
    }, 0);
  }

  getMonthTotalCost(monthKey: string): number {
    return this.filteredResources.reduce((total, resource) => {
      const days = resource.jours[monthKey] ?? 0;
      return total + days * (resource.tjm ?? 0);
    }, 0);
  }

  getMonthCost(resource: CoutPrevisionnelResource, monthKey: string): number {
    const days = resource.jours[monthKey] ?? 0;
    return days * (resource.tjm ?? 0);
  }

  hasMonthValue(resource: CoutPrevisionnelResource, monthKey: string): boolean {
    return (
      resource.jours[monthKey] !== null &&
      resource.jours[monthKey] !== undefined
    );
  }

  getCumulDaysRemaining(monthIndex: number): number {
    const total = this.totalJoursPrevusAnnee;

    const consumedUntilMonth = this.months
      .slice(0, monthIndex + 1)
      .reduce((sum, month) => sum + this.getMonthTotalDays(month.key), 0);

    return Math.max(total - consumedUntilMonth, 0);
  }

  getCumulCostRemaining(monthIndex: number): number {
    const total = this.totalCoutPrevisionnelAnnee;

    const consumedUntilMonth = this.months
      .slice(0, monthIndex + 1)
      .reduce((sum, month) => sum + this.getMonthTotalCost(month.key), 0);

    return Math.max(total - consumedUntilMonth, 0);
  }

  // =========================================================
  // Formatting
  // =========================================================

  formatMoney(value: number): string {
    return new Intl.NumberFormat("fr-FR", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value || 0);
  }

  formatNumber(value: number): string {
    const safeValue = value || 0;

    return new Intl.NumberFormat("fr-FR", {
      minimumFractionDigits: safeValue % 1 === 0 ? 0 : 1,
      maximumFractionDigits: 1,
    }).format(safeValue);
  }

  trackByResourceId(_: number, resource: CoutPrevisionnelResource): number {
    return resource.ligneDevisInterneId;
  }

  trackByMonthKey(_: number, month: CoutPrevisionnelMonth): string {
    return month.key;
  }

  private getYearFromMonthKey(monthKey: string): number | null {
    const year = Number(monthKey?.split("-")[0]);
    return Number.isNaN(year) ? null : year;
  }

  private buildProjectPeriod(dateDebut: string, dateFin: string): string {
    if (!dateDebut || !dateFin) {
      return "—";
    }

    return `${this.formatDate(dateDebut)} à ${this.formatDate(dateFin)}`;
  }

  private formatDate(date: string): string {
    return new Intl.DateTimeFormat("fr-FR", {
      month: "long",
      year: "numeric",
    }).format(new Date(date));
  }

  private extractErrorMessage(error: any, fallback: string): string {
    if (error?.error?.message) {
      return error.error.message;
    }

    if (typeof error?.error === "string") {
      return error.error;
    }

    return fallback;
  }
}
