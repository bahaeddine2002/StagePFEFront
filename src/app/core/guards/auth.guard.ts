import { Injectable } from "@angular/core";
import { Router, CanActivate, UrlTree } from "@angular/router";
import * as moment from "moment";

import { AuthService } from "../services/auth.service";
import { NotificationService } from "../services/notification.service";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private notificationService: NotificationService,
    private authService: AuthService,
  ) {}

  canActivate(): boolean | UrlTree {
    const isLoggedIn = this.authService.isAuthenticated();

    if (isLoggedIn) {
      return true;
    }

    return this.router.createUrlTree(["/auth/login"]);
  }
}
