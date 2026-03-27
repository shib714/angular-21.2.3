import { Component, input } from '@angular/core';
import { FieldTree, FormField } from '@angular/forms/signals';
import { Preferences } from './preferences';
import { FieldError } from '../../../../common/utils/field-error';

@Component({
  selector: 'preferences-form',
  imports: [FormField, FieldError],
  template: ` 
  <div class='form'>
    <h3>Preferences</h3>
    <div class='form-group'>
      <label for='marketingOptIn' class='checkbox-label'>
        <input [formField]="form().marketingOptIn" type='checkbox' />
        <span>Receive marketing emails</span>
      </label>
      <field-error [fieldState]="form().marketingOptIn()"></field-error>
    </div>
  </div>
      `,
  styles: ``,
})
export class PreferencesForm {
  //add an input called form as a field tree using the Preferences interface
  //this tells angular that this component only cares about the address slice
  readonly form = input.required<FieldTree<Preferences>>();
}
