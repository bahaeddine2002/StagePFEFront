import { Component, OnInit } from "@angular/core";
import { NotificationService } from "src/app/core/services/notification.service";
import { Title } from "@angular/platform-browser";
import { NGXLogger } from "ngx-logger";
import { AuthService } from "src/app/core/services/auth.service";

@Component({
  selector: "app-dashboard-home",
  templateUrl: "./dashboard-home.component.html",
  styleUrls: ["./dashboard-home.component.css"],
})
export class DashboardHomeComponent implements OnInit {
  currentUser: any;

  constructor(
    private notificationService: NotificationService,
    private titleService: Title,
    private logger: NGXLogger,
    private authService: AuthService,
  ) {}

  ngOnInit() {
    this.titleService.setTitle("angular-material-template - Dashboard");
    this.logger.log("Dashboard loaded");
    this.currentUser = this.authService.getCurrentUser();

    setTimeout(() => {
      this.notificationService.openSnackBar("Welcome!");
    });
  }
}
