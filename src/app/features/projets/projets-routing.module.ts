import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { LayoutComponent } from "src/app/shared/layout/layout.component";
import { ProjetsListComponent } from "./projects-list-page/projects-list.component";
import { ProjetPagePlaceholderComponent } from "./projet-page-placeholder/projet-page-placeholder.component";
import { AuthGuard } from "src/app/core/guards/auth.guard";
import { ProjectCreateComponent } from "./project-create/project-create.component";
import { FicheIdentificationComponent } from "./fiche-identification/fiche-identification.component";
import { DevisInterneComponent } from "./devis-interne/devis-interne_list/devis-interne.component";

const routes: Routes = [
  {
    path: "",
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: "create",
        component: ProjectCreateComponent,
      },

      {
        path: "",
        component: ProjetsListComponent,
        pathMatch: "full",
      },

      {
        path: ":id/vue-ensemble",
        component: ProjetPagePlaceholderComponent,
      },
      {
        path: ":id/fiche-identification",
        component: FicheIdentificationComponent,
      },
      {
        path: ":id/livrables",
        component: ProjetPagePlaceholderComponent,
      },
      {
        path: ":id/cout-actualise",
        component: ProjetPagePlaceholderComponent,
      },
      {
        path: ":id/cout-previsionnel",
        component: ProjetPagePlaceholderComponent,
      },
      {
        path: ":id/di",
        component: DevisInterneComponent,
      },
      {
        path: ":id/tcc",
        component: ProjetPagePlaceholderComponent,
      },
      {
        path: ":id/facturation",
        component: ProjetPagePlaceholderComponent,
      },
      {
        path: ":id/statistique",
        component: ProjetPagePlaceholderComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProjetsRoutingModule {}
