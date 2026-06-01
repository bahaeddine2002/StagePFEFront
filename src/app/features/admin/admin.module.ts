import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AdminRoutingModule } from "./admin-routing.module";
import { RolesComponent } from "./roles/roles.component";
import { SharedModule } from "src/app/shared/shared.module";
import { UsersComponent } from "./users/users.component";
import { RoleCreateComponent } from "./role-create/role-create.component";
import { UserCreateComponent } from "./user-create/user-create.component";
import { CoreModule } from "src/app/core/core.module";
import { ReactiveFormsModule } from "@angular/forms";
import { MatChipsModule } from "@angular/material/chips";
import { TccReferentielComponent } from "./tcc/tcc-referentiel/tcc-referentiel.component";
import { OrganisationsListComponent } from "./organisations/organisations-list/organisations-list.component";

@NgModule({
  declarations: [
    RolesComponent,
    UsersComponent,
    RoleCreateComponent,
    UserCreateComponent,
    TccReferentielComponent,
    OrganisationsListComponent,
  ],
  imports: [
    CommonModule,
    MatChipsModule,
    AdminRoutingModule,
    SharedModule,
    ReactiveFormsModule,
  ],
})
export class AdminModule {}
