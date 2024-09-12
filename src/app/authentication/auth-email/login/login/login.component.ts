import { Component, OnInit } from '@angular/core';
// import { InputComponent } from '../../../shared/components/material/input/input.component';
import { NgFor, NgIf } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
// import { phoneValidator } from '../../../shared/validators/phone.validator';
// import { emailValidator } from '../../../shared/validators/email.validator';
// import { AuthService } from '../../../shared/services/auth.service';
import { Route, Router } from '@angular/router';
import { InputComponent } from '../../../../shared/components/material/input/input.component';
import { AuthService } from '../../../../shared/services/auth.service';
import { emailValidator } from '../../../../shared/validators/email.validator';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [InputComponent, NgIf, NgFor, MatButtonModule, ReactiveFormsModule, MatFormFieldModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  formLogin!: FormGroup;
  errorEmail: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.formLogin = new FormGroup({
      email: new FormControl(null, [Validators.required, emailValidator]),
      password: new FormControl(null, [Validators.required, Validators.minLength(6), Validators.pattern(/^[A-Za-z0-9]+$/)]),
    });

    this.formLogin.valueChanges.subscribe(() => (this.errorEmail = ''));
  }

  private login(email: string, password: string): void {
    this.authService.login(email, password).subscribe({
      error: (error) => {
        if (error) {
          this.errorEmail = 'Неправельный email или пароль';
        }
      },
    });
  }

  onSubmit() {
    const emailAndPhone = this.formLogin.get('email')?.value;
    const password = this.formLogin.get('password')?.value;

    this.login(emailAndPhone, password);
  }

  recoverPassword(): void {
    this.router.navigate(['auth/recoverPassword']);
  }
}
