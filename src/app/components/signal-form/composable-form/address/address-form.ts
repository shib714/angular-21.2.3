import { Component, input } from '@angular/core';
import { FieldTree, FormField } from '@angular/forms/signals';
import { Address } from './address';
import { FieldError } from '../../../../common/utils/field-error';

@Component({
  selector: 'address-form',
  imports: [FormField, FieldError],
  template: ` 
  <div class='form'>
    <h3>Shipping Address</h3>
    <div class='form-group'>
      <label for='street'>Street <input [formField]="form().street" type='text' /></label>
      <field-error [fieldState]="form().street()"></field-error>
        <div class='row'>
          <label for='city'>City <input [formField]="form().city" type='text' /></label>
          <field-error [fieldState]="form().city()"></field-error>
          <label for='state'>State <input [formField]="form().state" type='text' /></label>
          <field-error [fieldState]="form().state()"></field-error>
          <label for='zip'>ZIP <input [formField]="form().zip" type='text' /></label>
          <field-error [fieldState]="form().zip()"></field-error>
        </div>
    </div>
  </div>
`,
  styles: ``,
})
export class AddressForm {
  //add an input called form as a field tree using the Address interface
  //this tells angular that this component only cares about the address slice
  readonly form = input.required<FieldTree<Address>>();

}
