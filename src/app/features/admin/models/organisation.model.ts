export type TypeOrganisation = "CLIENT" | "PARTENAIRE" | "BAILLEUR_DE_FONDS";

export interface OrganisationResponse {
  id: number;

  nom: string;
  nomCourt?: string | null;
  displayName: string;

  type: TypeOrganisation;

  paysCode?: string | null;
  paysNom?: string | null;

  adresse?: string | null;
  contactPrincipal?: string | null;
  email?: string | null;
  telephone?: string | null;
  notes?: string | null;

  actif: boolean;

  createdAt?: string | null;
  updatedAt?: string | null;
}

export interface OrganisationRequest {
  nom: string;
  nomCourt?: string | null;

  type: TypeOrganisation;

  paysCode?: string | null;
  paysNom?: string | null;

  adresse?: string | null;
  contactPrincipal?: string | null;
  email?: string | null;
  telephone?: string | null;
  notes?: string | null;

  actif?: boolean | null;
}

export interface OrganisationTypeOption {
  value: TypeOrganisation;
  label: string;
}

export const ORGANISATION_TYPE_OPTIONS: OrganisationTypeOption[] = [
  {
    value: "CLIENT",
    label: "Client",
  },
  {
    value: "PARTENAIRE",
    label: "Partenaire",
  },
  {
    value: "BAILLEUR_DE_FONDS",
    label: "Bailleur de fonds",
  },
];
