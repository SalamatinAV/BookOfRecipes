import { Component, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { AddCategoryDialogComponent } from '../../add-category-dialog/add-category-dialog/add-category-dialog.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { UpperCasePipe } from '@angular/common';

@Component({
  selector: 'app-error-message-dialog',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    UpperCasePipe,
  ],
  templateUrl: './error-message-dialog.component.html',
  styleUrl: './error-message-dialog.component.scss',
})
export class ErrorMessageDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<AddCategoryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
}
