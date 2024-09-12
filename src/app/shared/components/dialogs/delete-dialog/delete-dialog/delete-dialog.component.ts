import { Component, Inject, OnInit } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { UpperCasePipe } from '@angular/common';

@Component({
  selector: 'app-delete-dialog',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    UpperCasePipe,
  ],
  templateUrl: './delete-dialog.component.html',
  styleUrl: './delete-dialog.component.scss',
})
export class DeleteDialogComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<DeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {}

  public getName(): string {
    let name = '';

    if (this.data.recipe) name = this.data.recipe.title;
    if (this.data.category) name = this.data.category.name;

    return name;
  }

  public onDelete(): void {
    if (this.data.category) this.dialogRef.close(this.data.category);
    if (this.data.recipe) this.dialogRef.close(this.data.recipe);
  }
}
