import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'L10-angular-forms-E60-login';

  form: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService) {

    this.form = this.fb.group({
      email: ['olivier@mail.com', Validators.required],
      password: ['bestPassw0rd', Validators.required]
    });

  }

  login() {
    const val = this.form.value;
    if (val.email && val.password) {
      this.authService.login(val.email, val.password)
        .subscribe((_) => {
          console.log('User is logged in. Received: ' + JSON.stringify(_));
          // this.router.navigateByUrl('/');
        }
        );
    }
  }

  logout() {
    this.authService.logout(); /*.subscribe();*/
  }
}
