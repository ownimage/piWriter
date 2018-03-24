# PiWriter - editor
This is the editor build folder.  
Once development is fixed at a given release build the code, which will create the dist folder.
This will be picked up by the server (in the parent folder) and served.

## Install
Run 
``` 
npm i
```
## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run 
```
ng build --prod --aot --base-href http://localhost:3000/app/
```
to build the project. The build artifacts will be stored in the `dist/` directory. 
Note that there is a trailing space and the that URL needs to point to the Raspberry Pi WiFi access point

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
