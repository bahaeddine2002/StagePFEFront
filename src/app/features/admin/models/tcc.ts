export interface TccAnneeConfigResponse {
  id: number;
  annee: number;
  coefFg: number;
}

export interface TccAnneeConfigRequest {
  annee: number;
  coefFg: number;
}

export interface TccRessourceResponse {
  id: number;

  employeId: number;
  employeNomComplet?: string;
  employeEmail?: string;
  employeMatricule?: string;

  annee: number;
  tccBase: number;
  coefFgAnnuel: number;
  tccInclusFg: number;
}

export interface TccRessourceRequest {
  employeId: number;
  annee: number;
  tccBase: number;
}
