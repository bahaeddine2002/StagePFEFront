import { Router } from "@angular/router";
import { Component, OnInit } from "@angular/core";
import {
  UntypedFormGroup,
  UntypedFormControl,
  Validators,
} from "@angular/forms";
import { Title } from "@angular/platform-browser";

import { NotificationService } from "src/app/core/services/notification.service";

@Component({
  selector: "app-password-reset-request",
  templateUrl: "./password-reset-request.component.html",
  styleUrls: ["./password-reset-request.component.css"],
})
export class PasswordResetRequestComponent implements OnInit {
  private email!: string;
  form!: UntypedFormGroup;
  loading!: boolean;

  constructor(
    private notificationService: NotificationService,
    private titleService: Title,
    private router: Router,
  ) {}

  ngOnInit() {
    this.titleService.setTitle(
      "angular-material-template - Password Reset Request",
    );

    this.form = new UntypedFormGroup({
      email: new UntypedFormControl("", [
        Validators.required,
        Validators.email,
      ]),
    });

    this.form.get("email")?.valueChanges.subscribe((val: string) => {
      this.email = val.toLowerCase();
    });
  }

  resetPassword() {
    this.loading = true;
  }

  cancel() {
    this.router.navigate(["/"]);
  }
}
