import { ComponentFixture, TestBed } from '@angular/core/testing';
import { form } from '@angular/forms/signals';
import { PreferencesForm } from './preferences-form';
import { createPreferencesModel, buildPreferencesSection } from './preferences';

describe('PreferencesForm', () => {
  let component: PreferencesForm;
  let fixture: ComponentFixture<PreferencesForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreferencesForm],
    }).compileComponents();

    fixture = TestBed.createComponent(PreferencesForm);
    component = fixture.componentInstance;

    // Provide the required input
        //stricter  
  //required input checks introduced in the updated version of      
  //@angular/forms/signals
    const preferencesForm = TestBed.runInInjectionContext(() => form(createPreferencesModel(), buildPreferencesSection));
    fixture.componentRef.setInput('form', preferencesForm);

    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

