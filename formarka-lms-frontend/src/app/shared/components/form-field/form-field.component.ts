import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';

@Component({
  selector: 'app-form-field',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="form-field">
      <label [for]="id" class="label">{{ label }}</label>
      <div class="input-container">
        <input 
          [id]="id"
          [type]="type"
          [formControl]="control"
          [placeholder]="placeholder"
          class="input"
          [class.error]="control.invalid && control.touched"
        />
      </div>
      <div class="error-message" *ngIf="control.invalid && control.touched">
        <span *ngIf="control.errors?.['required']">Este campo es requerido</span>
        <span *ngIf="control.errors?.['email']">Email no válido</span>
        <span *ngIf="control.errors?.['minlength']">Mínimo {{ control.errors?.['minlength'].requiredLength }} caracteres</span>
      </div>
    </div>
  `,
  styles: [`
    .form-field {
      margin-bottom: 20px;
      width: 100%;
    }

    .label {
      display: block;
      margin-bottom: 8px;
      font-weight: 500;
      color: var(--formarka-primary);
      font-size: 0.9rem;
    }

    .input {
      width: 100%;
      padding: 12px 16px;
      border: 1px solid #ddd;
      border-radius: 8px;
      font-size: 1rem;
      transition: border-color 0.3s ease;
      background-color: var(--formarka-white);
    }

    .input:focus {
      outline: none;
      border-color: var(--formarka-accent);
      box-shadow: 0 0 0 2px rgba(212, 175, 55, 0.1);
    }

    .input.error {
      border-color: #e74c3c;
    }

    .error-message {
      color: #e74c3c;
      font-size: 0.8rem;
      margin-top: 4px;
    }
  `]
})
export class FormFieldComponent {
  @Input({ required: true }) label!: string;
  @Input({ required: true }) control!: FormControl;
  @Input() id = 'input-' + Math.random().toString(36).substring(2, 9);
  @Input() type = 'text';
  @Input() placeholder = '';
}
