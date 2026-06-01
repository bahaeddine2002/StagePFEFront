import { Injectable } from "@angular/core";
import { ToastItem, ToastType } from "./toast.model";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class ToastService {
  private toastsSubject = new BehaviorSubject<ToastItem | null>(null);
  toasts$ = this.toastsSubject.asObservable();

  private clearTimeoutId: ReturnType<typeof setTimeout> | null = null;

  show(
    type: ToastType,
    title: string,
    message: string,
    duration: number = 4000,
  ): void {
    const newToast: ToastItem = {
      type,
      title,
      message,
    };

    this.toastsSubject.next(newToast);

    if (this.clearTimeoutId) {
      clearTimeout(this.clearTimeoutId);
    }

    this.clearTimeoutId = setTimeout(() => {
      this.clear();
    }, duration);
  }

  success(message: string, title: string = "Succès"): void {
    this.show("success", title, message, 4000);
  }

  error(message: string, title: string = "Erreur"): void {
    this.show("error", title, message, 5000);
  }

  clear(): void {
    this.toastsSubject.next(null);

    if (this.clearTimeoutId) {
      clearTimeout(this.clearTimeoutId);
      this.clearTimeoutId = null;
    }
  }
}
