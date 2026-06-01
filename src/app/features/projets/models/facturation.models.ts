export type StatutPaiement = "NON_PAYE" | "PARTIELLEMENT_PAYE" | "PAYE";

export interface FacturationPageResponse {
  projetId: number;

  deviseCode: string | null;
  tauxChangeVersTnd: number;

  baseFacturation: number;
  baseFacturationTnd: number;

  totalPourcentagePlanifie: number;
  pourcentageRestantPlanifiable: number;

  pourcentageFacture: number;
  pourcentageRestantAFacturer: number;

  echeances: FacturationEcheanceResponse[];
}

export interface FacturationEcheanceResponse {
  id: number;
  projetId: number;
  ordre: number;

  description: string;
  pourcentage: number;

  evenement: string;
  referenceFacture: string | null;

  dateInitiale: string;
  datePrevisionnelle: string;
  dateReelle: string | null;

  facture: boolean;
  regle: boolean;

  montantPaye: number;
  montantPayeTnd: number;

  cumulPaye: number;
  cumulPayeTnd: number;

  commentaires: string | null;

  montantAFacturer: number;
  montantAFacturerTnd: number;

  cumulFacturation: number;
  cumulFacturationTnd: number;

  resteAFacturer: number;
  resteAFacturerTnd: number;

  cumulFacturationPourcentage: number;
  resteAFacturerPourcentage: number;

  statutPaiement: StatutPaiement;
}

export interface FacturationEcheanceRequest {
  description: string;
  pourcentage: number;

  evenement: string;
  referenceFacture?: string | null;

  dateInitiale: string;
  datePrevisionnelle: string;
  dateReelle?: string | null;

  facture: boolean;
  regle: boolean;

  montantPaye?: number | null;
  commentaires?: string | null;
}
