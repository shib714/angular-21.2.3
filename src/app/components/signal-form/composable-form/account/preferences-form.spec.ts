import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreferenceForm } from './preferences-form';

describe('PreferenceForm', () => {
  let component: PreferenceForm;
  let fixture: ComponentFixture<PreferenceForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreferenceForm],
    }).compileComponents();

    fixture = TestBed.createComponent(PreferenceForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
