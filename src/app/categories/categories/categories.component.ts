import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import { CategoryService } from '../../shared/services/category.service';
import { Category } from '../../shared/models/category';
import { LowerCasePipe, NgFor, NgIf, UpperCasePipe } from '@angular/common';

import { MatInput } from '@angular/material/input';
import { MatDialog } from '@angular/material/dialog';
import { AddCategoryDialogComponent } from '../../shared/components/dialogs/add-category-dialog/add-category-dialog/add-category-dialog.component';
import { DeleteDialogComponent } from '../../shared/components/dialogs/delete-dialog/delete-dialog/delete-dialog.component';
import { RecipeService } from '../../shared/services/recipe.service';
import { ErrorMessageDialogComponent } from '../../shared/components/dialogs/error-massage-dialog/error-message-dialog/error-message-dialog.component';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [MatIconModule, RouterModule, NgFor, NgIf, UpperCasePipe, MatInput, LowerCasePipe, MatTooltipModule],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss',
})
export class CategoriesComponent implements OnInit {
  public category: Category[] = [];

  constructor(
    private categoryService: CategoryService,
    private recipeService: RecipeService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  public openAddCategoryDialog(name?: string, id?: string, ev?: Event): void {
    ev?.stopPropagation();
    const dialofRef = this.dialog.open(AddCategoryDialogComponent, {
      data: { name: name, id: id },
    });
    dialofRef.afterClosed().subscribe(() => {
      this.loadCategories();
    });
  }

  public deleteCategoryDialog(category: Category, ev: Event): void {
    ev.stopPropagation();

    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      data: { category: category, header: 'категорию' },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.recipeService.getRecipes(result.id).subscribe((a) => {
          if (!a.length) {
            this.deleteCategory(result.id);
          } else {
            this.errorMassageDialog(result.name);
          }
        });
      }
    });
  }

  public showRecipes(category: string): void {
    this.router.navigate(['/home/recipes', category]);
  }

  private deleteCategory(category: string | undefined): void {
    if (category) this.categoryService.deleteCategory(category).subscribe(() => this.loadCategories());
  }

  private loadCategories(): void {
    this.categoryService.getCategories().subscribe((category) => {
      this.category = category.sort((a, b) => a.name.localeCompare(b.name));
    });
  }

  private errorMassageDialog(name: string): void {
    this.dialog.open(ErrorMessageDialogComponent, {
      data: { name: name },
    });
  }
}
