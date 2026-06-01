import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import {
  DevisInterneResponse,
  LigneDevisInterneResponse,
} from "../../models/devis-interne";
import { ActivatedRoute, Router } from "@angular/router";
import { DevisInterneService } from "../../services/devis-interne.service";
import { finalize } from "rxjs";
import { ConfirmCreateDiDialogComponent } from "../components/confirm-create-di-dialog/confirm-create-di-dialog.component";
import { ToastService } from "src/app/shared/toast/toast.service.ts.service";

@Component({
  selector: "app-devis-interne",
  templateUrl: "./devis-interne.component.html",
  styleUrls: ["./devis-interne.component.css"],
})
export class DevisInterneComponent implements OnInit {
  projetId!: number;

  devisInterne: DevisInterneResponse | null = null;
  isHonoraireDrawerOpen = false;
  selectedLine: LigneDevisInterneResponse | null = null;
  isDetailsDrawerOpen = false;

  isLoading = false;
  isCreating = false;
  isDeletingLineId: number | null = null;
  hasNoDi = false;

  searchTerm = "";

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private devisInterneService: DevisInterneService,
    private toastService: ToastService,
  ) {}

  ngOnInit(): void {
    this.projetId = Number(this.route.snapshot.paramMap.get("id"));
    this.loadDevisInterne();
  }

  loadDevisInterne(): void {
    this.isLoading = true;
    this.hasNoDi = false;

    this.devisInterneService
      .getByProjetId(this.projetId)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (response) => {
          this.devisInterne = response;
          this.hasNoDi = false;
        },
        error: (error) => {
          if (error.status === 404) {
            this.devisInterne = null;
            this.hasNoDi = true;
            return;
          }

          const message = this.extractErrorMessage(
            error,
            "Erreur lors du chargement du Devis Interne.",
          );

          this.toastService.error(message);
        },
      });
  }

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(ConfirmCreateDiDialogComponent, {
      width: "520px",
      maxWidth: "95vw",
      disableClose: true,
      data: {
        codeProjet: this.devisInterne?.codeProjet,
      },
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.createDevisInterne();
      }
    });
  }

  createDevisInterne(): void {
    this.isCreating = true;

    this.devisInterneService
      .createForProjet(this.projetId)
      .pipe(finalize(() => (this.isCreating = false)))
      .subscribe({
        next: (response) => {
          this.devisInterne = response;
          this.hasNoDi = false;
          this.toastService.success("Devis Interne créé avec succès.");
        },
        error: (error) => {
          const message = this.extractErrorMessage(
            error,
            "Erreur lors de la création du Devis Interne.",
          );

          this.toastService.error(message);
        },
      });
  }

  goBack(): void {
    this.router.navigate(["/projets"]);
  }

  openAddHonoraireDrawer(): void {
    this.isHonoraireDrawerOpen = true;
  }

  closeHonoraireDrawer(): void {
    this.isHonoraireDrawerOpen = false;
  }

  openDetailsDrawer(line: LigneDevisInterneResponse): void {
    this.selectedLine = line;
    this.isDetailsDrawerOpen = true;
  }

  closeDetailsDrawer(): void {
    this.isDetailsDrawerOpen = false;
    this.selectedLine = null;
  }

  onHonoraireSaved(updatedDi: DevisInterneResponse): void {
    this.devisInterne = updatedDi;
    this.isHonoraireDrawerOpen = false;
    this.toastService.success("Ligne honoraire enregistrée avec succès.");
  }

  editLine(line: LigneDevisInterneResponse): void {
    // Later
    console.log("Edit line", line);
  }

  deleteLine(line: LigneDevisInterneResponse): void {
    if (this.isDeletingLineId) {
      return;
    }

    const confirmed = window.confirm(
      `Voulez-vous vraiment supprimer la ligne "${line.designation}" ?`,
    );

    if (!confirmed) {
      return;
    }

    this.isDeletingLineId = line.id;

    this.devisInterneService
      .deleteLigneHonoraire(this.devisInterne!.id, line.id)
      .pipe(finalize(() => (this.isDeletingLineId = null)))
      .subscribe({
        next: (updatedDi) => {
          this.devisInterne = updatedDi;
          this.toastService.success(
            "La ligne honoraire a été supprimée avec succès.",
          );
        },
        error: (error) => {
          const message = this.extractErrorMessage(
            error,
            "Erreur lors de la suppression de la ligne honoraire.",
          );

          this.toastService.error(message);
        },
      });
  }

  get lignes(): LigneDevisInterneResponse[] {
    return this.devisInterne?.lignes ?? [];
  }

  get hasLines(): boolean {
    return this.lignes.length > 0;
  }

  formatMoney(value?: number | null): string {
    const amount = value ?? 0;

    return new Intl.NumberFormat("fr-FR", {
      minimumFractionDigits: 3,
      maximumFractionDigits: 3,
    }).format(amount);
  }

  formatPercent(value?: number | null): string {
    const amount = value ?? 0;

    return new Intl.NumberFormat("fr-FR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  }

  isNegative(value?: number | null): boolean {
    return (value ?? 0) < 0;
  }

  trackByLineId(index: number, line: LigneDevisInterneResponse): number {
    return line.id;
  }

  private extractErrorMessage(error: any, fallback: string): string {
    return (
      error?.error?.message || error?.error?.error || error?.message || fallback
    );
  }
}
