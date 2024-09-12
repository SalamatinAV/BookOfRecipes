import { NgStyle } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInput, MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-textarea',
  standalone: true,
  imports: [MatFormFieldModule, MatInput, ReactiveFormsModule, NgStyle],
  templateUrl: './textarea.component.html',
  styleUrl: './textarea.component.scss',
})
export class TextareaComponent {
  @Input() resize: string = 'both';
  @Input() rows!: string;
  @Input() label!: string;

  @Input() form!: FormGroup;
  @Input() controlName!: string;
}
