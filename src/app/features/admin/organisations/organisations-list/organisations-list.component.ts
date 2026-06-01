import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import {
  OrganisationRequest,
  OrganisationResponse,
  ORGANISATION_TYPE_OPTIONS,
  TypeOrganisation,
} from "../../models/organisation.model";
import { OrganisationService } from "../../services/organisation.service";
import { ToastService } from "src/app/shared/toast/toast.service.ts.service";

type OrganisationTypeFilter = "ALL" | TypeOrganisation;
type OrganisationStatusFilter = "ALL" | "ACTIVE" | "INACTIVE";

interface CountryOption {
  code: string;
  name: string;
}

@Component({
  selector: "app-organisations-list",
  templateUrl: "./organisations-list.component.html",
  styleUrls: ["./organisations-list.component.css"],
})
export class OrganisationsListComponent implements OnInit {
  isLoading = false;
  isSaving = false;
  isDeleting = false;

  errorMessage = "";
  searchTerm = "";

  selectedType: OrganisationTypeFilter = "ALL";
  selectedStatus: OrganisationStatusFilter = "ACTIVE";

  organisations: OrganisationResponse[] = [];

  isDrawerOpen = false;
  editingOrganisationId: number | null = null;
  viewMode = false;

  organisationTypeOptions = ORGANISATION_TYPE_OPTIONS;

  // For V1. Later we can replace this with i18n-iso-countries generated list.
  countries: CountryOption[] = [
    { code: "TN", name: "Tunisie" },
    { code: "FR", name: "France" },
    { code: "DE", name: "Allemagne" },
    { code: "IT", name: "Italie" },
    { code: "ES", name: "Espagne" },
    { code: "BE", name: "Belgique" },
    { code: "MA", name: "Maroc" },
    { code: "DZ", name: "Algérie" },
    { code: "EG", name: "Égypte" },
    { code: "US", name: "États-Unis" },
  ];

  pageSize = 8;
  pageIndex = 0;
  pageSizeOptions = [5, 8, 10, 20];

  organisationForm = new FormGroup({
    nom: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(200)],
    }),
    nomCourt: new FormControl("", {
      nonNullable: true,
      validators: [Validators.maxLength(80)],
    }),
    type: new FormControl<TypeOrganisation | null>(null, {
      validators: [Validators.required],
    }),
    paysCode: new FormControl<string | null>(null),
    adresse: new FormControl("", {
      nonNullable: true,
      validators: [Validators.maxLength(250)],
    }),
    contactPrincipal: new FormControl("", {
      nonNullable: true,
      validators: [Validators.maxLength(150)],
    }),
    email: new FormControl("", {
      nonNullable: true,
      validators: [Validators.email, Validators.maxLength(150)],
    }),
    telephone: new FormControl("", {
      nonNullable: true,
      validators: [Validators.maxLength(50)],
    }),
    notes: new FormControl("", {
      nonNullable: true,
      validators: [Validators.maxLength(500)],
    }),
    actif: new FormControl(true, {
      nonNullable: true,
    }),
  });

  constructor(
    private readonly organisationService: OrganisationService,
    private readonly toastService: ToastService,
  ) {}

  ngOnInit(): void {
    this.loadOrganisations();
  }

  loadOrganisations(): void {
    this.isLoading = true;
    this.errorMessage = "";

    this.organisationService.getAllOrganisations().subscribe({
      next: (data) => {
        this.organisations = data ?? [];
        this.pageIndex = 0;
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = "Impossible de charger les organisations.";
        this.isLoading = false;
      },
    });
  }

  get filteredOrganisations(): OrganisationResponse[] {
    const term = this.searchTerm.trim().toLowerCase();

    return this.organisations.filter((item) => {
      const matchesType =
        this.selectedType === "ALL" || item.type === this.selectedType;

      const matchesStatus =
        this.selectedStatus === "ALL" ||
        (this.selectedStatus === "ACTIVE" && item.actif) ||
        (this.selectedStatus === "INACTIVE" && !item.actif);

      const searchText = [
        item.nom,
        item.nomCourt,
        item.displayName,
        item.paysNom,
        item.email,
        item.telephone,
        item.contactPrincipal,
        item.type,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch = !term || searchText.includes(term);

      return matchesType && matchesStatus && matchesSearch;
    });
  }

  get pagedOrganisations(): OrganisationResponse[] {
    const start = this.pageIndex * this.pageSize;
    return this.filteredOrganisations.slice(start, start + this.pageSize);
  }

  get totalOrganisations(): number {
    return this.organisations.length;
  }

  get activeOrganisationsCount(): number {
    return this.organisations.filter((item) => item.actif).length;
  }

  get clientsCount(): number {
    return this.organisations.filter((item) => item.type === "CLIENT").length;
  }

  get partenairesCount(): number {
    return this.organisations.filter((item) => item.type === "PARTENAIRE")
      .length;
  }

  get bailleursCount(): number {
    return this.organisations.filter(
      (item) => item.type === "BAILLEUR_DE_FONDS",
    ).length;
  }

  get hasNoOrganisations(): boolean {
    return !this.isLoading && this.organisations.length === 0;
  }

  get hasFilteredNoOrganisations(): boolean {
    return (
      !this.isLoading &&
      this.organisations.length > 0 &&
      this.filteredOrganisations.length === 0
    );
  }

  onSearchChange(value: string): void {
    this.searchTerm = value;
    this.pageIndex = 0;
  }

  onTypeChange(value: OrganisationTypeFilter): void {
    this.selectedType = value;
    this.pageIndex = 0;
  }

  onStatusChange(value: OrganisationStatusFilter): void {
    this.selectedStatus = value;
    this.pageIndex = 0;
  }

  onPageChange(event: any): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  onCreateOrganisation(): void {
    this.editingOrganisationId = null;
    this.viewMode = false;
    this.organisationForm.reset({
      nom: "",
      nomCourt: "",
      type: "CLIENT",
      paysCode: "TN",
      adresse: "",
      contactPrincipal: "",
      email: "",
      telephone: "",
      notes: "",
      actif: true,
    });
    this.enableForm();
    this.isDrawerOpen = true;
  }

  onViewOrganisation(item: OrganisationResponse): void {
    this.editingOrganisationId = item.id;
    this.viewMode = true;
    this.patchForm(item);
    this.organisationForm.disable();
    this.isDrawerOpen = true;
  }

  onEditOrganisation(item: OrganisationResponse): void {
    this.editingOrganisationId = item.id;
    this.viewMode = false;
    this.patchForm(item);
    this.enableForm();
    this.isDrawerOpen = true;
  }

  closeDrawer(): void {
    if (this.isSaving) {
      return;
    }

    this.isDrawerOpen = false;
    this.editingOrganisationId = null;
    this.viewMode = false;
    this.enableForm();
  }

  saveOrganisation(): void {
    if (this.viewMode) {
      return;
    }

    if (this.organisationForm.invalid) {
      this.organisationForm.markAllAsTouched();
      return;
    }

    const payload = this.buildPayload();

    this.isSaving = true;

    const request$ = this.editingOrganisationId
      ? this.organisationService.updateOrganisation(
          this.editingOrganisationId,
          payload,
        )
      : this.organisationService.createOrganisation(payload);

    request$.subscribe({
      next: () => {
        this.isSaving = false;
        this.closeDrawer();
        this.loadOrganisations();

        this.toastService.success(
          this.editingOrganisationId
            ? "Organisation modifiée avec succès."
            : "Organisation créée avec succès.",
        );
      },
      error: (error) => {
        this.isSaving = false;
        this.toastService.error(
          error?.error?.message ||
            "Une erreur est survenue lors de l'enregistrement.",
        );
      },
    });
  }

  onDeleteOrganisation(item: OrganisationResponse): void {
    if (
      !confirm(`Voulez-vous désactiver l'organisation "${item.displayName}" ?`)
    ) {
      return;
    }

    this.isDeleting = true;

    this.organisationService.deleteOrganisation(item.id).subscribe({
      next: () => {
        this.isDeleting = false;
        this.loadOrganisations();
        this.toastService.success("Organisation désactivée avec succès.");
      },
      error: () => {
        this.isDeleting = false;
        this.toastService.error("Impossible de désactiver cette organisation.");
      },
    });
  }

  private patchForm(item: OrganisationResponse): void {
    this.organisationForm.patchValue({
      nom: item.nom ?? "",
      nomCourt: item.nomCourt ?? "",
      type: item.type,
      paysCode: item.paysCode ?? null,
      adresse: item.adresse ?? "",
      contactPrincipal: item.contactPrincipal ?? "",
      email: item.email ?? "",
      telephone: item.telephone ?? "",
      notes: item.notes ?? "",
      actif: item.actif,
    });
  }

  private buildPayload(): OrganisationRequest {
    const raw = this.organisationForm.getRawValue();

    const country = this.countries.find((item) => item.code === raw.paysCode);

    return {
      nom: raw.nom.trim(),
      nomCourt: this.cleanOptional(raw.nomCourt),
      type: raw.type as TypeOrganisation,
      paysCode: raw.paysCode,
      paysNom: country?.name ?? null,
      adresse: this.cleanOptional(raw.adresse),
      contactPrincipal: this.cleanOptional(raw.contactPrincipal),
      email: this.cleanOptional(raw.email),
      telephone: this.cleanOptional(raw.telephone),
      notes: this.cleanOptional(raw.notes),
      actif: raw.actif,
    };
  }

  private cleanOptional(value: string | null | undefined): string | null {
    if (!value) {
      return null;
    }

    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : null;
  }

  private enableForm(): void {
    this.organisationForm.enable();
  }

  getTypeLabel(type: TypeOrganisation): string {
    return (
      this.organisationTypeOptions.find((item) => item.value === type)?.label ||
      type
    );
  }

  getStatusLabel(item: OrganisationResponse): string {
    return item.actif ? "Actif" : "Inactif";
  }

  getDisplayName(item: OrganisationResponse): string {
    return item.displayName || item.nomCourt || item.nom || "-";
  }

  getCountryLabel(item: OrganisationResponse): string {
    return item.paysNom || item.paysCode || "-";
  }

  trackByOrganisationId(index: number, item: OrganisationResponse): number {
    return item.id;
  }

  get nomControl() {
    return this.organisationForm.get("nom");
  }

  get typeControl() {
    return this.organisationForm.get("type");
  }

  get emailControl() {
    return this.organisationForm.get("email");
  }
}
