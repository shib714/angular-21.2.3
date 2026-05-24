import { ComponentFixture, TestBed } from '@angular/core/testing';
import { form } from '@angular/forms/signals';
import { AccountForm } from './account-form';
import { createAccountModel, buildAccountSection } from './account';

describe('AccountForm', () => {
  let component: AccountForm;
  let fixture: ComponentFixture<AccountForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountForm],
    }).compileComponents();

    fixture = TestBed.createComponent(AccountForm);
    component = fixture.componentInstance;

    // Provide the required input
    /**
     * fixture.componentRef.setInput('form',                │    
│    * form(createAccountModel(), buildAccountSection)); 
     * stricter required input checks introduced in the updated version of      
     * @angular/forms/signals
     */
    const accountForm = TestBed.runInInjectionContext(() => form(createAccountModel(), buildAccountSection));
    fixture.componentRef.setInput('form', accountForm);

    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
