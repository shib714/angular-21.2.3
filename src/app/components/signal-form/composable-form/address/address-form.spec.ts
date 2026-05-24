import { ComponentFixture, TestBed } from '@angular/core/testing';
import { form } from '@angular/forms/signals';
import { AddressForm } from './address-form';
import { createAddressModel, buildAddressSection } from './address';

describe('AddressForm', () => {
  let component: AddressForm;
  let fixture: ComponentFixture<AddressForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddressForm],
    }).compileComponents();

    fixture = TestBed.createComponent(AddressForm);
    component = fixture.componentInstance;
    
    // Provide the required input
        //stricter  
  //required input checks introduced in the updated version of      
  //@angular/forms/signals
    const addressForm = TestBed.runInInjectionContext(() => form(createAddressModel(), buildAddressSection));
    fixture.componentRef.setInput('form', addressForm);
    
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
