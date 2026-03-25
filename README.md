# Angular2123

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
# Run a single test file
- Pass the path to the specific .spec.ts file:
```bash
ng test --include src/app/app.spec.ts
```
# Additional options

- Run once and exit (No watch mode):
```bash
ng test --include src/app/app.spec.ts --no-watch
```
# Run a specific test case or suite:
Use the --filter flag to match a specific test or suite name (regex):
```bash
ng test --filter "AppComponent"
```
# Open Vitest UI:
- If you want an interactive UI to select and run tests (install :@vitest/ui)
```bash
ng test --ui
```
# Run tests with a code coverage report 
- The first time you run with --coverage, you might be prompted to install a coverage provider. Run npm install -D @vitest/coverage-v8
```bash
ng test --coverage
```
- Include/Exclude files: Filter which files are included in the coverage calculation.

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
