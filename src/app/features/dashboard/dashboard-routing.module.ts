import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { LayoutComponent } from "src/app/shared/layout/layout.component";

import { DashboardHomeComponent } from "../projets/dashboard-home/dashboard-home.component";

const routes: Routes = [
  {
    path: "",
    component: LayoutComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
