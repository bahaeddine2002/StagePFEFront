import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SharedModule } from "src/app/shared/shared.module";
import { ProjetsRoutingModule } from "./projets-routing.module";
import { ProjetsListComponent } from "./projects-list-page/projects-list.component";
import { ProjetPagePlaceholderComponent } from "./projet-page-placeholder/projet-page-placeholder.component";
import { ProjectCreateComponent } from "./project-create/project-create.component";
import { FicheIdentificationComponent } from "./fiche-identification/fiche-identification.component";
import { DevisInterneComponent } from "./devis-interne/devis-interne_list/devis-interne.component";

@NgModule({
  imports: [CommonModule, SharedModule, ProjetsRoutingModule],
  declarations: [
    ProjetsListComponent,
    ProjetPagePlaceholderComponent,
    ProjectCreateComponent,
    FicheIdentificationComponent,
    DevisInterneComponent,
  ],
})
export class ProjetsModule {}
