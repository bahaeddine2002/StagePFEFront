import { Component, OnInit, inject } from "@angular/core";
import { Router } from "@angular/router";
import { ToastService } from "src/app/shared/toast/toast.service.ts.service";
import { UserResponse } from "../models/users";
import { UsersService } from "../services/users.service";

@Component({
  selector: "app-users",
  templateUrl: "./users.component.html",
  styleUrls: ["./users.component.css"],
})
export class UsersComponent implements OnInit {
  private router = inject(Router);
  private usersService = inject(UsersService);
  private toastService = inject(ToastService);

  totalUsers = 0;
  activeUsers = 0;
  inactiveUsers = 0;

  users: UserResponse[] = [];
  filteredUsers: UserResponse[] = [];

  isLoading = false;
  errorMessage = "";
  searchTerm = "";

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading = true;
    this.errorMessage = "";

    this.usersService.getUsers().subscribe({
      next: (response) => {
        this.users = response;
        this.filteredUsers = response;
        this.totalUsers = response.length;
        this.activeUsers = response.filter((u) => u.active).length;
        this.inactiveUsers = response.filter((u) => !u.active).length;
        this.isLoading = false;
      },
      error: (error) => {
        console.error("Failed to load users", error);
        this.errorMessage =
          "Une erreur est survenue lors du chargement des utilisateurs.";
        this.isLoading = false;
      },
    });
  }

  setUrl(): void {
    this.router.navigate(["/admin/utilisateurs/create"]);
  }

  applySearch(value: string): void {
    this.searchTerm = value.trim().toLowerCase();

    if (!this.searchTerm) {
      this.filteredUsers = this.users;
      return;
    }

    this.filteredUsers = this.users.filter((user) => {
      const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();

      return (
        user.matricule.toLowerCase().includes(this.searchTerm) ||
        user.email.toLowerCase().includes(this.searchTerm) ||
        fullName.includes(this.searchTerm) ||
        user.profileCode.some((code) =>
          code.toLowerCase().includes(this.searchTerm),
        )
      );
    });
  }

  trackByUserId(index: number, user: UserResponse): number {
    return user.id;
  }

  getVisibleProfiles(user: UserResponse): string[] {
    return user.profileCode.slice(0, 2);
  }

  getRemainingProfilesCount(user: UserResponse): number {
    return user.profileCode.length > 2 ? user.profileCode.length - 2 : 0;
  }

  getUserInitials(user: UserResponse): string {
    const first = user.firstName?.charAt(0) || "";
    const last = user.lastName?.charAt(0) || "";
    return (first + last).toUpperCase();
  }

  onView(user: UserResponse): void {
    console.log("View user", user);
    // later: this.router.navigate(['/admin/users', user.id]);
  }

  onEdit(user: UserResponse): void {
    console.log("Edit user", user);
    // later: this.router.navigate(['/admin/users', user.id, 'edit']);
  }

  onDelete(user: UserResponse): void {
    const confirmDelete = confirm(
      `Voulez-vous vraiment supprimer l'utilisateur ${user.firstName} ${user.lastName} ?`,
    );

    if (!confirmDelete) {
      return;
    }

    this.isLoading = true;

    this.usersService.deleteUser(user.id).subscribe({
      next: () => {
        this.users = this.users.filter((u) => u.id !== user.id);
        this.filteredUsers = this.filteredUsers.filter((u) => u.id !== user.id);

        this.totalUsers = this.users.length;
        this.activeUsers = this.users.filter((u) => u.active).length;
        this.inactiveUsers = this.users.filter((u) => !u.active).length;

        this.toastService.success("Utilisateur supprimé avec succès.");

        this.isLoading = false;
      },

      error: (error) => {
        console.error("Delete failed", error);

        if (error?.error?.message) {
          this.toastService.error(error.error.message);
        } else {
          this.toastService.error("Impossible de supprimer cet utilisateur.");
        }

        this.isLoading = false;
      },
    });
  }
}
