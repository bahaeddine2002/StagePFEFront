import { Component } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { finalize } from "rxjs";
import { AuthService } from "src/app/core/services/auth.service";
import { ToastService } from "src/app/shared/toast/toast.service.ts.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent {
  hidePassword = true;
  isSubmitting = false;
  submitAttempted = false;

  loginForm = new FormGroup({
    email: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    password: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required],
    }),
    rememberMe: new FormControl(false, {
      nonNullable: true,
    }),
  });

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastService: ToastService,
  ) {}

  onSubmit(): void {
    this.submitAttempted = true;
    this.loginForm.markAllAsTouched();

    if (this.loginForm.invalid) {
      return;
    }

    this.isSubmitting = true;

    const formValue = this.loginForm.getRawValue();

    this.authService
      .login({
        email: formValue.email,
        password: formValue.password,
      })
      .pipe(finalize(() => (this.isSubmitting = false)))
      .subscribe({
        next: () => {
          this.toastService.success("Connexion réussie");
          this.router.navigate(["/dashboard"]);
        },
        error: (error) => {
          this.toastService.error(
            error?.error?.message || "Email ou mot de passe invalide.",
          );
        },
      });
  }
}
