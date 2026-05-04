import { Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
  selector: "app-drawer-shell",
  templateUrl: "./app-drawer-shell.component.html",
  styleUrls: ["./app-drawer-shell.component.css"],
})
export class AppDrawerShellComponent {
  @Input() title = "";
  @Input() subtitle = "";

  @Output() closed = new EventEmitter<void>();

  close(): void {
    this.closed.emit();
  }
}
