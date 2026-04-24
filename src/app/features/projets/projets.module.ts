import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SharedModule } from "src/app/shared/shared.module";
import { ProjetsRoutingModule } from "./projets-routing.module";
import { ProjetsListComponent } from "./projects-list-page/projects-list.component";

@NgModule({
  imports: [CommonModule, SharedModule, ProjetsRoutingModule],
  declarations: [ProjetsListComponent],
})
export class ProjetsModule {}
