import {Component, EventEmitter, Output} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss'
})
export class FormComponent {
  @Output() formUpdate = new EventEmitter<FormGroup>();
  form!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      date: ['', Validators.required],
      seller: ['', [Validators.required, Validators.minLength(2), Validators.pattern(/^[a-zA-Z\s]+$/)]],
      school: ['', [Validators.required, Validators.minLength(2)]],
      buyer: this.fb.group({
        company: ['', [Validators.required, Validators.minLength(2)]],
        reference: ['', Validators.minLength(2)],
        orgNumber: ['', [ Validators.pattern(/^\d{6}-\d{4}$/)]],
        email: ['', [Validators.required, Validators.email]],
        address: ['', [Validators.required, Validators.minLength(2)]],
        postalCode: ['', [Validators.required, Validators.pattern(/^\d{5}$/)]],
        city: ['', Validators.required]
      })
    });

    this.form.valueChanges.subscribe(() => {
      this.formUpdate.emit(this.form);
    });
  }

  get buyer() {
    return this.form.get('buyer');
  }
}
