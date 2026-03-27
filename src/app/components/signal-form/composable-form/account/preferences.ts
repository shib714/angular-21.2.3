import { signal } from "@angular/core";
import { required, SchemaPathTree } from "@angular/forms/signals";

export interface Preferences {
  marketingOptIn: boolean;
}

export function createPreferencesModel() {
  return signal<Preferences>({
    marketingOptIn: true,
  })
}


//create the schema pattern for validation
export function buildPreferencesSection(s: SchemaPathTree<Preferences>) {
  //required(s.marketingOptIn, {message: 'First name is required'})
  //no local validation for preferences
}