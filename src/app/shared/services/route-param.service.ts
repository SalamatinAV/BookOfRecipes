import { Injectable } from '@angular/core';
import { RecipeService } from './recipe.service';
import { CategoryService } from './category.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Observable, of, switchMap } from 'rxjs';
import { Recipe } from '../models/recipe';

@Injectable({
  providedIn: 'root',
})
export class RouteParamService {
  constructor(
    private recipeService: RecipeService,
    private categoryService: CategoryService
  ) {}

  getCategoryId(
    route: ActivatedRoute
  ): Observable<{ id: string | undefined; name: string }> {
    return route.paramMap.pipe(
      switchMap((params: ParamMap) => {
        const categoryName = params.get('category') || '';

        return this.categoryService.getCategories().pipe(
          switchMap((categories) => {
            const category = categories.find((c) => c.name === categoryName);
            return of({ id: category?.id, name: categoryName });
          })
        );
      })
    );
  }

  getRecipe(
    route: ActivatedRoute,
    categoryId: string
  ): Observable<Recipe | undefined> {
    return route.paramMap.pipe(
      switchMap((param) => {
        const recipeName = param.get('recipe');
        return this.recipeService.getRecipes(categoryId).pipe(
          switchMap((recipe) => {
            const recipeId = recipe.find((r) => r.title === recipeName);
            return of(recipeId);
          })
        );
      })
    );
  }
}
