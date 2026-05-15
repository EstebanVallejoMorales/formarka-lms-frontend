import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button 
      [type]="type" 
      [disabled]="disabled || loading"
      [class]="'btn btn-' + variant"
      (click)="onClick.emit($event)">
      <span *ngIf="loading" class="spinner"></span>
      <span *ngIf="!loading"><ng-content></ng-content></span>
    </button>
  `,
  styles: [`
    .btn {
      padding: 12px 32px;
      border-radius: 50px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      border: none;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 1rem;
      width: 100%;
      min-height: 48px;
      font-family: var(--font-main);
    }

    .btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .btn-primary {
      background: linear-gradient(90deg, var(--formarka-primary), var(--formarka-accent));
      color: var(--formarka-white);
      box-shadow: 0 4px 15px rgba(128, 18, 246, 0.2);
    }

    .btn-primary:hover:not(:disabled) {
      background: linear-gradient(90deg, var(--formarka-accent), var(--formarka-primary));
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(128, 18, 246, 0.3);
    }

    .btn-outline {
      background-color: transparent;
      border: 2px solid var(--formarka-primary);
      color: var(--formarka-primary);
    }

    .btn-outline:hover:not(:disabled) {
      background-color: var(--formarka-primary);
      color: var(--formarka-white);
    }

    .spinner {
      width: 20px;
      height: 20px;
      border: 3px solid rgba(255,255,255,.3);
      border-radius: 50%;
      border-top-color: #fff;
      animation: spin 1s ease-in-out infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `]
})
export class ButtonComponent {
  @Input() type: 'button' | 'submit' = 'button';
  @Input() variant: 'primary' | 'outline' = 'primary';
  @Input() disabled = false;
  @Input() loading = false;
  @Output() onClick = new EventEmitter<MouseEvent>();
}
