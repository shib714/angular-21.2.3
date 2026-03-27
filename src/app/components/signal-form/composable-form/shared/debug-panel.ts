import { Component, input, computed } from '@angular/core';
import { FieldState } from '@angular/forms/signals';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'debug-panel',
  template: `
    <div class="debug">   
       <h3>Debug Output</h3>
      <div class="debug-section">
          <strong>Form Fields Value:</strong>
          <pre>{{ formValue() | json }}</pre>
      </div>
      <div class="debug-section">
        <strong>Form validity status:</strong>
        <span [class.valid]="formValid()" [class.invalid]="!formValid()">
        {{ formValid() }}
        </span>
      </div>
  </div>
  `,
  styleUrl: './debug-panel.scss',
  imports: [CommonModule]
})
export class DebugPanel {
  readonly form = input.required<FieldState<unknown>>();
  readonly formValue = computed(() => this.form().value());
  readonly formValid = computed(() => this.form().valid());
}