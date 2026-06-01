import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import {
  Subject,
  debounceTime,
  distinctUntilChanged,
  finalize,
  takeUntil,
} from "rxjs";
import {
  CreateLigneHonoraireRequest,
  DevisInterneResponse,
  TccResolved,
} from "../../../models/devis-interne";
import { DevisInterneService } from "../../../services/devis-interne.service";
import { UsersService } from "src/app/features/admin/services/users.service";
import { UserResponse } from "src/app/features/admin/models/users";

@Component({
  selector: "app-honoraire-line-drawer",
  templateUrl: "./honoraire-line-drawer.component.html",
  styleUrls: ["./honoraire-line-drawer.component.css"],
})
export class HonoraireLineDrawerComponent implements OnInit, OnDestroy {
  @Input() devisInterne!: DevisInterneResponse;

  @Output() closed = new EventEmitter<void>();
  @Output() saved = new EventEmitter<DevisInterneResponse>();

  private destroy$ = new Subject<void>();

  form!: FormGroup;

  users: UserResponse[] = [];
  isLoadingUsers = false;

  resolvedTcc: TccResolved | null = null;
  isResolvingTcc = false;
  tccResolveMessage: string | null = null;

  isSaving = false;

  constructor(
    private fb: FormBuilder,
    private usersService: UsersService,
    private devisInterneService: DevisInterneService,
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadUsers();
    this.listenToTccFields();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initForm(): void {
    this.form = this.fb.group({
      designation: ["", Validators.required],

      resourceProposeId: [null],
      resourceRetenuId: [null, Validators.required],

      anneeTccUtilisee: [
        this.devisInterne?.anneeTccDefaut || new Date().getFullYear(),
        Validators.required,
      ],

      chargeEstimee: [null],
      prixUnitaire: [null],

      quantite: [null, [Validators.required, Validators.min(0.001)]],

      fd: [0, [Validators.min(0)]],
      fgPst: [0, [Validators.min(0)]],
      coutDesImpots: [0, [Validators.min(0)]],
    });
  }

  private loadUsers(): void {
    this.isLoadingUsers = true;

    this.usersService
      .getUsers()
      .pipe(finalize(() => (this.isLoadingUsers = false)))
      .subscribe({
        next: (users) => {
          this.users = users || [];
        },
        error: (error) => {
          console.error("Erreur lors du chargement des utilisateurs", error);
          this.users = [];
        },
      });
  }

  private listenToTccFields(): void {
    const resourceControl = this.form.get("resourceRetenuId");
    const yearControl = this.form.get("anneeTccUtilisee");

    resourceControl?.valueChanges
      .pipe(debounceTime(250), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe(() => this.resolveTccIfPossible());

    yearControl?.valueChanges
      .pipe(debounceTime(250), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe(() => this.resolveTccIfPossible());

    this.resolveTccIfPossible();
  }

  private resolveTccIfPossible(): void {
    const resourceRetenuId = this.form.get("resourceRetenuId")?.value;
    const anneeTccUtilisee = this.form.get("anneeTccUtilisee")?.value;

    this.resolvedTcc = null;
    this.tccResolveMessage = null;

    if (!resourceRetenuId || !anneeTccUtilisee) {
      this.tccResolveMessage =
        "Sélectionnez une ressource retenue et une année TCC.";
      return;
    }

    this.isResolvingTcc = true;

    this.devisInterneService
      .resolveTcc(Number(resourceRetenuId), Number(anneeTccUtilisee))
      .pipe(finalize(() => (this.isResolvingTcc = false)))
      .subscribe({
        next: (response) => {
          this.resolvedTcc = response;

          if (!response.found) {
            const userName = this.getSelectedRetenuName();
            this.tccResolveMessage =
              response.message ||
              `Aucun TCC trouvé pour ${userName} pour l’année ${anneeTccUtilisee}.`;
          }
        },
        error: (error) => {
          console.error("Erreur lors de la résolution du TCC", error);
          this.resolvedTcc = null;
          this.tccResolveMessage =
            "Impossible de vérifier le TCC pour cette ressource.";
        },
      });
  }

  save(): void {
    if (this.form.invalid || !this.resolvedTcc?.found || this.isSaving) {
      this.form.markAllAsTouched();
      return;
    }

    const payload: CreateLigneHonoraireRequest = {
      designation: this.form.value.designation,

      resourceProposeId: this.form.value.resourceProposeId || null,
      resourceRetenuId: this.form.value.resourceRetenuId,

      anneeTccUtilisee: this.form.value.anneeTccUtilisee,

      chargeEstimee: this.form.value.chargeEstimee,
      prixUnitaire: this.form.value.prixUnitaire,
      unite: "H/J",

      quantite: this.form.value.quantite,

      fd: this.form.value.fd || 0,
      fgPst: this.form.value.fgPst || 0,
      coutDesImpots: this.form.value.coutDesImpots || 0,
    };

    this.isSaving = true;

    this.devisInterneService
      .addLigneHonoraire(this.devisInterne.id, payload)
      .pipe(finalize(() => (this.isSaving = false)))
      .subscribe({
        next: (updatedDi) => {
          this.saved.emit(updatedDi);
        },
        error: (error) => {
          console.error("Erreur lors de l’ajout de la ligne honoraire", error);
        },
      });
  }

  close(): void {
    this.closed.emit();
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

  getUserMeta(user: UserResponse): string {
    const anyUser = user as any;

    return anyUser.email || anyUser.profileLibelle || "Ressource interne";
  }

  getSelectedRetenuName(): string {
    const id = this.form?.get("resourceRetenuId")?.value;

    const user = this.users.find((u) => u.id === id);

    return user ? this.getUserFullName(user) : "cette ressource";
  }

  get tccFound(): boolean {
    return this.resolvedTcc?.found === true;
  }

  get canSave(): boolean {
    return this.form.valid && this.tccFound && !this.isSaving;
  }

  get montantVenduTnd(): number {
    const charge = Number(this.form?.get("chargeEstimee")?.value || 0);
    const prix = Number(this.form?.get("prixUnitaire")?.value || 0);
    const taux = Number(this.devisInterne?.tauxChangeVersTnd || 0);

    return charge * prix * taux;
  }

  get prixRevient(): number {
    const quantite = Number(this.form?.get("quantite")?.value || 0);
    const coutUnitaire = Number(this.resolvedTcc?.coutUnitaireInterne || 0);

    return quantite * coutUnitaire;
  }

  get coutHorsTaxes(): number {
    const fgPst = Number(this.form?.get("fgPst")?.value || 0);

    return this.prixRevient + fgPst;
  }

  get coutFinal(): number {
    const coutDesImpots = Number(this.form?.get("coutDesImpots")?.value || 0);

    return this.coutHorsTaxes + coutDesImpots;
  }

  get margeNetteMontant(): number {
    return this.montantVenduTnd - this.coutFinal;
  }

  get margeNettePourcentage(): number {
    if (!this.montantVenduTnd) {
      return 0;
    }

    return (this.margeNetteMontant / this.montantVenduTnd) * 100;
  }

  get isPreviewNegative(): boolean {
    return this.margeNetteMontant < 0;
  }

  formatMoney(value?: number | null): string {
    return new Intl.NumberFormat("fr-FR", {
      minimumFractionDigits: 3,
      maximumFractionDigits: 3,
    }).format(value ?? 0);
  }

  formatPercent(value?: number | null): string {
    return new Intl.NumberFormat("fr-FR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value ?? 0);
  }
}
