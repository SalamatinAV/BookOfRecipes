import { Component, OnInit } from '@angular/core';
import { InputComponent } from '../../../shared/components/material/input/input.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { emailValidator } from '../../../shared/validators/email.validator';
import { AuthService } from '../../../shared/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-recover-password',
  standalone: true,
  imports: [InputComponent, MatFormFieldModule, MatButtonModule, ReactiveFormsModule],
  templateUrl: './recover-password.component.html',
  styleUrl: './recover-password.component.scss',
})
export class RecoverPasswordComponent implements OnInit {
  public formRecoverPassword!: FormGroup;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.formRecoverPassword = new FormGroup({
      email: new FormControl(null, [Validators.required, emailValidator]),
    });
  }

  public onSubmit(): void {
    const email = this.formRecoverPassword.get('email')?.value;

    if (this.formRecoverPassword.valid) {
      this.authService.resetPassword(email);
      this.router.navigate(['/auth']);
    }
  }
}
