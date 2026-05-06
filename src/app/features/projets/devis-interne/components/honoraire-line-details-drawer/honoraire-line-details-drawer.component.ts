import { Component, EventEmitter, Input, Output } from "@angular/core";
import { LigneDevisInterneResponse } from "../../../models/devis-interne";

@Component({
  selector: "app-honoraire-line-details-drawer",
  templateUrl: "./honoraire-line-details-drawer.component.html",
  styleUrls: ["./honoraire-line-details-drawer.component.css"],
})
export class HonoraireLineDetailsDrawerComponent {
  @Input() line!: LigneDevisInterneResponse;
  @Input() deviseCode = "TND";

  @Output() closed = new EventEmitter<void>();

  close(): void {
    this.closed.emit();
  }

  isNegative(value?: number | null): boolean {
    return (value ?? 0) < 0;
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
