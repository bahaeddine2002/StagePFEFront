import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";

@Component({
  selector: "app-confirm-create-di-dialog",
  templateUrl: "./confirm-create-di-dialog.component.html",
  styleUrls: ["./confirm-create-di-dialog.component.css"],
})
export class ConfirmCreateDiDialogComponent {
  constructor(
    private dialogRef: MatDialogRef<ConfirmCreateDiDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      codeProjet?: string | null;
    },
  ) {}

  cancel(): void {
    this.dialogRef.close(false);
  }

  confirm(): void {
    this.dialogRef.close(true);
  }
}
