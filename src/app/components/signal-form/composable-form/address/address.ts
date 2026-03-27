import { signal } from "@angular/core";
import { SchemaPathTree, pattern, required } from "@angular/forms/signals";

export interface Address {
  street: string;
  city: string;
  state: string;
  zip: string;
}

export function createAddressModel() {
  return signal<Address>({
    street: '',
    city: '',
    state: '',
    zip: '',
  })
}

//create the schema pattern for validation
export function buildAddressSection(a: SchemaPathTree<Address>) {
  required(a.street, { message: 'Street is required' });
  required(a.city, { message: 'City is required' });
  required(a.state, { message: 'State is required' });
  required(a.zip, { message: 'ZIP code is required' });
  pattern(a.zip, /^\d{5}$/, { message: 'ZIP code must be 5 digits' });
}