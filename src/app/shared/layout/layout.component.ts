import {
  Component,
  OnInit,
  ChangeDetectorRef,
  OnDestroy,
  AfterViewInit,
} from "@angular/core";
import { MediaMatcher } from "@angular/cdk/layout";
import { NavigationEnd, Router } from "@angular/router";
import { MatDialog } from "@angular/material/dialog";
import { filter, Subject, takeUntil } from "rxjs";

import { SpinnerService } from "../../core/services/spinner.service";
import { AuthService } from "src/app/core/services/auth.service";

import {
  TopSection,
  NavItem,
  SECTION_NAV_ITEMS,
  SECTION_CONFIG,
  SectionInfo,
} from "../config/layout-navigation.config";

import {
  PROJECT_NAV_ITEMS,
  ProjectNavItem,
} from "../config/project-navigation.config";

@Component({
  selector: "app-layout",
  templateUrl: "./layout.component.html",
  styleUrls: ["./layout.component.css"],
})
export class LayoutComponent implements OnInit, AfterViewInit, OnDestroy {
  mobileQuery: MediaQueryList;

  activeSection: TopSection | null = null;

  visibleTopSections: TopSection[] = [];

  currentSidebarItems: NavItem[] = [];

  currentSectionInfo: SectionInfo | null = null;

  isProjectWorkspaceRoute = false;

  currentProjectId: string | null = null;

  private readonly destroy$ = new Subject<void>();

  private readonly mobileQueryListener: () => void;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private media: MediaMatcher,
    public spinnerService: SpinnerService,
    private router: Router,
    private dialog: MatDialog,
    private authService: AuthService,
  ) {
    this.mobileQuery = this.media.matchMedia("(max-width: 1000px)");
    this.mobileQueryListener = () => this.changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this.mobileQueryListener);
  }

  ngOnInit(): void {
    this.buildVisibleTopSections();

    this.updateLayoutFromUrl(this.router.url);

    this.router.events
      .pipe(
        filter(
          (event): event is NavigationEnd => event instanceof NavigationEnd,
        ),
        takeUntil(this.destroy$),
      )
      .subscribe((event) => {
        this.buildVisibleTopSections();
        this.updateLayoutFromUrl(event.urlAfterRedirects);
      });
  }

  ngAfterViewInit(): void {
    this.changeDetectorRef.detectChanges();
  }

  setSection(section: TopSection): void {
    if (!this.visibleTopSections.includes(section)) {
      return;
    }

    if (section === "Dashboard") {
      this.router.navigate(["/dashboard"]);
      return;
    }

    if (section === "Projets") {
      this.router.navigate(["/projets"]);
      return;
    }

    if (section === "Administration") {
      const visibleAdminItems = this.getVisibleSidebarItems("Administration");
      const firstAdminRoute = visibleAdminItems[0]?.route ?? "/admin/roles";

      this.router.navigate([firstAdminRoute]);
      return;
    }
  }

  onLogout(): void {
    this.dialog.closeAll();
    this.authService.logout();
    this.router.navigate(["/auth/login"]);
  }

  private updateLayoutFromUrl(url: string): void {
    const cleanUrl = url.split("?")[0].split("#")[0];

    console.log("Current URL:", cleanUrl);
    console.log("Visible top sections:", this.visibleTopSections);

    const projectWorkspaceMatch = cleanUrl.match(
      /^\/projets\/([^\/]+)\/([^\/]+)$/,
    );

    if (projectWorkspaceMatch) {
      const projectId = projectWorkspaceMatch[1];

      this.applyProjectWorkspace(projectId);
      return;
    }

    if (
      cleanUrl === "/projets" ||
      cleanUrl === "/projets/" ||
      cleanUrl === "/projets/create"
    ) {
      if (!this.visibleTopSections.includes("Projets")) {
        this.redirectToFirstAllowedSection();
        return;
      }
      this.applyNormalSection("Projets");
      return;
    }

    if (cleanUrl.startsWith("/dashboard")) {
      if (!this.visibleTopSections.includes("Dashboard")) {
        this.redirectToFirstAllowedSection();
        return;
      }
      this.applyNormalSection("Dashboard");

      return;
    }

    if (cleanUrl.startsWith("/admin")) {
      if (!this.visibleTopSections.includes("Administration")) {
        this.redirectToFirstAllowedSection();
        return;
      }

      this.applyNormalSection("Administration");

      return;
    }

    this.redirectToFirstAllowedSection();
  }

  private buildVisibleTopSections(): void {
    const allSections = Object.keys(SECTION_NAV_ITEMS) as TopSection[];

    this.visibleTopSections = allSections.filter((section) => {
      return this.getVisibleSidebarItems(section).length > 0;
    });
  }

  private getVisibleProjectSidebarItems(projectId: string): NavItem[] {
    return PROJECT_NAV_ITEMS.filter((item: ProjectNavItem) =>
      this.authService.hasPermission(item.permission),
    ).map((item: ProjectNavItem) => ({
      label: item.label,
      icon: item.icon,
      permission: item.permission,
      route: `/projets/${projectId}/${item.routeSuffix}`,
    }));
  }

  private applyNormalSection(section: TopSection): void {
    this.activeSection = section;
    this.currentProjectId = null;
    this.isProjectWorkspaceRoute = false;

    this.currentSectionInfo = SECTION_CONFIG[section];
    this.currentSidebarItems = this.getVisibleSidebarItems(section);
  }

  private applyProjectWorkspace(projectID: string): void {
    this.activeSection = "Projets";
    this.currentProjectId = projectID;
    this.isProjectWorkspaceRoute = true;
    this.currentSectionInfo = {
      subtitle: "ESPACE PROJET",
      icon: "folder_open",
    };
    this.currentSidebarItems = this.getVisibleProjectSidebarItems(projectID);
  }

  private redirectToFirstAllowedSection(): void {
    const firstVisibleSection = this.visibleTopSections[0];

    if (!firstVisibleSection) {
      this.activeSection = null;
      this.currentProjectId = null;
      this.isProjectWorkspaceRoute = false;
      this.currentSidebarItems = [];
      this.activeSection = null;
      this.router.navigate(["/no-acess"]);
      return;
    }

    this.applyNormalSection(firstVisibleSection);

    if (firstVisibleSection === "Dashboard") {
      this.router.navigate(["/dashboard"]);
      return;
    }

    if (firstVisibleSection === "Projets") {
      this.router.navigate(["/projets"]);
      return;
    }

    if (firstVisibleSection === "Administration") {
      const firstAdminRoute =
        this.currentSidebarItems[0]?.route ?? "/admin/roles";

      this.router.navigate([firstAdminRoute]);
      return;
    }
  }

  private canAccessNavItem(item: NavItem): boolean {
    if (item.permission) return this.authService.hasPermission(item.permission);
    else if (item.permissionsAny)
      return this.authService.hasAnyPermission(item.permissionsAny);
    else return true;
  }

  private getVisibleSidebarItems(section: TopSection): NavItem[] {
    return SECTION_NAV_ITEMS[section].filter((item) =>
      this.canAccessNavItem(item),
    );
  }

  private canAcessSection(section: TopSection): boolean {
    return this.visibleTopSections.includes(section);
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this.mobileQueryListener);

    this.destroy$.next();
    this.destroy$.complete();
  }
}
