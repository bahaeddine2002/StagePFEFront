import { Component } from "@angular/core";

type ActiveTab = "PLAN_CHARGE" | "COUTS_CALCULES";

interface MonthColumn {
  key: string;
  label: string;
}

interface CoutPrevisionnelResource {
  id: number;
  nomComplet: string;
  matricule: string;
  profil: string;
  tjm: number;
  jours: Record<string, number | null>;
}

@Component({
  selector: "app-cout-previsionnel",
  templateUrl: "./cout-previsionnel.component.html",
  styleUrls: ["./cout-previsionnel.component.css"],
})
export class CoutPrevisionnelComponent {
  activeTab: ActiveTab = "PLAN_CHARGE";

  selectedYear = 2025;
  selectedResource = "ALL";
  searchTerm = "";

  projectName = "Tunisair";
  projectPeriod = "Janvier 2025 à Août 2026";
  devise = "TND";

  months: MonthColumn[] = [
    { key: "jan", label: "Jan" },
    { key: "fev", label: "Fév" },
    { key: "mar", label: "Mar" },
    { key: "avr", label: "Avr" },
    { key: "mai", label: "Mai" },
    { key: "juin", label: "Juin" },
    { key: "juil", label: "Juil" },
    { key: "aout", label: "Août" },
    { key: "sep", label: "Sep" },
    { key: "oct", label: "Oct" },
    { key: "nov", label: "Nov" },
    { key: "dec", label: "Déc" },
  ];

  resources: CoutPrevisionnelResource[] = [
    {
      id: 1,
      nomComplet: "Ahmed Ben Salah",
      matricule: "EMP-001",
      profil: "Consultant",
      tjm: 800,
      jours: {
        jan: null,
        fev: 0.5,
        mar: 0.5,
        avr: null,
        mai: null,
        juin: null,
        juil: null,
        aout: null,
        sep: null,
        oct: null,
        nov: null,
        dec: null,
      },
    },
    {
      id: 2,
      nomComplet: "Syrine Trabelsi",
      matricule: "EMP-002",
      profil: "Développeuse",
      tjm: 650,
      jours: {
        jan: null,
        fev: 10,
        mar: 12,
        avr: 12,
        mai: 10,
        juin: null,
        juil: null,
        aout: null,
        sep: null,
        oct: null,
        nov: null,
        dec: null,
      },
    },
    {
      id: 3,
      nomComplet: "Youssef Gharbi",
      matricule: "EMP-003",
      profil: "Chef de projet",
      tjm: 900,
      jours: {
        jan: 2,
        fev: 4,
        mar: 4,
        avr: 5,
        mai: 5,
        juin: 3,
        juil: null,
        aout: null,
        sep: null,
        oct: null,
        nov: null,
        dec: null,
      },
    },
    {
      id: 4,
      nomComplet: "Amira Jebali",
      matricule: "EMP-004",
      profil: "Analyste QA",
      tjm: 500,
      jours: {
        jan: null,
        fev: null,
        mar: 5,
        avr: 8,
        mai: 8,
        juin: 8,
        juil: 4,
        aout: null,
        sep: null,
        oct: null,
        nov: null,
        dec: null,
      },
    },
    {
      id: 5,
      nomComplet: "Marwen Saidi",
      matricule: "EMP-005",
      profil: "Expert technique",
      tjm: 750,
      jours: {
        jan: null,
        fev: 5,
        mar: 7,
        avr: 7,
        mai: 7,
        juin: 6,
        juil: 5,
        aout: null,
        sep: null,
        oct: null,
        nov: null,
        dec: null,
      },
    },
  ];

  get filteredResources(): CoutPrevisionnelResource[] {
    return this.resources.filter((resource) => {
      const matchesResource =
        this.selectedResource === "ALL" ||
        resource.id === Number(this.selectedResource);

      const normalizedSearch = this.searchTerm.trim().toLowerCase();

      const matchesSearch =
        !normalizedSearch ||
        resource.nomComplet.toLowerCase().includes(normalizedSearch) ||
        resource.matricule.toLowerCase().includes(normalizedSearch) ||
        resource.profil.toLowerCase().includes(normalizedSearch);

      return matchesResource && matchesSearch;
    });
  }

  get totalResourcesPlanifiees(): number {
    return this.resources.length;
  }

  get totalJoursPrevus(): number {
    return this.resources.reduce(
      (total, resource) => total + this.getResourceTotalDays(resource),
      0,
    );
  }

  get totalCoutPrevisionnel(): number {
    return this.resources.reduce(
      (total, resource) => total + this.getResourceTotalCost(resource),
      0,
    );
  }

  get budgetConsommePercent(): number {
    const budgetProjet = 720000;
    return budgetProjet > 0
      ? (this.totalCoutPrevisionnel / budgetProjet) * 100
      : 0;
  }

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
  }

  recalculate(): void {
    // Static for now.
    // Later this will call backend recalculation or update local computed state.
  }

  save(): void {
    // Static for now.
    // Later this will send the plan de charge to the backend.
  }

  exportExcel(): void {
    // Static for now.
    // Later this will call export API.
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
      return;
    }

    const value = Number(rawValue);

    resource.jours[monthKey] = Number.isNaN(value) ? null : value;
  }

  getResourceTotalDays(resource: CoutPrevisionnelResource): number {
    return this.months.reduce((total, month) => {
      return total + (resource.jours[month.key] ?? 0);
    }, 0);
  }

  getResourceTotalCost(resource: CoutPrevisionnelResource): number {
    return this.getResourceTotalDays(resource) * resource.tjm;
  }

  getMonthTotalDays(monthKey: string): number {
    return this.filteredResources.reduce((total, resource) => {
      return total + (resource.jours[monthKey] ?? 0);
    }, 0);
  }

  getMonthTotalCost(monthKey: string): number {
    return this.filteredResources.reduce((total, resource) => {
      const days = resource.jours[monthKey] ?? 0;
      return total + days * resource.tjm;
    }, 0);
  }

  getMonthCost(resource: CoutPrevisionnelResource, monthKey: string): number {
    const days = resource.jours[monthKey] ?? 0;
    return days * resource.tjm;
  }

  hasMonthValue(resource: CoutPrevisionnelResource, monthKey: string): boolean {
    return (
      resource.jours[monthKey] !== null &&
      resource.jours[monthKey] !== undefined
    );
  }

  getCumulDaysRemaining(monthIndex: number): number {
    const total = this.totalJoursPrevus;

    const consumedUntilMonth = this.months
      .slice(0, monthIndex + 1)
      .reduce((sum, month) => sum + this.getMonthTotalDays(month.key), 0);

    return Math.max(total - consumedUntilMonth, 0);
  }

  getCumulCostRemaining(monthIndex: number): number {
    const total = this.totalCoutPrevisionnel;

    const consumedUntilMonth = this.months
      .slice(0, monthIndex + 1)
      .reduce((sum, month) => sum + this.getMonthTotalCost(month.key), 0);

    return Math.max(total - consumedUntilMonth, 0);
  }

  formatMoney(value: number): string {
    return new Intl.NumberFormat("fr-FR", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  }

  formatNumber(value: number): string {
    return new Intl.NumberFormat("fr-FR", {
      minimumFractionDigits: value % 1 === 0 ? 0 : 1,
      maximumFractionDigits: 1,
    }).format(value);
  }

  trackByResourceId(_: number, resource: CoutPrevisionnelResource): number {
    return resource.id;
  }

  trackByMonthKey(_: number, month: MonthColumn): string {
    return month.key;
  }
}
