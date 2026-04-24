import { Component, OnInit } from "@angular/core";
import { AuthService } from "src/app/core/services/auth.service";

@Component({
  selector: "app-profile-details",
  templateUrl: "./profile-details.component.html",
  styleUrls: ["./profile-details.component.css"],
})
export class ProfileDetailsComponent implements OnInit {
  constructor(private authService: AuthService) {}

  ngOnInit() {}
}
