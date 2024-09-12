import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const passwordMatchValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const password = control.get('password');
  const confirmPassword = control.get('checkPassword');

  return password && confirmPassword && password.value !== confirmPassword.value
    ? { passwordsMismatch: true }
    : null;
};
