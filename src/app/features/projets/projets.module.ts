import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SharedModule } from "src/app/shared/shared.module";
import { ProjetsRoutingModule } from "./projets-routing.module";
import { ProjetsListComponent } from "./projects-list-page/projects-list.component";
import { ProjetPagePlaceholderComponent } from "./projet-page-placeholder/projet-page-placeholder.component";
import { ProjectCreateComponent } from "./project-create/project-create.component";
import { FicheIdentificationComponent } from "./fiche-identification/fiche-identification.component";
import { ConfirmCreateDiDialogComponent } from "./devis-interne/components/confirm-create-di-dialog/confirm-create-di-dialog.component";
import { DevisInterneComponent } from "./devis-interne/devis-interne_list/devis-interne.component";
import { HonoraireLineDrawerComponent } from "./devis-interne/components/honoraire-line-drawer/honoraire-line-drawer.component";
import { HonoraireLineDetailsDrawerComponent } from "./devis-interne/components/honoraire-line-details-drawer/honoraire-line-details-drawer.component";
import { ProjetEditComponent } from "./projet-edit/projet-edit.component";
import { CoutPrevisionnelComponent } from "./cout-previsionnel/cout-previsionnel.component";
import { CoutActualiseComponent } from "./cout-actualise/cout-actualise.component";
import { LivrablesProjetComponent } from "./livrables-projet/livrables-projet.component";
import { LivrableCreateDrawerComponent } from "./livrables-projet/components/livrable-create-drawer/livrable-create-drawer.component";
import { StatistiqueProjetComponent } from "./statistique-projet/statistique-projet.component";
import { DashboardHomeComponent } from "./dashboard-home/dashboard-home.component";
import { FacturationComponent } from "./facturation/facturation.component";
import { FacturationEcheanceFormDrawerComponent } from "./facturation/facturation-echeance-form-drawer/facturation-echeance-form-drawer.component";
import { FacturationEcheanceDetailsDrawerComponent } from './facturation/facturation-echeance-details-drawer/facturation-echeance-details-drawer.component';

@NgModule({
  imports: [CommonModule, SharedModule, ProjetsRoutingModule],
  declarations: [
    ProjetsListComponent,
    ProjetPagePlaceholderComponent,
    ProjectCreateComponent,
    FicheIdentificationComponent,
    DevisInterneComponent,
    ConfirmCreateDiDialogComponent,
    HonoraireLineDrawerComponent,
    HonoraireLineDetailsDrawerComponent,
    ProjetEditComponent,
    CoutPrevisionnelComponent,
    CoutActualiseComponent,
    LivrablesProjetComponent,
    LivrableCreateDrawerComponent,
    StatistiqueProjetComponent,
    DashboardHomeComponent,
    FacturationComponent,
    FacturationEcheanceFormDrawerComponent,
    FacturationEcheanceDetailsDrawerComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ProjetsModule {}
