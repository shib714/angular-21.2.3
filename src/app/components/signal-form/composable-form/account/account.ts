import { signal } from "@angular/core";
import { SchemaPathTree, required } from "@angular/forms/signals";

//For details: https://www.youtube.com/watch?v=hgy3t9mFmuc&t=35s


export interface Account {
    firstName: string;
    lastName: string;
}

export function createAccountModel() {
    return signal<Account>({
        firstName: "",
        lastName: "",
    });
}

export function buildAccountSection(s: SchemaPathTree<Account>) {
    required(s.firstName, {message: 'First name is required'});
    required(s.lastName, {message: 'Last name is required'});

}