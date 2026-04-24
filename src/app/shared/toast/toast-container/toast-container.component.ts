import { Component, inject, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { ToastItem } from "../toast.model";
import { ToastService } from "../toast.service.ts.service";

@Component({
  selector: "app-toast-container",
  templateUrl: "./toast-container.component.html",
  styleUrls: ["./toast-container.component.css"],
})
export class ToastContainerComponent implements OnInit {
  private toastService = inject(ToastService);
  toast: ToastItem | null = null;

  constructor() {}

  ngOnInit(): void {
    this.toastService.toasts$.subscribe((data: ToastItem | null) => {
      this.toast = data;
    });
  }

  remove(): void {
    this.toastService.clear();
  }
}
