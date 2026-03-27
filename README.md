# Angular21.2.3
This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.2.3.
- Demonstrates the use of Angular Signal form (Profile Form).
- The Profile form model is an interface with the following constract:
```bash
export interface Profile {
    userName: string,
    firstName: string,
    lastName: string,
    dateOfBirth: string,
    password: string,
    confirmPassword: string,
    hasEmergencyContact: boolean,
    emergencyContactName: string,
    emergencyContactPhone: string,
}

```
-  Each field in the form has it's own validation rule demonstrating various validation techniques and custom validation ( such as required, min(), minLength(), pattern(), validate(), validateTree(),cross-field validation) including username validation implemented using new validateHttp() against remote REST API end point https://jsonplaceholder.typicode.com/users
-  Form submission logic 
-  Shopping Cart example with unit tests

## Composable Signal Form
An overview of the Signal-based Composable Form architecture implemented in the src/app/components/signal-form/composable-form/ directory.
This application demonstrates a modern, type-safe, and highly modular approach to building complex forms using Signal-based Forms API (@angular/forms/signals).

Core Philosophy

Traditional Angular forms (Reactive and Template-driven) often lead to monolithic components when dealing with large datasets. This architecture solves that by:
   1. Slicing the Form: Breaking a large form into small, self-contained components that only care about their specific slice of the data.
   2. Decoupling Validation: Defining validation logic (Schemas) separately from the UI components.
   3. Full Signal Integration: Leveraging Angular Signals for reactivity, ensuring efficient OnPush change detection and fine-grained updates.

Architecture Overview

  1. Domain Models & Schema Builders
  Each form section (Account, Address, Preferences) is defined by three elements in its own domain file (e.g., account.ts):

   * Interface: Defines the shape of the data.
   * Model Creator: A function that returns a Signal with initial values.
   * Section Builder: A function that takes a SchemaPathTree<T> to define validation rules (e.g., required, pattern).

   Example: account.ts
   ```bash
    export interface Account { ... }
    export function createAccountModel() { ... }
    export function buildAccountSection(s: SchemaPathTree<Account>) {
        required(s.firstName, { message: 'First name is required' });
    }
    ```

  2. Sub-Form Components
  Sub-forms are "dumb" components. They receive their specific slice of the form tree via a required input and use the [formField] directive to bind to inputs.

   * Input-Only: They don't manage the global form state; they receive a FieldTree<T>.
   * Scoped: They only have access to the fields they are responsible for.
   * Reusable: These components can be reused in different parent forms as long as the data interface matches.

   1 export class AccountForm {
   2     readonly form = input.required<FieldTree<Account>>();
   3 }

  3. The Parent Orchestrator (ProfileForm)
  The ProfileForm is the "smart" component that composes everything:

   1. Composed Model: It creates a single parent model signal by combining sub-models.
   2. Form Definition: It uses the form() function to initialize the Signal Form, calling the individual Section Builders to apply validation rules to the entire tree.
   3. Template Binding: It passes slices of the form tree down to the sub-components using property binding (e.g., [form]="form.account").

```bash
    export class ProfileForm {
      readonly model = signal<Profile>({ ... });
 
      readonly form = form(this.model, s => {
        buildAccountSection(s.account);
        buildAddressSection(s.shippingAddress);
       // ...
      });
    }
```

  Key Features

  Type Safety
  Because the forms are signal-based and use TypeScript interfaces, the form object in the parent component is strictly typed. Accessing form.account or form.shippingAddress is safe, and the IDE provides   
  full autocompletion for nested fields.

  Global Validity and Submission
  The parent component has access to the aggregate validity of the entire form. The submit() utility ensures that the submission logic only executes if every sub-section passes its validation rules.

  Debugging Utilities
  The DebugPanel component demonstrates how easily you can subscribe to the entire form state. By passing form() (the FieldState), the panel can reactively display the current JSON value and the global
  validity status.

  Directory Structure

   1 composable-form/
   2 ├── account/            # Account section logic & UI
   3 ├── address/            # Address section logic & UI
   4 ├── shared/             # Shared UI (DebugPanel)
   5 ├── sign-up/            # Main orchestrator (ProfileForm)
   6 └── composable-form.ts  # Feature entry point

  How to Add a New Section

   1. Define the Model: Create a new directory and a .ts file defining the interface, initial signal, and section builder.
   2. Create the Sub-Form: Generate a component that takes input.required<FieldTree<YourNewType>>() and bind your inputs.
   3. Integrate: 
       * Add the new interface to the Profile interface in profile-form.ts.
       * Include the new model in the model signal.
       * Call the new section builder inside the form() initialization.
       * Add the sub-form component to the ProfileForm template and pass the corresponding form slice.

## Development server

To start a local development server, run:

```bash
ng serve
```
OR
```bash
npm start
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:
```bash
ng generate --help
```
## Building
To build the project run:
```bash
ng build
```
This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests
To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:
```bash
ng test
```
## Run a single test file
Pass the path to the specific .spec.ts file:
```bash
ng test --include src/app/app.spec.ts
```
## Additional test options
Run once and exit (No watch mode):
```bash
ng test --include src/app/app.spec.ts --no-watch
```
## Run a specific test case or suite:
Use the --filter flag to match a specific test or suite name (regex):
```bash
ng test --filter "AppComponent"
```
## Open Vitest UI:
- If you want an interactive UI to select and run tests (you may need to install :@vitest/ui for the first time if it is not installed already)
```bash
ng test --ui
```
## Run tests with a code coverage report 
- The command below  will run all tests and generate a coverage report (usually in a coverage/ directory). The first time you run with --coverage, you might be prompted to install a coverage provider. Run npm install -D @vitest/coverage-v8 to install it. 
```bash
ng test --coverage
```
To include/exclude files: Filter which files are included in the coverage calculation.
```bash
ng test --coverage --coverage-include "src/app/services/**" --coverage-exclude "**/*.spec.ts"
```
## Running end-to-end tests

For end-to-end (e2e) testing, run:
```bash
ng e2e
```
Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.
## Additional Resources
For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
