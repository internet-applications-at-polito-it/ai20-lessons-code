import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, ValidatorFn, ValidationErrors } from '@angular/forms';

import { filter, tap, map } from 'rxjs/operators';


// tslint:disable-next-line:import-blacklist
// import 'rxjs/Rx';

function forbiddenNameValidator(nameRe: RegExp) {
  return (control) => {
    const forbidden = nameRe.test(control.value);
    console.log(`is this name ${control.value} forbidden? ${forbidden}`);
    return forbidden ? { forbiddenName: { value: control.value } } : null;
  };
}

/** A hero's name can't match the hero's alter ego */
function fakeNameValidator(control: FormGroup): ValidationErrors | null {
  const firstName = control.get('lastName');
  const lastName = control.get('firstName');

  const ret = lastName && firstName && lastName.value === firstName.value ? { fakeName: true } : null;
  // if (ret) { console.log(`${firstName.value} === ${lastName.value}`); }
  console.log(`are firstName and lastName equal? ${firstName.value} === ${lastName.value} ${firstName.value === lastName.value}`);

  return ret;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'L10-angular-forms-E40-reactive';

  public user;

  constructor(private fb: FormBuilder) {

    this.profileForm.valueChanges.pipe(
      filter( () => this.profileForm.valid ),
      tap(formValue => console.log('Valuechanges: ' + JSON.stringify(formValue)) ),
      map(value => this.user = { firstName: value.firstName, lastName: value.lastName, date: new Date() }),
    ).subscribe( (user) => { this.user = user; console.log(this.user); });

  }

  profileForm = this.fb.group({
    firstName: ['not matching bob and required', [forbiddenNameValidator(/bob/i), Validators.required]],
    lastName: ['required', [Validators.required]],
  }, {
      validators: fakeNameValidator,
      // updateOn: 'blur'
    });

  /*
  profileForm = new FormGroup({
    firstName: new FormControl('', []),
    lastName: new FormControl('', []),
  });
  */

}
