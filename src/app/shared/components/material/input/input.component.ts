import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [ReactiveFormsModule, MatInput, MatFormFieldModule, MatIconModule, MatButtonModule],
  templateUrl: './input.component.html',
  styleUrl: './input.component.scss',
})
export class InputComponent {
  @ViewChild('input') input!: ElementRef;

  @Input() form!: FormGroup;
  @Input() controlName!: string;

  @Input() label!: string;
  @Input() placeholder!: string;
  @Input() showBtn!: boolean;

  public hidePassword: boolean = true;

  public focus(): void {
    this.input.nativeElement.focus();
  }

  public getTypeInput(): string {
    let type = 'text';

    if (this.hidePassword && this.controlName === 'password') type = 'password';
    if (this.controlName === 'checkPassword') type = 'password';

    return type;
  }

  public getErrorMessage(): string {
    let mesage: string = '';

    let errors = this.form.get(this.controlName)?.errors;
    if (errors) {
      if (errors['required']) mesage = 'Обязательное поле. ';
      if (errors['minlength']) mesage = 'Пароль должен быть не менее 6 символов. ';
      if (errors['pattern']) mesage = 'Пароль должен содержать только буквы(Aa-Zz) и цифры.';
      if (errors['existsRecipe']) mesage = 'Рецепт с таким названием уже существует.';
      if (errors['existCategory']) mesage = 'Категория с таким названием уже существует';
      if (errors['emailValidator']) mesage = 'Введите правильный email.';
    }

    return mesage;
  }
}
