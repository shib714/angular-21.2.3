## ProfileForm Component Tests Documentation:

File Path: src/app/components/signal-form/profile/profile-form/profile-form.spec.ts

This documentation provides a comprehensive overview of the unit tests for the ProfileForm component.
To run this test, use the command:
```bash
ng test --include src/app/components/signal-form/profile/profile-form/profile-form.spec.ts --ui --coverage
````
## Overview:

These tests verify the behavior of the ProfileForm component, specifically focusing on its integration with @angular/forms/signals 
for complex validation logic, including cross-field validation, asynchronous HTTP-based validation, and conditional validation.    

## Test Environment Setup:

The tests are written using Vitest and the standard Angular Testing Utilities.

- Global Fetch Mocking: Since the component performs username availability checks via fetch (using validateHttp), vi.stubGlobal('fetch', vi.fn()) is used in beforeEach to prevent actual network requests and   vi.unstubAllGlobals() in afterEach to clean up.
- Component Initialization: The TestBed is configured with the ProfileForm component. fixture.whenStable() is called to ensure    
    initial signal evaluations and lifecycle hooks are completed.

Helper Functions
- delay(ms: number): A utility function used to simulate time passing. This is critical for testing the debounce behavior applied 
    to the userName field in the validation schema.

---

## Test Cases

1. Component Creation
- Objective: Ensure the component is correctly instantiated.
- Expectation: component should be truthy.
- Note: Currently uses it.only, indicating it's a focus point during development.

2. Initial Form State
- Objective: Verify that the form is invalid upon initialization since required fields (like firstName, lastName, password) are   
    empty.
- Expectation: component.profileForm().invalid() should return true.

3. Password Mismatch Validation (Cross-field)
- Objective: Verify the cross-field validation between password and confirmPassword.
- Steps:
    1. Set password to 'password123'.
    2. Set confirmPassword to a different string ('different123').
- Expectation: The confirmPassword field should be invalid and contain a passwordMismatch error kind.

4. Age Validation (Custom Logic)
- Objective: Verify the custom validation rule that requires the user to be at least 18 years old.
- Steps:
    1. Calculate a date string for exactly 10 years ago.
    2. Set dateOfBirth to this value.
- Expectation: The dateOfBirth field should be invalid and contain an underage error kind.

5. Username Availability (Async & Debounce)
Two tests cover the validateHttp and debounce logic for the userName field.

A. Username Taken
- Steps:
    1. Mock fetch to return an array containing a user (simulating a "taken" username).
    2. Set userName to 'Bret'.
    3. Wait for 600ms (exceeding the 500ms debounce).
    4. Call fixture.whenStable() to wait for the async HTTP resource to resolve.
- Expectation: The userName field should be invalid and contain a taken error kind.

B. Username Available
- Steps:
    1. Mock fetch to return an empty array.
    2. Set userName to 'NewUser'.
    3. Wait for 600ms and fixture.whenStable().
- Expectation: The userName field should be valid.

6. Conditional Emergency Contact Validation
- Objective: Verify that validation rules for emergency contact fields are only active when hasEmergencyContact is true.
- Steps:
    1. Set hasEmergencyContact to true.
    2. Check that emergencyContactName and emergencyContactPhone are now invalid (since they are now required).
    3. Provide valid values for both fields.
- Expectation: The fields should transition from invalid to valid once values are provided.

---

## Key Testing Patterns Demonstrated
- Signal Interaction: Direct manipulation of signal values within the form (form.field().value.set(...)).
- Async Handling: Using await delay(...) combined with await fixture.whenStable() to handle debounced and HTTP-based async        
    validations.
- Mocking External APIs: Using vi.stubGlobal to mock the browser's fetch API.
- Error Checking: Using toContainEqual(expect.objectContaining({ kind: '...' })) to verify specific validation error types defined
    in the schema.
