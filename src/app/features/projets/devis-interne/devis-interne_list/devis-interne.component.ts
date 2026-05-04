import { Component, OnInit } from "@angular/core";
import { AppDrawerService } from "src/app/shared/services/app-drawer.service";

export interface DiLine {
  id: number;
  section: "HONORAIRES" | "AUTRES_FRAIS" | "RISQUE_ESTIME";
  type: "line" | "subtotal" | "total";

  designation: string;
  subtitle?: string;

  venduClient: number;
  interne: number;
  charges: number;
  coutFinal: number;
  margeMontant: number;
  margePourcentage: number;

  unite?: string;
  chargeEstimee?: number;
  prixUnitaire?: number;
  ressourceProposee?: string;
  ressourceRetenue?: string;
  quantiteInterne?: number;
  coutUnitaire?: number;
  fraisDirects?: number;
  fraisGeneraux?: number;
  impotsEtTaxes?: number;
  commentaire?: string;
}

@Component({
  selector: "app-devis-interne",
  templateUrl: "./devis-interne.component.html",
  styleUrls: ["./devis-interne.component.css"],
})
export class DevisInterneComponent implements OnInit {
  isDrawerOpen = false;
  selectedLineTitle = "Chef de projet";
  selectedLineIsNegative = false;
  selectedLine?: DiLine;

  diLines: DiLine[] = [
    {
      id: 1,
      section: "HONORAIRES",
      type: "line",
      designation: "Chef de projet",
      subtitle: "Honoraires ST2i",
      venduClient: 15400,
      interne: 2866.235,
      charges: 0,
      coutFinal: 2866.235,
      margeMontant: 12533.765,
      margePourcentage: 81.39,
      unite: "H-Jour",
      chargeEstimee: 22,
      prixUnitaire: 700,
      ressourceProposee: "Ahmed BERRED",
      ressourceRetenue: "Ahmed BERRED",
      quantiteInterne: 2,
      coutUnitaire: 1433.118,
      fraisDirects: 0,
      fraisGeneraux: 0,
      impotsEtTaxes: 0,
      commentaire: "Aucune remarque particulière pour cette ressource.",
    },
    {
      id: 2,
      section: "HONORAIRES",
      type: "line",
      designation: "Consultant technique",
      subtitle: "Développeur",
      venduClient: 56000,
      interne: 23746,
      charges: 0,
      coutFinal: 23746,
      margeMontant: 32254,
      margePourcentage: 57.6,
      unite: "H-Jour",
      chargeEstimee: 112,
      prixUnitaire: 500,
      ressourceProposee: "Marwen SAIDI",
      ressourceRetenue: "Marwen SAIDI",
      quantiteInterne: 43,
      coutUnitaire: 552.232,
      fraisDirects: 0,
      fraisGeneraux: 0,
      impotsEtTaxes: 0,
      commentaire: "Profil technique retenu pour le développement.",
    },
    {
      id: 3,
      section: "HONORAIRES",
      type: "line",
      designation: "Formateur",
      subtitle: "Formation utilisateur",
      venduClient: 1500,
      interne: 20497,
      charges: 0,
      coutFinal: 20497,
      margeMontant: -18997,
      margePourcentage: -1266.47,
      unite: "H-Jour",
      chargeEstimee: 5,
      prixUnitaire: 300,
      ressourceProposee: "Dorsaf Babay",
      ressourceRetenue: "Syrine DRIDI",
      quantiteInterne: 131,
      coutUnitaire: 156.466,
      fraisDirects: 0,
      fraisGeneraux: 0,
      impotsEtTaxes: 0,
      commentaire: "Le coût final dépasse le montant vendu client.",
    },
    {
      id: 4,
      section: "HONORAIRES",
      type: "subtotal",
      designation: "Sous-total Honoraires",
      venduClient: 72900,
      interne: 57551,
      charges: 0,
      coutFinal: 57551,
      margeMontant: 15349,
      margePourcentage: 21.05,
    },
    {
      id: 5,
      section: "AUTRES_FRAIS",
      type: "line",
      designation: "Frais de séjour",
      subtitle: "Mission",
      venduClient: 0,
      interne: 0,
      charges: 0,
      coutFinal: 0,
      margeMontant: 0,
      margePourcentage: 0,
      unite: "Jour",
      chargeEstimee: 0,
      prixUnitaire: 0,
      ressourceRetenue: "Non affecté",
      quantiteInterne: 0,
      coutUnitaire: 0,
      fraisDirects: 0,
      fraisGeneraux: 0,
      impotsEtTaxes: 0,
    },
    {
      id: 6,
      section: "AUTRES_FRAIS",
      type: "line",
      designation: "Voyage",
      subtitle: "Déplacement",
      venduClient: 0,
      interne: 0,
      charges: 0,
      coutFinal: 0,
      margeMontant: 0,
      margePourcentage: 0,
      unite: "Unité",
      chargeEstimee: 0,
      prixUnitaire: 0,
      ressourceRetenue: "Non affecté",
      quantiteInterne: 0,
      coutUnitaire: 0,
      fraisDirects: 0,
      fraisGeneraux: 0,
      impotsEtTaxes: 0,
    },
    {
      id: 7,
      section: "AUTRES_FRAIS",
      type: "subtotal",
      designation: "Sous-total Autres frais",
      venduClient: 0,
      interne: 0,
      charges: 0,
      coutFinal: 0,
      margeMontant: 0,
      margePourcentage: 0,
    },
    {
      id: 8,
      section: "RISQUE_ESTIME",
      type: "line",
      designation: "Risque estimé 5%",
      subtitle: "Provision risque projet",
      venduClient: 0,
      interne: 0,
      charges: 0,
      coutFinal: 0,
      margeMontant: 0,
      margePourcentage: 0,
    },
    {
      id: 9,
      section: "RISQUE_ESTIME",
      type: "total",
      designation: "Total général",
      venduClient: 72900,
      interne: 57551,
      charges: 0,
      coutFinal: 57551,
      margeMontant: 15349,
      margePourcentage: 21.05,
    },
  ];

  trackByLineId(index: number, line: DiLine): number {
    return line.id;
  }

  get totalDevis(): number {
    return 72900;
  }

  get coutFinal(): number {
    return 57551;
  }

  get margeGlobale(): number {
    return 21.05;
  }

  formatMoney(value: number): string {
    return new Intl.NumberFormat("fr-FR", {
      minimumFractionDigits: 3,
      maximumFractionDigits: 3,
    }).format(value);
  }

  formatPercent(value: number): string {
    return new Intl.NumberFormat("fr-FR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  }

  isNegative(line: DiLine): boolean {
    return line.margeMontant < 0;
  }

  openDrawer(line: DiLine): void {
    this.selectedLine = line;
    this.isDrawerOpen = true;
  }

  closeDrawer(): void {
    this.isDrawerOpen = false;
    this.selectedLine = undefined;
  }

  constructor(private drawer: AppDrawerService) {}

  ngOnInit(): void {}
}
