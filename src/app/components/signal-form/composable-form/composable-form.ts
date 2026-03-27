import { Component } from '@angular/core';
import { ProfileForm } from './sign-up/profile-form';



@Component({
  selector: 'composable-form',
  imports: [ProfileForm],
  template: `<profile-form />`
})
export class ComposableForm {
}