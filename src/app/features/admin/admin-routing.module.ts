import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { LayoutComponent } from "src/app/shared/layout/layout.component";
import { UserCreateComponent } from "./user-create/user-create.component";
import { RolesComponent } from "./roles/roles.component";
import { UsersComponent } from "./users/users.component";
import { RoleCreateComponent } from "./role-create/role-create.component";
import { TccReferentielComponent } from "./tcc/tcc-referentiel/tcc-referentiel.component";

const routes: Routes = [
  {
    path: "",
    component: LayoutComponent,
    children: [
      { path: "roles/create", component: RoleCreateComponent },
      { path: "roles", component: RolesComponent },
      { path: "utilisateurs", component: UsersComponent },
      { path: "utilisateurs/create", component: UserCreateComponent },
      {
        path: "tcc",
        component: TccReferentielComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
