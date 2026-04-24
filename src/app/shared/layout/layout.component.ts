import {
  Component,
  OnInit,
  ChangeDetectorRef,
  OnDestroy,
  AfterViewInit,
} from "@angular/core";
import { MediaMatcher } from "@angular/cdk/layout";
import { filter, Subject, takeUntil } from "rxjs";

import { SpinnerService } from "../../core/services/spinner.service";
import { NavigationEnd, Router } from "@angular/router";
import { MatDialog } from "@angular/material/dialog";
import { AuthService } from "src/app/core/services/auth.service";
import {
  TopSection,
  SECTION_NAV_ITEMS,
  SECTION_CONFIG,
} from "../config/layout-navigation.config";

@Component({
  selector: "app-layout",
  templateUrl: "./layout.component.html",
  styleUrls: ["./layout.component.css"],
})
export class LayoutComponent implements OnInit, OnDestroy, AfterViewInit {
  private _mobileQueryListener: () => void;
  private destroy$ = new Subject<void>();

  mobileQuery: MediaQueryList;
  showSpinner = false;
  userName = "";
  isAdmin = false;

  activeSection: TopSection = "Dashboard";

  private sectionPermissionMap: Record<TopSection, string[]> = {
    Dashboard: ["DASHBOARD"],
    Projets: [
      "PROJETS",
      "PROJETS_LISTE",
      "PROJETS_VUE_ENSEMBLE",
      "PROJETS_FICHE_IDENTIFICATION",
      "PROJETS_LIVRABLES",
      "PROJETS_COUT_ACTUALISE",
      "PROJETS_COUT_PREVISIONNEL",
      "PROJETS_DI",
      "PROJETS_TCC",
      "PROJETS_FACTURATION",
      "PROJETS_STATISTIQUE",
    ],
    Adminstration: ["ADMINISTRATION", "ADMIN_ROLES", "ADMIN_UTILISATEURS"],
  };

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private media: MediaMatcher,
    public spinnerService: SpinnerService,
    private router: Router,
    private authService: AuthService,
    private dialog: MatDialog,
  ) {
    this.mobileQuery = this.media.matchMedia("(max-width: 1000px)");
    this._mobileQueryListener = () => this.changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnInit(): void {
    this.updateSectionFromUrl(this.router.url);
    this.ensureValidActiveSection();

    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntil(this.destroy$),
      )
      .subscribe((event: any) => {
        this.updateSectionFromUrl(event.urlAfterRedirects);
        this.ensureValidActiveSection();
      });
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngAfterViewInit(): void {
    this.changeDetectorRef.detectChanges();
  }

  setSection(section: TopSection): void {
    if (!this.visibleTopSections.includes(section)) {
      return;
    }

    const visibleItems = SECTION_NAV_ITEMS[section].filter((item) => {
      return (
        !item.permission || this.authService.hasPermission(item.permission)
      );
    });

    const firstRouteOfSection = visibleItems[0]?.route;

    if (firstRouteOfSection) {
      this.router.navigate([firstRouteOfSection]);
    }
  }

  private updateSectionFromUrl(url: string): void {
    if (url.startsWith("/admin")) {
      this.activeSection = "Adminstration";
    } else if (url.startsWith("/projets")) {
      this.activeSection = "Projets";
    } else {
      this.activeSection = "Dashboard";
    }
  }

  private ensureValidActiveSection(): void {
    if (!this.visibleTopSections.includes(this.activeSection)) {
      this.activeSection = this.visibleTopSections[0] ?? "Dashboard";
    }
  }

  onLogout(): void {
    this.dialog.closeAll();
    this.authService.logout();
    this.router.navigate(["/auth/login"]);
  }

  get visibleTopSections(): TopSection[] {
    return (Object.keys(this.sectionPermissionMap) as TopSection[]).filter(
      (section) =>
        this.authService.hasAnyPermission(this.sectionPermissionMap[section]),
    );
  }

  get currentSidebarItems() {
    return SECTION_NAV_ITEMS[this.activeSection].filter((item) => {
      return (
        !item.permission || this.authService.hasPermission(item.permission)
      );
    });
  }

  get currentSectionInfo() {
    return SECTION_CONFIG[this.activeSection] ?? SECTION_CONFIG["Dashboard"];
  }
}
