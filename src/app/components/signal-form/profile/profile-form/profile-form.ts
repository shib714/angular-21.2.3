import { provideNativeDateAdapter } from '@angular/material/core';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Profile, defaultProfile, profileValidationSchema } from '../profile';
import { form, FormField, submit } from '@angular/forms/signals';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule, MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { FieldError } from '../../../../common/utils/field-error';


@Component({
  selector: 'profile-form',
  imports: [
    FormField,
    FieldError,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatCheckboxModule,
    MatDatepickerModule,
    CommonModule
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './profile-form.html',
  styleUrl: './profile-form.scss',
  changeDetection: ChangeDetectionStrategy.OnPush

})
export class ProfileForm {

  profileModel = signal<Profile>(defaultProfile);
  profileForm = form(this.profileModel, profileValidationSchema);

  cancel(): void {
    // Reset form (or navigate to another page)
    this.profileForm().reset(defaultProfile);
  }

  saveProfile(): void {
    submit(this.profileForm, () =>
      this.onSubmit());
  }

  async onSubmit() {
    // Submit to the server
    console.log('Submitting data to server:', this.profileForm().value());
    // Reset form (or navigate to another page)
    this.profileForm().reset(defaultProfile);
  }

  onDateChange(event: MatDatepickerInputEvent<Date>): void {
    const selectedDate = event.value;
    if (selectedDate) {
      // Format the date to YYYY-MM-DD string
      const formattedDate = selectedDate.toISOString().slice(0, 10);
      this.profileModel.update(model => ({
        ...model,
        dateOfBirth: formattedDate
      }));
    } else {
      this.profileModel.update(model => ({
        ...model,
        dateOfBirth: ''
      }));
    }
  }
}
