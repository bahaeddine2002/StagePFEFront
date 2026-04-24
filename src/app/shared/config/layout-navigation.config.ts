export type TopSection = "Dashboard" | "Projets" | "Adminstration";

export interface NavItem {
  label: string;
  route: string;
  icon: string;
  permission?: string;
}

export interface SectionInfo {
  subtitle: string;
  icon: string;
  permission?: string;
}

export const SECTION_NAV_ITEMS: Record<TopSection, NavItem[]> = {
  Dashboard: [
    {
      label: "Vue Genrale",
      route: "/dashboard",
      icon: "dashboard",
      permission: "DASHBOARD",
    },
    {
      label: "KPI globeaux",
      route: "/KPI",
      icon: "insights",
      permission: "DASHBOARD",
    },
  ],
  Projets: [
    {
      label: "Liste des projets",
      route: "/projets",
      icon: "list",
      permission: "PROJETS_LISTE",
    },
  ],
  Adminstration: [
    {
      label: "Rôles",
      route: "/admin/roles",
      icon: "admin_panel_settings",
      permission: "ADMIN_ROLES",
    },
    {
      label: "Utilisateurs",
      route: "/admin/utilisateurs",
      icon: "people",
      permission: "ADMIN_UTILISATEURS",
    },
  ],
};

export const SECTION_CONFIG: Record<TopSection, SectionInfo> = {
  Dashboard: {
    subtitle: "VUE D'ENSEMBLE",
    icon: "dashboard",
    permission: "DASHBOARD",
  },
  Projets: {
    subtitle: "GESTION DE PORTEFEUILLE",
    icon: "business_center",
    permission: "PROJETS",
  },
  Adminstration: {
    subtitle: "CONTRÔLE D'ACCÈS",
    icon: "admin_panel_settings",
    permission: "ADMINISTRATION",
  },
};
