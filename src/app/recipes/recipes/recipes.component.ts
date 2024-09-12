import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Recipe } from '../../shared/models/recipe';
import { RecipeService } from '../../shared/services/recipe.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { LowerCasePipe, NgFor, NgIf, UpperCasePipe } from '@angular/common';
import { RouteParamService } from '../../shared/services/route-param.service';

@Component({
  selector: 'app-recipes',
  standalone: true,
  imports: [
    MatIconModule,
    NgFor,
    UpperCasePipe,
    RouterLink,
    NgIf,
    LowerCasePipe,
  ],
  templateUrl: './recipes.component.html',
  styleUrl: './recipes.component.scss',
})
export class RecipesComponent implements OnInit {
  recipes: Recipe[] = [];
  categoryId!: string;
  categoryName!: string;

  constructor(
    private recipeService: RecipeService,
    private router: Router,
    private route: ActivatedRoute,
    private routeParamService: RouteParamService
  ) {}

  ngOnInit(): void {
    this.routeParamService.getCategoryId(this.route).subscribe((category) => {
      if (category.id) {
        this.categoryId = category.id;
        this.categoryName = category.name;
        this.loadRecipes();
      }
    });
  }

  public addRecipe(): void {
    this.router.navigate(['home/recipe', this.categoryName, 'addRecipe'], {});
  }

  public showRecipe(recipe: Recipe): void {
    if (recipe)
      this.router.navigate(['home/recipe', this.categoryName, recipe.title]);
  }

  private loadRecipes(): void {
    this.recipeService
      .getRecipes(this.categoryId)
      .subscribe((recipes) => (this.recipes = recipes));
  }
}
