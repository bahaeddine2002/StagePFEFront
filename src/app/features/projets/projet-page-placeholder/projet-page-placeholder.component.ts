import { Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-projet-page-placeholder",
  templateUrl: "./projet-page-placeholder.component.html",
  styleUrls: ["./projet-page-placeholder.component.css"],
})
export class ProjetPagePlaceholderComponent {
  constructor(public route: ActivatedRoute) {}

  get projectId(): string {
    return this.route.snapshot.paramMap.get("id") || "";
  }

  get currentSection(): string {
    return this.route.snapshot.routeConfig?.path || "";
  }
}
