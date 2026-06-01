export type ActiveStatistiqueTab = "monthly" | "history";

export interface RevueProjetPeriode {
  periode: string;
  monthKey: string;
  label: string;
  revueExiste: boolean;
  revueId: number | null;
}

export interface RevueProjet {
  id: number;
  projetId: number;
  periode: string;

  earnedValuePourcentage: number;
  dateFinPrevisionnelle: string;
  observationsFaitsMarquants: string;

  snapshotMontantAffaire: number;
  snapshotDateFinPrevue: string;
  snapshotMontantHonoraires: number;

  snapshotConsommationDelaisPourcentage: number;
  snapshotDeliveryPourcentage: number | null;
  snapshotFacturationPourcentage: number | null;

  snapshotCaProductionTnd: number;
  snapshotCaFactureTnd: number | null;
  snapshotStockTnd: number | null;

  snapshotCoutInitial: number;
  snapshotCoutReelMois: number;
  snapshotCoutReelCumul: number;
  snapshotCoutPrevisionnelRafEtc: number;
  snapshotCoutPrevisionnelEac: number;

  snapshotMargeNetteVendueTnd: number;
  snapshotMargeNetteActuelleTnd: number;
  snapshotMargeNetteEacTnd: number;
  snapshotMargeNetteVenduePourcentage: number;
  snapshotMargeNetteActuellePourcentage: number;
  snapshotMargeNetteEacPourcentage: number;

  snapshotChargePrevueGlobaleJh: number;
  snapshotChargePrevueMoisJh: number;
  snapshotConsommeMoisJh: number;
  snapshotConsommeCumulJh: number;
  snapshotResteAFaireEtcJh: number;
  snapshotResteAFaireEacJh: number;
  snapshotDeriveJh: number;
}

export interface DraftRevueForm {
  earnedValuePourcentage: number | null;
  dateFinPrevisionnelle: string;
  observationsFaitsMarquants: string;
}

export interface RevueProjetCreateRequest {
  periode: string;
  earnedValuePourcentage: number;
  dateFinPrevisionnelle: string;
  observationsFaitsMarquants: string;
}

export interface RevueProjetUpdateRequest {
  earnedValuePourcentage?: number;
  dateFinPrevisionnelle?: string;
  observationsFaitsMarquants?: string;
}
