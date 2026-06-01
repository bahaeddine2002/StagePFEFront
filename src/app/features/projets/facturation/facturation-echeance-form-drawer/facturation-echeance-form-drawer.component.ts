import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import {
  FormControl,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors,
  ValidatorFn,
} from "@angular/forms";
import { finalize } from "rxjs";

import {
  FacturationEcheanceRequest,
  FacturationEcheanceResponse,
  FacturationPageResponse,
} from "../../models/facturation.models";
import { FacturationService } from "../../services/facturation.service";
import { ToastService } from "src/app/shared/toast/toast.service.ts.service";

@Component({
  selector: "app-facturation-echeance-form-drawer",
  templateUrl: "./facturation-echeance-form-drawer.component.html",
  styleUrls: ["./facturation-echeance-form-drawer.component.css"],
})
export class FacturationEcheanceFormDrawerComponent implements OnInit {
  @Input() projetId!: number;
  @Input() facturation!: FacturationPageResponse;
  @Input() echeanceToEdit: FacturationEcheanceResponse | null = null;

  @Output() closed = new EventEmitter<void>();
  @Output() saved = new EventEmitter<FacturationPageResponse>();

  isSaving = false;
  submitAttempted = false;

  form = new FormGroup({
    description: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required],
    }),

    evenement: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required],
    }),

    pourcentage: new FormControl<number | null>(null, {
      validators: [Validators.required, Validators.min(0.01)],
    }),

    referenceFacture: new FormControl<string | null>(null),

    dateInitiale: new FormControl<string | null>(null, {
      validators: [Validators.required],
    }),

    datePrevisionnelle: new FormControl<string | null>(null, {
      validators: [Validators.required],
    }),

    dateReelle: new FormControl<string | null>(null),

    facture: new FormControl(false, {
      nonNullable: true,
    }),

    regle: new FormControl(false, {
      nonNullable: true,
    }),

    montantPaye: new FormControl<number | null>(0, {
      validators: [Validators.min(0)],
    }),

    commentaires: new FormControl<string | null>(null),
  });

  constructor(
    private facturationService: FacturationService,
    private toastService: ToastService,
  ) {}

  ngOnInit(): void {
    this.setupPercentageValidator();
    this.patchFormIfEditMode();
    this.setupFactureBusinessRule();
  }

  get isEditMode(): boolean {
    return !!this.echeanceToEdit;
  }

  get drawerTitle(): string {
    return this.isEditMode ? "Modifier l'échéance" : "Ajouter une échéance";
  }

  get drawerSubtitle(): string {
    return this.isEditMode
      ? "Mettez à jour les informations de facturation et de paiement."
      : "Ajoutez une nouvelle échéance de facturation au projet.";
  }

  get maxAllowedPourcentage(): number {
    const remaining = this.facturation?.pourcentageRestantPlanifiable || 0;

    if (this.isEditMode && this.echeanceToEdit) {
      return remaining + (this.echeanceToEdit.pourcentage || 0);
    }

    return remaining;
  }

  get deviseCode(): string {
    return this.facturation?.deviseCode || "TND";
  }

  get canSave(): boolean {
    return this.form.valid && !this.isSaving;
  }

  get isFacture(): boolean {
    return this.form.controls.facture.value === true;
  }

  get montantPreview(): number {
    const base = this.facturation?.baseFacturation || 0;
    const percentage = this.form.controls.pourcentage.value || 0;

    return (base * percentage) / 100;
  }

  get montantPreviewTnd(): number {
    const taux = this.facturation?.tauxChangeVersTnd || 1;
    return this.montantPreview * taux;
  }

  close(): void {
    if (this.isSaving) {
      return;
    }

    this.closed.emit();
  }

  save(): void {
    this.submitAttempted = true;

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.toastService.error("Veuillez corriger les champs obligatoires.");
      return;
    }

    if (!this.projetId) {
      this.toastService.error("Projet introuvable.");
      return;
    }

    const payload = this.buildPayload();

    this.isSaving = true;

    const request$ =
      this.isEditMode && this.echeanceToEdit
        ? this.facturationService.updateEcheance(
            this.projetId,
            this.echeanceToEdit.id,
            payload,
          )
        : this.facturationService.createEcheance(this.projetId, payload);

    request$.pipe(finalize(() => (this.isSaving = false))).subscribe({
      next: (response) => {
        this.saved.emit(response);
      },
      error: (error) => {
        const message = this.extractErrorMessage(
          error,
          "Erreur lors de l'enregistrement de l'échéance.",
        );

        this.toastService.error(message);
      },
    });
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

  private setupPercentageValidator(): void {
    this.form.controls.pourcentage.addValidators([
      this.maxPourcentageValidator(),
    ]);

    this.form.controls.pourcentage.updateValueAndValidity();
  }

  private maxPourcentageValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = Number(control.value);

      if (!value) {
        return null;
      }

      if (value > this.maxAllowedPourcentage) {
        return {
          maxPourcentage: {
            max: this.maxAllowedPourcentage,
            actual: value,
          },
        };
      }

      return null;
    };
  }

  private patchFormIfEditMode(): void {
    if (!this.echeanceToEdit) {
      return;
    }

    this.form.patchValue({
      description: this.echeanceToEdit.description,
      evenement: this.echeanceToEdit.evenement,
      pourcentage: this.echeanceToEdit.pourcentage,
      referenceFacture: this.echeanceToEdit.referenceFacture,
      dateInitiale: this.echeanceToEdit.dateInitiale,
      datePrevisionnelle: this.echeanceToEdit.datePrevisionnelle,
      dateReelle: this.echeanceToEdit.dateReelle,
      facture: this.echeanceToEdit.facture,
      regle: this.echeanceToEdit.regle,
      montantPaye: this.echeanceToEdit.montantPaye,
      commentaires: this.echeanceToEdit.commentaires,
    });
  }

  private setupFactureBusinessRule(): void {
    if (!this.isEditMode) {
      this.form.controls.facture.setValue(false, { emitEvent: false });
      this.form.controls.regle.setValue(false, { emitEvent: false });
      this.form.controls.montantPaye.setValue(0, { emitEvent: false });
      this.form.controls.dateReelle.setValue(null, { emitEvent: false });

      this.form.controls.facture.disable({ emitEvent: false });
      this.form.controls.regle.disable({ emitEvent: false });
      this.form.controls.montantPaye.disable({ emitEvent: false });
      this.form.controls.dateReelle.disable({ emitEvent: false });
      return;
    }
    this.applyFactureBusinessRule(this.form.controls.facture.value);

    this.form.controls.facture.valueChanges.subscribe((facture) => {
      this.applyFactureBusinessRule(facture);
    });
  }

  private applyFactureBusinessRule(facture: boolean): void {
    const dateReelleControl = this.form.controls.dateReelle;
    const regleControl = this.form.controls.regle;
    const montantPayeControl = this.form.controls.montantPaye;

    if (!facture) {
      dateReelleControl.setValue(null, { emitEvent: false });
      regleControl.setValue(false, { emitEvent: false });
      montantPayeControl.setValue(0, { emitEvent: false });

      dateReelleControl.disable({ emitEvent: false });
      regleControl.disable({ emitEvent: false });
      montantPayeControl.disable({ emitEvent: false });
      return;
    }

    dateReelleControl.enable({ emitEvent: false });
    regleControl.enable({ emitEvent: false });
    montantPayeControl.enable({ emitEvent: false });
  }

  private buildPayload(): FacturationEcheanceRequest {
    const raw = this.form.getRawValue();

    return {
      description: raw.description,
      evenement: raw.evenement,
      pourcentage: raw.pourcentage || 0,
      referenceFacture: raw.referenceFacture || null,
      dateInitiale: raw.dateInitiale!,
      datePrevisionnelle: raw.datePrevisionnelle!,
      dateReelle: raw.dateReelle || null,
      facture: raw.facture,
      regle: raw.regle,
      montantPaye: raw.montantPaye || 0,
      commentaires: raw.commentaires || null,
    };
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
}
