import { Component, EventEmitter, Input, Output } from "@angular/core";

import { FacturationEcheanceResponse } from "../../models/facturation.models";

@Component({
  selector: "app-facturation-echeance-details-drawer",
  templateUrl: "./facturation-echeance-details-drawer.component.html",
  styleUrls: ["./facturation-echeance-details-drawer.component.css"],
})
export class FacturationEcheanceDetailsDrawerComponent {
  @Input() echeance!: FacturationEcheanceResponse;
  @Input() deviseCode: string = "TND";

  @Output() closed = new EventEmitter<void>();

  close(): void {
    this.closed.emit();
  }

  isTndCurrency(): boolean {
    return (this.deviseCode || "TND").toUpperCase() === "TND";
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

  getPaiementLabel(statutPaiement: string): string {
    switch (statutPaiement) {
      case "PAYE":
        return "Payé";
      case "PARTIELLEMENT_PAYE":
        return "Paiement partiel";
      case "NON_PAYE":
      default:
        return "Non payé";
    }
  }

  getPaiementStatusClass(): string {
    switch (this.echeance?.statutPaiement) {
      case "PAYE":
        return "status-success";
      case "PARTIELLEMENT_PAYE":
        return "status-warning";
      case "NON_PAYE":
      default:
        return "status-muted";
    }
  }

  getFactureLabel(): string {
    return this.echeance?.facture ? "Facturée" : "Non facturée";
  }

  getRegleLabel(): string {
    return this.echeance?.regle ? "Réglée" : "Non réglée";
  }
}
