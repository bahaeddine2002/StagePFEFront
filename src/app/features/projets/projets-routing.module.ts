import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { LayoutComponent } from "src/app/shared/layout/layout.component";
import { ProjetsListComponent } from "./projects-list-page/projects-list.component";
import { ProjetPagePlaceholderComponent } from "./projet-page-placeholder/projet-page-placeholder.component";
import { AuthGuard } from "src/app/core/guards/auth.guard";
import { ProjectCreateComponent } from "./project-create/project-create.component";
import { FicheIdentificationComponent } from "./fiche-identification/fiche-identification.component";
import { DevisInterneComponent } from "./devis-interne/devis-interne_list/devis-interne.component";
import { ProjetEditComponent } from "./projet-edit/projet-edit.component";
import { CoutPrevisionnelComponent } from "./cout-previsionnel/cout-previsionnel.component";
import { CoutActualiseComponent } from "./cout-actualise/cout-actualise.component";
import { LivrablesProjetComponent } from "./livrables-projet/livrables-projet.component";
import { StatistiqueProjetComponent } from "./statistique-projet/statistique-projet.component";
import { DashboardHomeComponent } from "./dashboard-home/dashboard-home.component";
import { FacturationComponent } from "./facturation/facturation.component";

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
        path: ":id/edit",
        component: ProjetEditComponent,
      },

      {
        path: ":id/vue-ensemble",
        component: DashboardHomeComponent,
      },
      {
        path: ":id/fiche-identification",
        component: FicheIdentificationComponent,
      },
      {
        path: ":id/livrables",
        component: LivrablesProjetComponent,
      },
      {
        path: ":id/cout-actualise",
        component: CoutActualiseComponent,
      },
      {
        path: ":id/cout-previsionnel",
        component: CoutPrevisionnelComponent,
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
        component: FacturationComponent,
      },
      {
        path: ":id/statistique",
        component: StatistiqueProjetComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProjetsRoutingModule {}
