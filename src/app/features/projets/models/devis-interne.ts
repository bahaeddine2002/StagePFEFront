export interface LigneDevisInterneResponse {
  id: number;

  designation: string;

  resourceProposeId?: number | null;
  resourceRetenuId: number;
  resourceRetenuNomComplet?: string | null;

  tccRessourceId?: number | null;
  anneeTccUtilisee: number;
  tccBaseUtilise: number;
  coefFgUtilise: number;
  coutUnitaireInterneUtilise: number;

  unite: string;

  chargeEstimee: number;
  prixUnitaire: number;

  montantTotal: number;
  montantTotalTnd: number;

  quantite: number;
  prixRevient: number;

  fd: number;
  fgPst: number;
  coutHorsTaxes: number;

  coutDesImpots: number;

  coutFinal: number;
  margeNetteMontant: number;
  margeNettePourcentage: number;
}

export interface DevisInterneResponse {
  id: number;

  projetId: number;
  codeProjet: string;
  nomProjet: string;

  department?: string | null;

  directeurProjetId?: number | null;
  chefDeProjetId?: number | null;

  anneeTccDefaut: number;

  deviseCode?: string | null;
  tauxChangeVersTnd: number;

  lignes: LigneDevisInterneResponse[];

  totalMontant: number;
  totalMontantTnd: number;

  totalPrixRevient: number;

  totalFd: number;
  totalFgPst: number;

  totalCoutHorsTaxes: number;
  totalCoutDesImpots: number;
  totalCoutFinal: number;

  totalMargeNetteMontant: number;
  totalMargeNettePourcentage: number;
}

export interface CreateLigneHonoraireRequest {
  designation: string;

  resourceProposeId?: number | null;
  resourceRetenuId: number;

  anneeTccUtilisee: number;

  chargeEstimee: number;
  prixUnitaire: number;
  unite: string;

  quantite: number;

  fd?: number | null;
  fgPst?: number | null;
  coutDesImpots?: number | null;
}

export interface TccResolved {
  found: boolean;
  message?: string | null;

  tccRessourceId?: number | null;

  employeId?: number | null;
  employeNomComplet?: string | null;

  annee?: number | null;

  tccBase?: number | null;
  coefFg?: number | null;

  coutUnitaireInterne?: number | null;
}
