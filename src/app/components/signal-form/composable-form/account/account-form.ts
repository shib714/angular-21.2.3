import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FieldTree, FormField } from "@angular/forms/signals";
import { FieldError } from "../../../../common/utils/field-error";
import { Account } from './account';

@Component({
  selector: 'account-form',
  imports: [FormField, FieldError],
  template: ` 
  <div class='form'>
    <h3>Account Information</h3>
    <div class='form-group'>
      <label for='firstName'>First Name <input [formField]="form().firstName" type='text' /></label>
      <field-error [fieldState]="form().firstName()"></field-error>
      <label for='lastName'>Last Name <input [formField]="form().lastName" type='text' /></label>
      <field-error [fieldState]="form().lastName()"></field-error>
    </div>
  </div>
  
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountForm {
    //add an input called form as a field tree using the Account interface
  //this tells angular that this component only cares about the account slice
  readonly form = input.required<FieldTree<Account>>();
}
