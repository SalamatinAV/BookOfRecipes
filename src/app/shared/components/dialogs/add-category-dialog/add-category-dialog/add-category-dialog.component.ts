import { AfterViewInit, ChangeDetectorRef, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { NgIf, UpperCasePipe } from '@angular/common';
import { CategoryService } from '../../../../services/category.service';
import { Category } from '../../../../models/category';
import { InputComponent } from '../../../material/input/input.component';

@Component({
  selector: 'app-add-category-dialog',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    NgIf,
    UpperCasePipe,
    InputComponent,
  ],
  templateUrl: './add-category-dialog.component.html',
  styleUrl: './add-category-dialog.component.scss',
})
export class AddCategoryDialogComponent implements OnInit, AfterViewInit {
  @ViewChild('categoryName') private categoryName!: InputComponent;

  categoryForm!: FormGroup;

  constructor(
    private cdr: ChangeDetectorRef,
    private categoryService: CategoryService,
    public dialogRef: MatDialogRef<AddCategoryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.categoryForm = new FormGroup({
      category: new FormControl('', [Validators.required]),
    });

    if (this.data.name) this.categoryForm.patchValue({ category: this.data.name });
  }

  ngAfterViewInit(): void {
    this.categoryName.focus();
    this.cdr.detectChanges();
  }

  public onSubmit(): void {
    const nameControl = this.categoryForm.get('category');
    const nameCategory = nameControl?.value.trim();

    if (!nameCategory) {
      nameControl?.setErrors({ required: true });
      nameControl?.setValue('');
      this.categoryName.focus();
      return;
    }

    this.categoryService.getCategories().subscribe((categories) => {
      const category = categories.some((c) => c.name === nameCategory.toLocaleLowerCase() && c.id !== this.data.id);
      if (category) {
        nameControl?.setErrors({ existCategory: true });
        return;
      }

      if (this.data && this.data.id) {
        this.updateCategory(nameCategory, this.data.id);
      } else {
        this.addCategory(nameCategory);
      }

      this.dialogRef.close();
    });
  }

  private addCategory(categoryName: string): void {
    const category: Category = {
      name: categoryName.toLocaleLowerCase(),
      userId: '',
    };

    this.categoryService.addCategory(category).subscribe();
  }

  private updateCategory(categoryName: string, id: string): void {
    this.categoryService.updateCategory(categoryName, id).subscribe();
  }
}
