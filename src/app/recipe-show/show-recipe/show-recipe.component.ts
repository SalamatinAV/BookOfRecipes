import { Component, OnInit } from '@angular/core';
import { Ingrediends, Recipe } from '../../shared/models/recipe';
import { Location, NgFor, NgIf, UpperCasePipe } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { RecipeService } from '../../shared/services/recipe.service';
import { MatDialog } from '@angular/material/dialog';
import { DeleteDialogComponent } from '../../shared/components/dialogs/delete-dialog/delete-dialog/delete-dialog.component';
import { RouteParamService } from '../../shared/services/route-param.service';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-show-recipe',
  standalone: true,
  imports: [NgFor, NgIf, RouterLink, MatIconModule, UpperCasePipe, MatTooltipModule],
  templateUrl: './show-recipe.component.html',
  styleUrl: './show-recipe.component.scss',
})
export class ShowRecipeComponent implements OnInit {
  public recipe: Recipe = {} as Recipe;
  public ingredients: Ingrediends[] = [];
  public categoryName!: string;

  constructor(
    public location: Location,
    private recipeService: RecipeService,
    private dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    private routeParamService: RouteParamService
  ) {}

  ngOnInit(): void {
    this.routeParamService.getCategoryId(this.route).subscribe((category) => {
      if (category.id)
        (this.categoryName = category.name),
          this.routeParamService.getRecipe(this.route, category.id).subscribe((recipe) => {
            if (recipe) {
              this.recipe = recipe;
              this.ingredients = recipe.ingredients || [];
            }
          });
    });
  }

  public deletRecipeDialog(): void {
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      data: { recipe: this.recipe, header: 'рецепт' },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) this.deleteRecipe();
    });
  }

  public updateRecipe(): void {
    this.router.navigate(['/home/recipe', this.categoryName, this.recipe.title, 'edit']);
  }

  private deleteRecipe(): void {
    if (this.recipe.id) {
      this.recipeService.deleteRecipe(this.recipe.categoryId, this.recipe.id).subscribe(() => this.location.back());
    }
  }
}
