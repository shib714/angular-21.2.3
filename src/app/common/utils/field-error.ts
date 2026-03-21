import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { FieldState } from '@angular/forms/signals';

@Component({
  selector: 'field-error',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (fieldState().invalid() && fieldState().touched()) {
      @for (error of fieldState().errors(); track error.kind) {
        <div>{{ error.message }}</div>
      }
    }
  `,
})
export class FieldError {
  fieldState = input.required<FieldState<any, any>>();
}
