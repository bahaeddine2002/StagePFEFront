export interface LivrableProjetResponse {
  id: number;
  numero: number;
  designation: string;
  dateLivraisonPrevue: string;
  realise: boolean;
  livre: boolean;
  dateLivraisonReelle: string | null;
  deliveryPourcentage: number;
  ecartJours: number | null;
  projetId: number;
  createdAt?: string | null;
  updatedAt?: string | null;
}

export interface LivrableCreateRequest {
  designation: string;
  dateLivraisonPrevue: string;
}

export interface LivrableSuiviUpdateRequest {
  realise?: boolean | null;
  livre?: boolean | null;
  dateLivraisonReelle?: string | null;
}
