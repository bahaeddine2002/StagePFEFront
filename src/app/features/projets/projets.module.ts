import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SharedModule } from "src/app/shared/shared.module";
import { ProjetsRoutingModule } from "./projets-routing.module";
import { ProjetsListComponent } from "./projects-list-page/projects-list.component";
import { ProjetPagePlaceholderComponent } from "./projet-page-placeholder/projet-page-placeholder.component";
import { ProjectCreateComponent } from "./project-create/project-create.component";
import { FicheIdentificationComponent } from "./fiche-identification/fiche-identification.component";
import { ConfirmCreateDiDialogComponent } from "./devis-interne/components/confirm-create-di-dialog/confirm-create-di-dialog.component";
import { DevisInterneComponent } from "./devis-interne/devis-interne_list/devis-interne.component";
import { HonoraireLineDrawerComponent } from './devis-interne/components/honoraire-line-drawer/honoraire-line-drawer.component';
import { HonoraireLineDetailsDrawerComponent } from './devis-interne/components/honoraire-line-details-drawer/honoraire-line-details-drawer.component';
import { ProjetEditComponent } from './projet-edit/projet-edit.component';
import { CoutPrevisionnelComponent } from './cout-previsionnel/cout-previsionnel.component';

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
  ],
})
export class ProjetsModule {}
