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
      email: ['test@gmail.com', Validators.required],
      password: ['Password10', Validators.required]
    });

  }

  login() {
    const val = this.form.value;
    if (val.email && val.password) {
      this.authService.login(val.email, val.password)
        .subscribe(() => {
          console.log('User is logged in');
          // this.router.navigateByUrl('/');
        }
        );
    }
  }

  logout() {
    this.authService.logout().subscribe();
  }
}
