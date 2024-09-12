import { Component, inject, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../shared/services/auth.service';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { passwordMatchValidator } from '../../shared/validators/password-match.validator';
import { InputComponent } from '../../shared/components/material/input/input.component';

@Component({
  selector: 'app-authentication',
  standalone: true,
  imports: [
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    InputComponent,
  ],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss',
})
export class AuthComponent implements OnInit {
  priority: boolean = true;
  errorEmail: string = '';
  formLoginOrReg!: FormGroup;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.formLoginOrReg = new FormGroup(
      {
        email: new FormControl(null, [Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@gmail\.com$/i)]),
        password: new FormControl(null, [Validators.required, Validators.minLength(6), Validators.pattern(/^[A-Za-z0-9]+$/)]),
        checkPassword: new FormControl(null, [Validators.required, Validators.minLength(6), Validators.pattern(/^[A-Za-z0-9]+$/)]),
      },
      { validators: passwordMatchValidator }
    );
  }

  public registrationOrLogin(isLogin: boolean): void {
    this.errorEmail = '';
    this.priority = isLogin;
    this.formLoginOrReg.reset();
  }

  public onSubmit() {
    const email = this.formLoginOrReg.get('email')?.value;
    const password = this.formLoginOrReg.get('password')?.value;
    if (this.priority) {
      this.login(email, password);
    } else {
      this.registr(email, password);
    }
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

  private registr(email: string, password: string): void {
    this.authService.registration(email, password).subscribe({
      error: (error) => {
        if (error.code === 'auth/email-already-in-use') {
          this.errorEmail = 'Пользователь с таким email уже существует';
        } else {
          this.errorEmail = 'Ошибка при регистрации';
        }
      },
    });
  }

  resetPassword() {
    this.authService.resetPassword('maliyqwert@gmail.com');
  }
}
