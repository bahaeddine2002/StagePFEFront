export interface ProjetCreateRequest {
  codeProjet: string;
  contractId?: string | null;
  client: string;
  partenaire?: string | null;
  nomProjet: string;
  descriptionProjet?: string | null;
  bailleurDeFonds?: string | null;

  businessModelId: number;
  typeEngagementId: number;
  deviseProjetId: number;
  statutProjetId: number;
  projectManagerId: number;

  dateDemarrage: string;
  dateDemarrageEffective?: string | null;
  dateFinInitialePrevue: string;

  tauxChangeVersTnd: number;
  budgetInitialTO: number;
  budgetLicencesSousTraitance: number;

  avenant?: boolean | null;
  montantAvenant?: number | null;
  workloadAvenantsJH?: number | null;

  pprTnd?: number | null;
  pppTnd?: number | null;

  workloadInitialJH: number;
  workloadGarantieJH: number;
}

export interface ProjetUpdateRequest {
  codeProjet: string;
  contractId?: string | null;
  client: string;
  partenaire?: string | null;
  nomProjet: string;
  descriptionProjet?: string | null;
  bailleurDeFonds?: string | null;

  businessModelId: number;
  typeEngagementId: number;
  deviseProjetId: number;
  statutProjetId: number;
  projectManagerId: number;

  dateDemarrage: string;
  dateDemarrageEffective?: string | null;
  dateFinInitialePrevue: string;

  tauxChangeVersTnd: number;
  budgetInitialTO: number;
  budgetLicencesSousTraitance: number;

  pprTnd?: number | null;
  pppTnd?: number | null;

  avenant?: boolean | null;
  montantAvenant?: number | null;
  workloadAvenantsJH?: number | null;

  workloadInitialJH: number;
  workloadGarantieJH: number;
}

export interface ProjetFormValue {
  codeProjet: string;
  contractId: string | null;
  client: string;
  partenaire: string | null;
  nomProjet: string;
  descriptionProjet: string | null;
  bailleurDeFonds: string | null;

  businessModelId: number | null;
  typeEngagementId: number | null;
  deviseProjetId: number | null;
  statutProjetId: number | null;
  projectManagerId: number | null;

  dateDemarrage: string | null;
  dateDemarrageEffective: string | null;
  dateFinInitialePrevue: string | null;

  tauxChangeVersTnd: number | null;
  budgetInitialTO: number | null;
  budgetLicencesSousTraitance: number | null;

  pprTnd: number | null;
  pppTnd: number | null;

  avenant: boolean;
  montantAvenant: number | null;
  workloadAvenantsJH: number | null;

  workloadInitialJH: number | null;
  workloadGarantieJH: number | null;
}

export interface ProjetResponse {
  id: number;
  codeProjet: string;
  contractId: string | null;
  client: string;
  partenaire: string | null;
  nomProjet: string;
  descriptionProjet: string | null;
  bailleurDeFonds: string | null;

  businessModelId: number;
  typeEngagementId: number;
  deviseProjetId: number;
  statutProjetId: number;
  projectManagerId: number;

  dateDemarrage: string;
  dateDemarrageEffective: string | null;
  dateFinInitialePrevue: string;

  tauxChangeVersTnd: number;
  budgetInitialTO: number;
  budgetLicencesSousTraitance: number;
  budgetST2i: number;
  budgetTotal: number;
  budgetInitialToTnd: number;
  budgetTotalTnd: number;

  workloadInitialJH: number;
  workloadGarantieJH: number;
  workloadVenduAvenantsInclusJH: number;

  dateCreation: string;
  dateModification: string | null;
}

export interface ProjetDetailResponse {
  id: number;

  codeProjet: string;
  contractId: string | null;
  client: string | null;
  partenaire: string | null;
  nomProjet: string;
  descriptionProjet: string | null;
  bailleurDeFonds: string | null;

  projectManagerId: number | null;
  projectManagerNomComplet: string | null;
  projectManagerEmail: string | null;
  projectManagerActif: boolean | null;

  businessModelId: number | null;
  businessModelLibelle: string | null;

  typeEngagementId: number | null;
  typeEngagementLibelle: string | null;

  deviseProjetId: number | null;
  deviseCode: string | null;
  deviseLibelle: string | null;

  statutProjetId: number | null;
  statutProjetLibelle: string | null;

  dateDemarrage: string | null;
  dateDemarrageEffective: string | null;
  dateFinInitialePrevue: string | null;
  dureeContratJours: number | null;

  tauxChangeVersTnd: number | null;

  budgetInitialTO: number | null;
  budgetLicencesSousTraitance: number | null;
  budgetST2i: number | null;
  budgetTotal: number | null;
  budgetInitialToTnd: number | null;
  budgetTotalTnd: number | null;

  avenant: boolean | null;
  montantAvenant: number | null;
  workloadAvenantsJH: number | null;

  pprTnd: number | null;
  pppTnd: number | null;

  workloadInitialJH: number | null;
  workloadGarantieJH: number | null;
  workloadVenduAvenantsInclusJH: number | null;

  diConfigured: boolean;
  coutTotalDiTnd: number | null;
  margeNetteVenduePourcentage: number | null;
  margeNetteVendueTnd: number | null;
  alerteRentabilite: string | null;

  dateCreation: string | null;
  dateModification: string | null;
}
