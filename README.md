# Opentok Application

A basic video chat application using Angular 8 and OpenTok. This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 8.3.0.

## Important!

## Running the App

### Setting your OpenTok apiKey, sessionId and token

Before you can run this application you need to modify [virtual-health.ts](src/app/constants/virtual-health.ts) and include your OpenTok API Key. For more details on how to get these values see [Token creation
overview](https://tokbox.com/opentok/tutorials/create-token/).

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/join/:yourSessionId/:yourToken/:userEmailToDisplay`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use below commands to do the specific build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
