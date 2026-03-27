import { Component, signal } from '@angular/core';
import { AccountForm } from '../account/account-form';
import { PreferencesForm } from '../account/preferences-form';
import { AddressForm } from '../address/address-form';
import { DebugPanel } from '../shared/debug-panel';
import { Account, buildAccountSection, createAccountModel } from '../account/account';
import { buildPreferencesSection, createPreferencesModel, Preferences } from '../account/preferences';
import { Address, buildAddressSection, createAddressModel } from '../address/address';
import { form, submit } from '@angular/forms/signals';
import { CommonModule } from '@angular/common';

export interface Profile {
  account: Account;
  shippingAddress: Address;
  preferences: Preferences;
}

@Component({
  selector: 'profile-form',
  imports: [AccountForm, AddressForm, PreferencesForm, DebugPanel, CommonModule],
  template: ` 
  <h1>Signal based Composable Form</h1>
  <div class='container'>
    <form (submit)= 'onSubmit($event)'>
      <account-form [form]='form.account'/>
      <address-form [form]='form.shippingAddress'/>
      <preferences-form [form]='form.preferences'/>
      <button type='submit' [disabled]="!form().valid()">Submit</button>
    </form>
    <debug-panel [form]='form()'/>      
  </div>
  `,
  styleUrl: './profile-form.scss',
})
//This is the parent form for account, preferences, address
export class ProfileForm {

  // Create the parent model by composing all the pieces
  readonly model = signal<Profile>({
    account: createAccountModel()(),
    shippingAddress: createAddressModel()(),
    preferences: createPreferencesModel()()
  });

  // Compose the form using section builders
  readonly form = form(this.model, s => {
    // Build each section using their respective builders
    buildAccountSection(s.account);
    buildAddressSection(s.shippingAddress);
    buildPreferencesSection(s.preferences);
  });

  protected onSubmit(event: SubmitEvent): void {
    event.preventDefault();
    //form can only be submitted when it is valid
    submit(this.form, async data =>{
      console.log('Form submitted', data().value());
      return undefined;
    });    
  }
}