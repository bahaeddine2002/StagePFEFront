export interface ProjectNavItem {
  label: string;
  routeSuffix: string;
  icon: string;
  permission: string;
}

export const PROJECT_NAV_ITEMS: ProjectNavItem[] = [
  {
    label: "Vue d'ensemble",
    routeSuffix: "vue-ensemble",
    icon: "dashboard",
    permission: "PROJETS_VUE_ENSEMBLE",
  },
  {
    label: "Fiche d'identification",
    routeSuffix: "fiche-identification",
    icon: "description",
    permission: "PROJETS_FICHE_IDENTIFICATION",
  },
  {
    label: "Livrables",
    routeSuffix: "livrables",
    icon: "assignment",
    permission: "PROJETS_LIVRABLES",
  },
  {
    label: "Coût actualisé",
    routeSuffix: "cout-actualise",
    icon: "payments",
    permission: "PROJETS_COUT_ACTUALISE",
  },
  {
    label: "Coût prévisionnel",
    routeSuffix: "cout-previsionnel",
    icon: "trending_up",
    permission: "PROJETS_COUT_PREVISIONNEL",
  },
  {
    label: "DI",
    routeSuffix: "di",
    icon: "receipt_long",
    permission: "PROJETS_DI",
  },
  {
    label: "TCC",
    routeSuffix: "tcc",
    icon: "analytics",
    permission: "PROJETS_TCC",
  },
  {
    label: "Facturation",
    routeSuffix: "facturation",
    icon: "request_quote",
    permission: "PROJETS_FACTURATION",
  },
  {
    label: "Statistique",
    routeSuffix: "statistique",
    icon: "bar_chart",
    permission: "PROJETS_STATISTIQUE",
  },
];
