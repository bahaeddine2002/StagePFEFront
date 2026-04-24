import { Component, OnInit, inject } from "@angular/core";
import { Router } from "@angular/router";
import { RolesService } from "../services/roles.service.ts.service";
import { RoleResponse } from "../models/roles";
import { ToastService } from "src/app/shared/toast/toast.service.ts.service";

@Component({
  selector: "app-roles",
  templateUrl: "./roles.component.html",
  styleUrls: ["./roles.component.css"],
})
export class RolesComponent implements OnInit {
  private router = inject(Router);
  private rolesService = inject(RolesService);
  private toastService = inject(ToastService);

  totalRoles = 0;
  activePermissions = 148; // mock for now until stats endpoint exists
  complianceStatus = "Optimal"; // mock for now

  roles: RoleResponse[] = [];
  isLoading = false;
  errorMessage = "";
  isDeleting = false;
  deletingRoleId: number | null = null;

  ngOnInit(): void {
    this.loadRoles();
  }

  loadRoles(): void {
    this.isLoading = true;
    this.errorMessage = "";

    this.rolesService.getRoles().subscribe({
      next: (response) => {
        this.roles = response;
        this.totalRoles = response.length;
        this.isLoading = false;
      },
      error: (error) => {
        console.error("Failed to load roles", error);
        this.errorMessage =
          "Une erreur est survenue lors du chargement des rôles.";
        this.isLoading = false;
      },
    });
  }

  setUrl(): void {
    this.router.navigate(["/admin/roles/create"]);
  }

  getVisiblePermissions(role: RoleResponse): string[] {
    return role.permissions.slice(0, 2);
  }

  getRemainingPermissionsCount(role: RoleResponse): number {
    return role.permissions.length > 2 ? role.permissions.length - 2 : 0;
  }

  trackByRoleId(index: number, role: RoleResponse): number {
    return role.id;
  }

  onView(role: RoleResponse): void {
    console.log("View role", role);
    // later: this.router.navigate(['/admin/roles', role.id]);
  }

  onEdit(role: RoleResponse): void {
    console.log("Edit role", role);
    // later: this.router.navigate(['/admin/roles', role.id, 'edit']);
  }

  onDelete(role: RoleResponse): void {
    const confirmed = window.confirm(
      `Voulez-vous vraiment supprimer le rôle "${role.libelle}" ?`,
    );

    if (!confirmed) {
      return;
    }

    this.isDeleting = true;
    this.deletingRoleId = role.id;

    this.rolesService.deleteRole(role.id).subscribe({
      next: () => {
        this.roles = this.roles.filter((item) => item.id !== role.id);
        this.totalRoles = this.roles.length;

        this.toastService.success("Le rôle a été supprimé avec succès");
        this.isDeleting = false;
        this.deletingRoleId = null;
      },
      error: (error) => {
        console.error("Delete role failed", error);
        this.toastService.error(
          error.error?.message ||
            "Une erreur est survenue lors de la suppression",
        );
        this.isDeleting = false;
        this.deletingRoleId = null;
      },
    });
  }
}
