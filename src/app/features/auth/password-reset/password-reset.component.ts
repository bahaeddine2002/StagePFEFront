import {
  UntypedFormGroup,
  UntypedFormControl,
  Validators,
} from "@angular/forms";
import { ActivatedRoute, Router, ParamMap } from "@angular/router";
import { Component, OnInit } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { NotificationService } from "src/app/core/services/notification.service";

@Component({
  selector: "app-password-reset",
  templateUrl: "./password-reset.component.html",
  styleUrls: ["./password-reset.component.css"],
})
export class PasswordResetComponent implements OnInit {
  private token!: string;
  email!: string;
  form!: UntypedFormGroup;
  loading!: boolean;
  hideNewPassword: boolean;
  hideNewPasswordConfirm: boolean;

  constructor(
    private activeRoute: ActivatedRoute,
    private router: Router,
    private notificationService: NotificationService,
    private titleService: Title,
  ) {
    this.titleService.setTitle("angular-material-template - Password Reset");
    this.hideNewPassword = true;
    this.hideNewPasswordConfirm = true;
  }

  ngOnInit() {
    this.activeRoute.queryParamMap.subscribe((params: ParamMap) => {
      this.token = params.get("token") + "";
      this.email = params.get("email") + "";

      if (!this.token || !this.email) {
        this.router.navigate(["/"]);
      }
    });

    this.form = new UntypedFormGroup({
      newPassword: new UntypedFormControl("", Validators.required),
      newPasswordConfirm: new UntypedFormControl("", Validators.required),
    });
  }

  resetPassword() {
    const password = this.form.get("newPassword")?.value;
    const passwordConfirm = this.form.get("newPasswordConfirm")?.value;

    if (password !== passwordConfirm) {
      this.notificationService.openSnackBar("Passwords do not match");
      return;
    }

    this.loading = true;
  }

  cancel() {
    this.router.navigate(["/"]);
  }
}
