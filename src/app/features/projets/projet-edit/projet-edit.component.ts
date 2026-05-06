import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { forkJoin, finalize } from "rxjs";

import { ProjetCreateRequest, ProjetResponse } from "../models/Projets";
import { ProjetService } from "../services/projet.service";
import { UsersService } from "../../admin/services/users.service";
import { UserResponse } from "../../admin/models/users";

// Rename this import based on your real service name
import { ReferentielServiceTs } from "../services/referentiel.service.ts.service";

@Component({
  selector: "app-projet-edit",
  templateUrl: "./projet-edit.component.html",
  styleUrls: [
    "../fiche-identification/fiche-identification.component.css",
    "./projet-edit.component.css",
  ],
})
export class ProjetEditComponent implements OnInit {
  projetId!: number;
  projet?: ProjetResponse;

  form!: FormGroup;

  loading = false;
  saving = false;
  errorMessage = "";

  businessModels: any[] = [];
  typesEngagement: any[] = [];
  devises: any[] = [];
  statutsProjet: any[] = [];
  users: UserResponse[] = [];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private projetService: ProjetService,
    private refService: ReferentielServiceTs,
    private usersService: UsersService,
  ) {}

  ngOnInit(): void {
    this.projetId = Number(this.route.snapshot.paramMap.get("id"));

    if (!this.projetId) {
      this.errorMessage = "Identifiant du projet invalide.";
      return;
    }

    this.initForm();
    this.loadData();
  }

  private initForm(): void {
    this.form = this.fb.group({
      codeProjet: ["", Validators.required],
      contractId: [null],

      client: ["", Validators.required],
      partenaire: [null],

      nomProjet: ["", Validators.required],
      descriptionProjet: [null],
      bailleurDeFonds: [null],

      businessModelId: [null, Validators.required],
      typeEngagementId: [null, Validators.required],
      deviseProjetId: [null, Validators.required],
      statutProjetId: [null, Validators.required],
      projectManagerId: [null, Validators.required],

      dateDemarrage: [null, Validators.required],
      dateDemarrageEffective: [null],
      dateFinInitialePrevue: [null, Validators.required],

      tauxChangeVersTnd: [1, [Validators.required, Validators.min(0.000001)]],

      budgetInitialTO: [0, [Validators.min(0)]],
      budgetLicencesSousTraitance: [0, [Validators.min(0)]],

      avenant: [false],
      montantAvenant: [0, [Validators.min(0)]],
      workloadAvenantsJH: [0, [Validators.min(0)]],

      pprTnd: [0, [Validators.min(0)]],
      pppTnd: [0, [Validators.min(0)]],

      workloadInitialJH: [0, [Validators.min(0)]],
      workloadGarantieJH: [0, [Validators.min(0)]],
    });
  }

  private loadData(): void {
    this.loading = true;
    this.errorMessage = "";

    forkJoin({
      projet: this.projetService.getProjetById(this.projetId),

      // Rename methods based on your real create component service methods
      businessModels: this.refService.getBusinessModels(),
      typesEngagement: this.refService.getTypesEngagement(),
      devises: this.refService.getDevises(),
      statutsProjet: this.refService.getStatutsProjet(),

      users: this.usersService.getUsers(),
    })
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (result) => {
          this.projet = result.projet;

          this.businessModels = result.businessModels || [];
          this.typesEngagement = result.typesEngagement || [];
          this.devises = result.devises || [];
          this.statutsProjet = result.statutsProjet || [];
          this.users = result.users || [];

          this.patchForm(result.projet);
        },
        error: (error) => {
          console.error("Erreur chargement modification projet", error);
          this.errorMessage =
            "Impossible de charger les données nécessaires à la modification.";
        },
      });
  }

  private patchForm(projet: ProjetResponse): void {
    this.form.patchValue({
      codeProjet: projet.codeProjet,
      contractId: projet.contractId,

      client: projet.client,
      partenaire: projet.partenaire,

      nomProjet: projet.nomProjet,
      descriptionProjet: projet.descriptionProjet,
      bailleurDeFonds: projet.bailleurDeFonds,

      businessModelId: projet.businessModelId,
      typeEngagementId: projet.typeEngagementId,
      deviseProjetId: projet.deviseProjetId,
      statutProjetId: projet.statutProjetId,
      projectManagerId: projet.projectManagerId,

      dateDemarrage: projet.dateDemarrage,
      dateDemarrageEffective: projet.dateDemarrageEffective,
      dateFinInitialePrevue: projet.dateFinInitialePrevue,

      tauxChangeVersTnd: projet.tauxChangeVersTnd ?? 1,

      budgetInitialTO: projet.budgetInitialTO ?? 0,
      budgetLicencesSousTraitance: projet.budgetLicencesSousTraitance ?? 0,

      workloadInitialJH: projet.workloadInitialJH ?? 0,
      workloadGarantieJH: projet.workloadGarantieJH ?? 0,
    });
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload = this.buildPayload();

    this.saving = true;
    this.errorMessage = "";

    this.projetService
      .updateProjet(this.projetId, payload)
      .pipe(finalize(() => (this.saving = false)))
      .subscribe({
        next: () => {
          this.router.navigate([
            "/projets",
            this.projetId,
            "fiche-identification",
          ]);
        },
        error: (error) => {
          console.error("Erreur modification projet", error);
          this.errorMessage = "Impossible d’enregistrer les modifications.";
        },
      });
  }

  private buildPayload(): ProjetCreateRequest {
    const value = this.form.getRawValue();

    return {
      codeProjet: value.codeProjet,
      contractId: value.contractId || null,

      client: value.client,
      partenaire: value.partenaire || null,

      nomProjet: value.nomProjet,
      descriptionProjet: value.descriptionProjet || null,
      bailleurDeFonds: value.bailleurDeFonds || null,

      businessModelId: Number(value.businessModelId),
      typeEngagementId: Number(value.typeEngagementId),
      deviseProjetId: Number(value.deviseProjetId),
      statutProjetId: Number(value.statutProjetId),
      projectManagerId: Number(value.projectManagerId),

      dateDemarrage: value.dateDemarrage,
      dateDemarrageEffective: value.dateDemarrageEffective || null,
      dateFinInitialePrevue: value.dateFinInitialePrevue,

      tauxChangeVersTnd: Number(value.tauxChangeVersTnd || 1),

      budgetInitialTO: Number(value.budgetInitialTO || 0),
      budgetLicencesSousTraitance: Number(
        value.budgetLicencesSousTraitance || 0,
      ),

      avenant: Boolean(value.avenant),
      montantAvenant: Number(value.montantAvenant || 0),
      workloadAvenantsJH: Number(value.workloadAvenantsJH || 0),

      pprTnd: Number(value.pprTnd || 0),
      pppTnd: Number(value.pppTnd || 0),

      workloadInitialJH: Number(value.workloadInitialJH || 0),
      workloadGarantieJH: Number(value.workloadGarantieJH || 0),
    };
  }

  cancel(): void {
    this.router.navigate(["/projets", this.projetId, "fiche-identification"]);
  }

  onBack(): void {
    this.cancel();
  }

  hasError(controlName: string): boolean {
    const control = this.form.get(controlName);
    return !!control && control.invalid && (control.touched || control.dirty);
  }

  text(value: string | null | undefined): string {
    return value && value.trim() ? value : "—";
  }

  number(value: number | null | undefined): string {
    if (value === null || value === undefined) return "—";

    return new Intl.NumberFormat("fr-FR", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 3,
    }).format(value);
  }

  getUserFullName(user: UserResponse): string {
    const anyUser = user as any;

    if (anyUser.nomComplet) {
      return anyUser.nomComplet;
    }

    const prenom = anyUser.prenom || "";
    const nom = anyUser.nom || "";

    return (
      `${prenom} ${nom}`.trim() || anyUser.email || `Utilisateur #${user.id}`
    );
  }

  get selectedDeviseCode(): string {
    const deviseId = this.form?.get("deviseProjetId")?.value;
    const devise = this.devises.find((d: any) => d.id === deviseId);

    return devise?.code || devise?.libelle || "";
  }

  get tauxChange(): number {
    return Number(this.form?.get("tauxChangeVersTnd")?.value || 1);
  }

  get budgetInitialTO(): number {
    return Number(this.form?.get("budgetInitialTO")?.value || 0);
  }

  get budgetLicencesSousTraitance(): number {
    return Number(this.form?.get("budgetLicencesSousTraitance")?.value || 0);
  }

  get montantAvenant(): number {
    return Number(this.form?.get("montantAvenant")?.value || 0);
  }

  get budgetST2iPreview(): number {
    return this.budgetInitialTO - this.budgetLicencesSousTraitance;
  }

  get budgetTotalPreview(): number {
    return this.budgetInitialTO + this.montantAvenant;
  }

  get budgetInitialToTndPreview(): number {
    return this.budgetInitialTO * this.tauxChange;
  }

  get budgetTotalTndPreview(): number {
    return this.budgetTotalPreview * this.tauxChange;
  }

  get workloadInitial(): number {
    return Number(this.form?.get("workloadInitialJH")?.value || 0);
  }

  get workloadAvenants(): number {
    return Number(this.form?.get("workloadAvenantsJH")?.value || 0);
  }

  get workloadGarantie(): number {
    return Number(this.form?.get("workloadGarantieJH")?.value || 0);
  }

  get workloadVenduAvenantsInclusPreview(): number {
    return this.workloadInitial + this.workloadAvenants;
  }

  money(value: number | null | undefined): string {
    if (value === null || value === undefined) return "—";
    return `${this.number(value)} ${this.selectedDeviseCode}`.trim();
  }

  tnd(value: number | null | undefined): string {
    if (value === null || value === undefined) return "—";
    return `${this.number(value)} TND`;
  }

  jh(value: number | null | undefined): string {
    if (value === null || value === undefined) return "—";
    return `${this.number(value)} J/H`;
  }

  get dureeContratJoursPreview(): number {
    const start = this.form?.get("dateDemarrage")?.value;
    const end = this.form?.get("dateFinInitialePrevue")?.value;

    if (!start || !end) {
      return 0;
    }

    const startDate = new Date(start);
    const endDate = new Date(end);

    if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
      return 0;
    }

    const diffMs = endDate.getTime() - startDate.getTime();
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    return diffDays > 0 ? diffDays : 0;
  }
}
