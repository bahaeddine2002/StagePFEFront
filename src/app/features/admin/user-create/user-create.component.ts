import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { finalize } from "rxjs";
import { CreateUserRequest } from "../models/users";
import { RolesService } from "../services/roles.service.ts.service";
import { UsersService } from "../services/users.service";
import { ToastService } from "src/app/shared/toast/toast.service.ts.service";
import { RoleResponse } from "../models/roles";

@Component({
  selector: "app-user-create",
  templateUrl: "./user-create.component.html",
  styleUrls: ["./user-create.component.css"],
})
export class UserCreateComponent implements OnInit {
  isSubmitting = false;
  submitAttempted = false;
  hidePassword = true;
  isLoadingRoles = false;

  availableRoles: RoleResponse[] = [];

  userForm = new FormGroup({
    matricule: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required],
    }),
    firstName: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required],
    }),
    lastName: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required],
    }),
    email: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    password: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required],
    }),
    profileCode: new FormControl<string[]>([], {
      nonNullable: true,
      validators: [Validators.required],
    }),
    sendEmail: new FormControl(true, {
      nonNullable: true,
    }),
  });

  constructor(
    private rolesService: RolesService,
    private usersService: UsersService,
    private toastService: ToastService,
  ) {}

  ngOnInit(): void {
    this.loadRoles();
  }

  loadRoles(): void {
    this.isLoadingRoles = true;

    this.rolesService
      .getRoles()
      .pipe(finalize(() => (this.isLoadingRoles = false)))
      .subscribe({
        next: (roles) => {
          this.availableRoles = roles;
        },
        error: () => {
          this.toastService.error("Impossible de charger les rôles.");
        },
      });
  }

  get selectedProfileCodes(): string[] {
    return this.userForm.controls.profileCode.value;
  }

  isRoleSelected(roleCode: string): boolean {
    return this.selectedProfileCodes.includes(roleCode);
  }

  toggleRole(roleCode: string): void {
    const currentCodes = [...this.selectedProfileCodes];

    const alreadySelected = currentCodes.includes(roleCode);

    const updatedCodes = alreadySelected
      ? currentCodes.filter((code) => code !== roleCode)
      : [...currentCodes, roleCode];

    this.userForm.controls.profileCode.setValue(updatedCodes);
    this.userForm.controls.profileCode.markAsTouched();
    this.userForm.controls.profileCode.updateValueAndValidity();
  }

  onSubmit(): void {
    this.submitAttempted = true;
    this.userForm.markAllAsTouched();

    if (this.userForm.invalid) {
      return;
    }

    this.isSubmitting = true;

    const formValue = this.userForm.getRawValue();

    const payload: CreateUserRequest = {
      matricule: formValue.matricule,
      firstName: formValue.firstName,
      lastName: formValue.lastName,
      email: formValue.email,
      password: formValue.password,
      profileCode: formValue.profileCode,
      sendEmail: formValue.sendEmail,
    };

    this.usersService
      .createUser(payload)
      .pipe(finalize(() => (this.isSubmitting = false)))
      .subscribe({
        next: () => {
          const message = payload.sendEmail
            ? "Utilisateur créé avec succès. Les identifiants ont été envoyés par email."
            : "Utilisateur créé avec succès.";

          this.toastService.success(message);

          this.userForm.reset({
            matricule: "",
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            profileCode: [],
            sendEmail: true,
          });

          this.submitAttempted = false;
        },
        error: (error) => {
          const backendMessage =
            error?.error?.message ||
            "Erreur lors de la création de l’utilisateur.";

          this.toastService.error(backendMessage);
        },
      });
  }
}
