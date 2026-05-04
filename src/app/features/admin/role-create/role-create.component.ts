import { Component, OnInit, inject } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import {
  PermissionsService,
  Permissions,
} from "src/app/features/admin/services/permissions.service";
import { CreateRoleRequest } from "../models/roles";
import { RolesService } from "../services/roles.service.ts.service";
import { ToastService } from "src/app/shared/toast/toast.service.ts.service";

export interface PermissionNode {
  code: string;
  name: string;
  children: PermissionNode[];
}

@Component({
  selector: "app-role-create",
  templateUrl: "./role-create.component.html",
  styleUrls: ["./role-create.component.css"],
})
export class RoleCreateComponent implements OnInit {
  private permissionService = inject(PermissionsService);
  private roleServse = inject(RolesService);
  private toastService = inject(ToastService);

  isSubmitting = false;
  serverErrorMessage = "";
  submitAttempted = false;

  private permissionList: Permissions[] = [];
  permissionTree: PermissionNode[] = [];

  roleForm = new FormGroup({
    code: new FormControl<string>("", {
      nonNullable: true,
      validators: [Validators.required],
    }),
    libelle: new FormControl<string>("", {
      nonNullable: true,
      validators: [Validators.required],
    }),
    description: new FormControl<string>("", {
      nonNullable: true,
    }),
    permissionCodes: new FormControl<string[]>([], {
      nonNullable: true,
    }),
  });

  ngOnInit(): void {
    this.loadPermissions();
  }

  onSubmit(): void {
    this.submitAttempted = true;

    this.roleForm.markAllAsTouched();
    if (this.roleForm.invalid) return;

    const payload: CreateRoleRequest = {
      code: this.roleForm.value.code ?? "",
      libelle: this.roleForm.value.libelle ?? "",
      description: this.roleForm.value.description ?? "",
      permissionCodes: this.roleForm.value.permissionCodes ?? [],
    };

    payload.permissionCodes = payload.permissionCodes.filter(
      (code) =>
        code !== "DASHBOARD" &&
        code !== "PROJETS" &&
        code !== "ADMINISTRATION" &&
        code !== "PROJETS_LISTE",
    );

    console.log(payload);
    this.serverErrorMessage = "";
    this.isSubmitting = true;

    this.roleServse.createRole(payload).subscribe({
      next: (response) => {
        this.toastService.success("Le rôle a été créé avec succès");
        console.log("Role created successfully", response);
      },
      error: (error) => {
        this.isSubmitting = false;
        this.serverErrorMessage =
          "Une erreur est survenue lors de la création du rôle.";
        this.toastService.error(
          error.error?.message || "Une erreur est survenue lors de la création",
        );
      },
    });
  }

  isChildSelected(child: PermissionNode): boolean {
    return this.getSelectedCodes().includes(child.code);
  }

  isParentChecked(parent: PermissionNode): boolean {
    const selectedCodes = this.getSelectedCodes();

    if (parent.children.length === 0) {
      return selectedCodes.includes(parent.code);
    }

    const parentSelected = selectedCodes.includes(parent.code);
    const allChildrenSelected = parent.children.every((child) =>
      selectedCodes.includes(child.code),
    );

    return parentSelected && allChildrenSelected;
  }

  isParentIndeterminate(parent: PermissionNode): boolean {
    if (parent.children.length === 0) {
      return false;
    }

    const selectedCodes = this.getSelectedCodes();

    const selectedChildrenCount = parent.children.filter((child) =>
      selectedCodes.includes(child.code),
    ).length;

    const parentSelected = selectedCodes.includes(parent.code);

    const someChildrenSelected =
      selectedChildrenCount > 0 &&
      selectedChildrenCount < parent.children.length;

    const allChildrenSelectedButParentMissing =
      selectedChildrenCount === parent.children.length && !parentSelected;

    return someChildrenSelected || allChildrenSelectedButParentMissing;
  }

  toggleChild(
    parent: PermissionNode,
    child: PermissionNode,
    checked: boolean,
  ): void {
    const selectedCodes = new Set(this.getSelectedCodes());

    if (parent.children.length === 0) {
      if (checked) {
        selectedCodes.add(parent.code);
      } else {
        selectedCodes.delete(parent.code);
      }

      this.roleForm.patchValue({
        permissionCodes: [...selectedCodes],
      });
      return;
    }

    if (checked) {
      selectedCodes.add(child.code);
    } else {
      selectedCodes.delete(child.code);
      selectedCodes.delete(parent.code);
    }

    const allChildrenSelected = parent.children.every((node) =>
      node.code === child.code ? checked : selectedCodes.has(node.code),
    );

    if (allChildrenSelected) {
      selectedCodes.add(parent.code);
    } else {
      selectedCodes.delete(parent.code);
    }

    this.roleForm.patchValue({
      permissionCodes: [...selectedCodes],
    });
  }

  toggleParent(parent: PermissionNode, checked: boolean): void {
    const selectedCodes = new Set(this.getSelectedCodes());

    if (checked) {
      selectedCodes.add(parent.code);
      parent.children.forEach((child) => selectedCodes.add(child.code));
    } else {
      selectedCodes.delete(parent.code);
      parent.children.forEach((child) => selectedCodes.delete(child.code));
    }

    this.roleForm.patchValue({
      permissionCodes: [...selectedCodes],
    });
  }

  private getSelectedCodes(): string[] {
    return this.roleForm.get("permissionCodes")?.value ?? [];
  }

  private loadPermissions(): void {
    this.permissionService.getPermission().subscribe((perm: Permissions[]) => {
      this.permissionList = perm;
      this.permissionTree = this.buildPermissionTree(perm);
    });
  }

  private buildPermissionTree(permissions: Permissions[]): PermissionNode[] {
    const rootMap: Record<string, PermissionNode> = {};

    rootMap["DASHBOARD"] = {
      code: "DASHBOARD",
      name: "dashboard",
      children: [],
    };
    rootMap["PROJETS"] = {
      code: "PROJETS",
      name: "projets",
      children: [],
    };
    rootMap["ADMINISTRATION"] = {
      code: "ADMINISTRATION",
      name: "administration",
      children: [],
    };

    permissions.forEach((permission) => {
      const node = this.toNode(permission);

      if (permission.code.startsWith("DASHBOARD_")) {
        rootMap["DASHBOARD"]?.children.push(node);
      } else if (permission.code.startsWith("PROJETS_")) {
        rootMap["PROJETS"]?.children.push(node);
      } else if (permission.code.startsWith("ADMIN_")) {
        rootMap["ADMINISTRATION"]?.children.push(node);
      }
    });

    return Object.values(rootMap);
  }

  private toNode(permission: Permissions): PermissionNode {
    return {
      code: permission.code,
      name: permission.libelle,
      children: [],
    };
  }
  getIconForGroup(code: string): string {
    switch (code) {
      case "DASHBOARD":
        return "dashboard";
      case "PROJETS":
        return "account_tree";
      case "ADMINISTRATION":
        return "settings";
      default:
        return "folder";
    }
  }
}
