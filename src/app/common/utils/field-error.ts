import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { FieldState } from '@angular/forms/signals';

@Component({
  selector: 'field-error',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!--displays errors when fieldState().touched() is true, which typically occurs on blur
    If pending() becomes false and touched() is also false, the "Checking availability..." message disappears 
    without showing the "taken" error

    show errors when the field is either touched() or dirty(). This ensures async errors appear immediately 
    upon typing, while still hiding initial errors on empty fields until the user interacts with them.
    Please see: https://angular.dev/guide/forms/signals/field-state-management
    -->
    @if (fieldState().invalid() && (fieldState().touched() || fieldState().dirty())) {
      @for (error of fieldState().errors(); track error.kind) {
        <div>{{ error.message }}</div>
      }
    }
  `,
})
export class FieldError {
  fieldState = input.required<FieldState<any, any>>();
}
