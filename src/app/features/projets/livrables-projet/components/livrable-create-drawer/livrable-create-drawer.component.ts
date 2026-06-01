import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

import { LivrableCreateRequest } from "../../../models/livrable-projet.model";

@Component({
  selector: "app-livrable-create-drawer",
  templateUrl: "./livrable-create-drawer.component.html",
  styleUrls: ["./livrable-create-drawer.component.css"],
})
export class LivrableCreateDrawerComponent implements OnInit {
  @Input() isSaving = false;

  @Output() closed = new EventEmitter<void>();
  @Output() saved = new EventEmitter<LivrableCreateRequest>();

  form!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      designation: ["", [Validators.required, Validators.maxLength(500)]],
      dateLivraisonPrevue: [null, Validators.required],
    });
  }

  save(): void {
    if (this.form.invalid || this.isSaving) {
      this.form.markAllAsTouched();
      return;
    }

    const payload: LivrableCreateRequest = {
      designation: this.form.value.designation?.trim(),
      dateLivraisonPrevue: this.form.value.dateLivraisonPrevue,
    };

    this.saved.emit(payload);
  }

  close(): void {
    this.closed.emit();
  }

  get canSave(): boolean {
    return this.form.valid && !this.isSaving;
  }
}
