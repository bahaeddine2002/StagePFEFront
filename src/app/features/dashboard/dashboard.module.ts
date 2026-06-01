import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { DashboardRoutingModule } from "./dashboard-routing.module";
import { DashboardHomeComponent } from "../projets/dashboard-home/dashboard-home.component";
import { SharedModule } from "src/app/shared/shared.module";

@NgModule({
  declarations: [],
  imports: [CommonModule, DashboardRoutingModule, SharedModule],
})
export class DashboardModule {}
