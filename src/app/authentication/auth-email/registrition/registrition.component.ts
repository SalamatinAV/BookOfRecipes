import { Component } from '@angular/core';
import { AuthService } from '../../../shared/services/auth.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { emailValidator } from '../../../shared/validators/email.validator';
import { InputComponent } from '../../../shared/components/material/input/input.component';
import { NgFor, NgIf } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { passwordMatchValidator } from '../../../shared/validators/password-match.validator';

@Component({
  selector: 'app-registrition',
  standalone: true,
  imports: [InputComponent, NgIf, NgFor, MatButtonModule, ReactiveFormsModule, MatFormFieldModule],
  templateUrl: './registrition.component.html',
  styleUrl: './registrition.component.scss',
})
export class RegistritionComponent {
  public formRegistration!: FormGroup;
  public errorEmail: string = '';

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    (this.formRegistration = new FormGroup(
      {
        email: new FormControl(null, [Validators.required, emailValidator]),
        password: new FormControl(null, [Validators.required, Validators.minLength(6), Validators.pattern(/^[A-Za-z0-9]+$/)]),
        checkPassword: new FormControl(null, [Validators.required, Validators.minLength(6), Validators.pattern(/^[A-Za-z0-9]+$/)]),
      },
      { validators: passwordMatchValidator }
    )),
      this.formRegistration.valueChanges.subscribe(() => (this.errorEmail = ''));
  }

  private registration(email: string, password: string): void {
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

  public onSubmit(): void {
    const email = this.formRegistration.get('email')?.value;
    const password = this.formRegistration.get('password')?.value;
    if (this.formRegistration.valid) this.registration(email, password);
  }
}
