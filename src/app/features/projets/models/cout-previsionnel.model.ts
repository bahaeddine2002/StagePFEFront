export interface CoutPrevisionnelMonth {
  key: string;
  label: string;
  moisReference: string;
}

export interface CoutPrevisionnelResource {
  ligneDevisInterneId: number;
  resourceRetenuId: number | null;
  nomComplet: string | null;
  matricule: string | null;
  designation: string | null;
  tjm: number;
  jours: Record<string, number | null>;
}

export interface CoutPrevisionnelResponse {
  projetId: number;
  nomProjet: string;
  devise: string | null;
  dateDebut: string;
  dateFin: string;
  months: CoutPrevisionnelMonth[];
  resources: CoutPrevisionnelResource[];
  totalJours: number;
  totalCout: number;
}

export interface CoutPrevisionnelSaveRequest {
  resources: CoutPrevisionnelResourceSave[];
}

export interface CoutPrevisionnelResourceSave {
  ligneDevisInterneId: number;
  jours: Record<string, number | null>;
}
