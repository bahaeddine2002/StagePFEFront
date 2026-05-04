import { Injectable } from "@angular/core";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { ComponentType } from "@angular/cdk/portal";

@Injectable({
  providedIn: "root",
})
export class AppDrawerService {
  constructor(private dialog: MatDialog) {}

  open<TComponent, TData = unknown, TResult = unknown>(
    component: ComponentType<TComponent>,
    data?: TData,
    width: string = "600px",
  ): MatDialogRef<TComponent, TResult> {
    return this.dialog.open<TComponent, TData, TResult>(component, {
      data,
      width,
      maxWidth: "100vw",
      height: "100vh",
      maxHeight: "100vh",

      position: {
        right: "0",
        top: "0",
      },

      panelClass: "right-drawer-dialog",
      backdropClass: "app-drawer-backdrop",

      hasBackdrop: true,
      autoFocus: false,
      restoreFocus: false,
      disableClose: false,
    });
  }
}
