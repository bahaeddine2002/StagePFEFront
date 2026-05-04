export type TopSection = "Dashboard" | "Projets" | "Administration";
import {
  PERMISSIONS,
  ADMIN_PERMISSIONS,
  PROJETS_PERMISSIONS,
  DASHBOARD_PERMISSIONS,
} from "src/app/core/constants/permissions";

export interface NavItem {
  label: string;
  route: string;
  icon: string;
  permission?: string;
  permissionsAny?: string[];
}

export interface SectionInfo {
  subtitle: string;
  icon: string;
}

export const SECTION_NAV_ITEMS: Record<TopSection, NavItem[]> = {
  Dashboard: [
    {
      label: "Vue Genrale",
      route: "/dashboard",
      icon: "dashboard",
      permission: PERMISSIONS.DASHBOARD_VUE_GENERALE,
    },
    {
      label: "KPI globeaux",
      route: "/KPI",
      icon: "insights",
      permission: PERMISSIONS.DASHBOARD_KPI_GLOBAUX,
    },
  ],
  Projets: [
    {
      label: "Liste des projets",
      route: "/projets",
      icon: "list",
      permissionsAny: PROJETS_PERMISSIONS,
    },
  ],
  Administration: [
    {
      label: "Rôles",
      route: "/admin/roles",
      icon: "admin_panel_settings",
      permission: PERMISSIONS.ADMIN_ROLES,
    },
    {
      label: "Utilisateurs",
      route: "/admin/utilisateurs",
      icon: "people",
      permission: PERMISSIONS.ADMIN_UTILISATEURS,
    },
    {
      label: "Référentiel TCC",
      icon: "calculate",
      route: "/admin/tcc",
      permission: PERMISSIONS.PROJETS_TCC,
    },
  ],
};

export const SECTION_CONFIG: Record<TopSection, SectionInfo> = {
  Dashboard: {
    subtitle: "VUE D'ENSEMBLE",
    icon: "dashboard",
  },
  Projets: {
    subtitle: "GESTION DE PORTEFEUILLE",
    icon: "business_center",
  },
  Administration: {
    subtitle: "CONTRÔLE D'ACCÈS",
    icon: "admin_panel_settings",
  },
};
