import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ReferentielServiceTs } from "../services/referentiel.service.ts.service";
import { UsersService } from "../../admin/services/users.service";
import {
  ChefProjetOption,
  mapToChefProjetOption,
} from "../models/ChefProjetOption";
import { ReferentielItem } from "../models/ReferentielItem";
import { ProjetService } from "../services/projet.service";
import { Router } from "@angular/router";
import { ProjetCreateRequest } from "../models/Projets";
import { OrganisationResponse } from "../../admin/models/organisation.model";
import { OrganisationService } from "../../admin/services/organisation.service";
import { forkJoin } from "rxjs";

@Component({
  selector: "app-project-create",
  templateUrl: "./project-create.component.html",
  styleUrls: ["./project-create.component.css"],
})
export class ProjectCreateComponent implements OnInit {
  projectForm!: FormGroup;

  businessModels: ReferentielItem[] = [];
  typeEngagements: ReferentielItem[] = [];
  statutsProjet: ReferentielItem[] = [];
  devises: ReferentielItem[] = [];
  chefsProjet: ChefProjetOption[] = [];

  clients: OrganisationResponse[] = [];
  partenaires: OrganisationResponse[] = [];
  bailleursDeFonds: OrganisationResponse[] = [];
  isLoadingOrganisations = false;

  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private referentielService: ReferentielServiceTs,
    private usersService: UsersService,
    private projetService: ProjetService,
    private router: Router,
    private readonly organisationService: OrganisationService,
  ) {}

  ngOnInit(): void {
    this.loadOrganisations();
    this.initForm();
    this.loadReferentiels();
    this.setupFormListeners();
    this.setupBusinessModelListener();
    this.updateCalculatedPreview();
    console.log("hello");
  }

  private initForm(): void {
    this.projectForm = this.fb.group({
      // Informations générales
      codeProjet: ["", Validators.required],
      contractId: [""],
      nomProjet: ["", Validators.required],
      clientId: [null, Validators.required],
      partenaireId: [null],
      bailleurDeFondsId: [null],
      chefProjetId: [null, Validators.required],
      descriptionProjet: [""],

      // Classification
      businessModelId: [null, Validators.required],
      typeEngagementId: [null, Validators.required],
      statutProjetId: [null, Validators.required],

      // Planning
      dateDemarrage: [null, Validators.required],
      dateDemarrageEffective: [null],
      dateFinPrevue: [null, Validators.required],
      dureeContratJours: [{ value: null, disabled: true }],

      // Devise
      deviseProjetId: [null, Validators.required],
      tauxChangeVersTnd: [null, [Validators.required, Validators.min(0)]],

      // Budget
      budgetInitialTO: [0, [Validators.min(0)]],
      budgetLicencesSousTraitance: [0, [Validators.min(0)]],
      budgetSt2i: [{ value: 0, disabled: true }],

      // Workload
      workloadInitialJh: [0, [Validators.min(0)]],
      workloadGarantieJh: [0, [Validators.min(0)]],
    });
  }

  private loadOrganisations(): void {
    this.isLoadingOrganisations = true;

    forkJoin({
      clients: this.organisationService.getActiveOrganisationsByType("CLIENT"),
      partenaires:
        this.organisationService.getActiveOrganisationsByType("PARTENAIRE"),
      bailleurs:
        this.organisationService.getActiveOrganisationsByType(
          "BAILLEUR_DE_FONDS",
        ),
    }).subscribe({
      next: ({ clients, partenaires, bailleurs }) => {
        this.clients = clients ?? [];
        this.partenaires = partenaires ?? [];
        this.bailleursDeFonds = bailleurs ?? [];
        this.isLoadingOrganisations = false;
      },
      error: (error) => {
        console.error("Erreur chargement organisations", error);
        this.isLoadingOrganisations = false;
      },
    });
  }

  private loadReferentiels(): void {
    this.referentielService.getBusinessModels().subscribe({
      next: (data) => (this.businessModels = data),
      error: () => console.error("Impossible de charger les modèles business"),
    });

    this.referentielService.getTypesEngagement().subscribe({
      next: (data) => (this.typeEngagements = data),
      error: () => console.error("Impossible de charger type Engagements"),
    });

    this.referentielService.getStatutsProjet().subscribe({
      next: (data) => (this.statutsProjet = data),
      error: () => console.error("Impossible de charger status Projets"),
    });

    this.referentielService.getDevises().subscribe({
      next: (data) => {
        const dinar = data.filter((curr) => curr.code === "TND")[0];
        const deviseParDefaut = dinar ? dinar : data[0];
        this.devises = data;

        this.projectForm.patchValue({
          deviseProjetId: deviseParDefaut.id,
          tauxChangeVersTnd: dinar ? 1 : null,
        });
      },
      error: () => console.error("Impossible de charger status Projets"),
    });

    this.usersService.getUsers().subscribe({
      next: (data) => {
        this.chefsProjet = data.map((user) => mapToChefProjetOption(user));
      },
      error: () => console.error("Impossible de charger users"),
    });
  }

  private setupFormListeners(): void {
    this.projectForm.valueChanges.subscribe(() => {
      this.updateCalculatedPreview();
    });
  }

  onDeviseChange(): void {
    const selectedDeviseId = Number(
      this.projectForm.get("deviseProjetId")?.value,
    );
    const selectedDevise = this.devises.find(
      (devise) => devise.id === selectedDeviseId,
    );

    if (selectedDevise?.code === "TND") {
      this.projectForm.patchValue(
        { tauxChangeVersTnd: 1 },
        { emitEvent: false },
      );
    } else {
      this.projectForm.patchValue(
        { tauxChangeVersTnd: null },
        { emitEvent: false },
      );
    }

    this.updateCalculatedPreview();
  }

  private updateCalculatedPreview(): void {
    if (!this.projectForm) {
      return;
    }

    const raw = this.projectForm.getRawValue();

    const budgetInitialT0 = this.toNumber(raw.budgetInitialTO);
    const budgetLicences = this.toNumber(raw.budgetLicencesSousTraitance);

    const workloadInitial = this.toNumber(raw.workloadInitialJh);

    const budgetSt2i = budgetInitialT0 - budgetLicences;

    const dureeContratJours = this.calculateDurationInDays(
      raw.dateDemarrage,
      raw.dateFinPrevue,
    );

    this.projectForm.patchValue(
      {
        budgetSt2i: this.round3(budgetSt2i),
        dureeContratJours,
      },
      { emitEvent: false },
    );
  }

  private calculateDurationInDays(
    start: string | null,
    end: string | null,
  ): number | null {
    if (!start || !end) {
      return null;
    }

    const startDate = new Date(start);
    const endDate = new Date(end);

    if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
      return null;
    }

    return Math.ceil(
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24),
    );
  }

  private toNumber(value: unknown): number {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  private round3(value: number): number {
    return Math.round(value * 1000) / 1000;
  }

  onSubmit(): void {
    if (this.projectForm.invalid) {
      this.projectForm.markAllAsTouched();
      return;
    }

    const raw = this.projectForm.getRawValue();

    const payload = {
      codeProjet: raw.codeProjet,
      contractId: raw.contractId || null,

      nomProjet: raw.nomProjet,
      descriptionProjet: raw.descriptionProjet || null,

      clientId: raw.clientId,
      partenaireId: this.isGroupementBusinessModel()
        ? raw.partenaireId || null
        : null,
      bailleurDeFondsId: raw.bailleurDeFondsId || null,

      projectManagerId: raw.chefProjetId,

      businessModelId: raw.businessModelId,
      typeEngagementId: raw.typeEngagementId,
      statutProjetId: raw.statutProjetId,

      dateDemarrage: raw.dateDemarrage,
      dateDemarrageEffective: raw.dateDemarrageEffective || null,
      dateFinInitialePrevue: raw.dateFinPrevue,

      deviseProjetId: raw.deviseProjetId,
      tauxChangeVersTnd: raw.tauxChangeVersTnd,

      budgetInitialTO: raw.budgetInitialTO,
      budgetLicencesSousTraitance: raw.budgetLicencesSousTraitance,

      workloadInitialJH: raw.workloadInitialJh,
      workloadGarantieJH: raw.workloadGarantieJh,
    };

    this.createProjet(payload);
  }

  isGroupementBusinessModel(): boolean {
    const selectedId = Number(this.projectForm.get("businessModelId")?.value);

    if (!selectedId) {
      return false;
    }

    const selectedBusinessModel = this.businessModels.find(
      (item) => item.id === selectedId,
    );

    const label = selectedBusinessModel?.libelle?.toLowerCase().trim() || "";

    return label.includes("groupement");
  }

  private setupBusinessModelListener(): void {
    this.projectForm.get("businessModelId")?.valueChanges.subscribe(() => {
      if (!this.isGroupementBusinessModel()) {
        this.projectForm.patchValue(
          {
            partenaireId: null,
          },
          {
            emitEvent: false,
          },
        );
      }
    });
  }

  private createProjet(payload: ProjetCreateRequest): void {
    this.projetService.createProjet(payload).subscribe({
      next: (createdProject) => {
        this.router.navigate([
          "/projets",
          createdProject.id,
          "fiche-identification",
        ]);
      },
      error: (error) => {
        console.error("Erreur création projet", error);
        // later show snackbar/toast
      },
    });
  }
}
