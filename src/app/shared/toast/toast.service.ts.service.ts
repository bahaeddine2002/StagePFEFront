import { Injectable } from "@angular/core";
import { ToastItem, ToastType } from "./toast.model";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class ToastService {
  private toastsSubject = new BehaviorSubject<ToastItem | null>(null);
  constructor() {}
  toasts$ = this.toastsSubject.asObservable();

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
  }

  success(message: string, title: string = "Succes"): void {
    this.show("success", title, message, 4000);
  }

  error(message: string, title: string = "Erreur"): void {
    this.show("error", title, message, 5000);
  }

  clear(): void {
    this.toastsSubject.next(null);
    console.log("value after cleared", this.toastsSubject.value);
  }
}
