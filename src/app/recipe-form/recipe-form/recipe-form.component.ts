import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NgFor, NgIf, UpperCasePipe } from '@angular/common';
import { RecipeService } from '../../shared/services/recipe.service';
import { Ingrediends, Recipe } from '../../shared/models/recipe';
import { ActivatedRoute, Router } from '@angular/router';
import { RouteParamService } from '../../shared/services/route-param.service';
import { TextareaComponent } from '../../shared/components/material/textarea/textarea.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { InputComponent } from '../../shared/components/material/input/input.component';

@Component({
  selector: 'app-recipe-form',
  standalone: true,
  imports: [
    NgFor,
    NgIf,
    UpperCasePipe,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInput,
    MatButtonModule,
    MatIconModule,
    InputComponent,
    TextareaComponent,
  ],
  templateUrl: './recipe-form.component.html',
  styleUrl: './recipe-form.component.scss',
})
export class RecipeFormComponent implements OnInit, AfterViewInit {
  @ViewChild('ingredientsList') ingredientsList!: ElementRef;

  @ViewChild('ingredientInput') ingredientInput!: InputComponent;
  @ViewChild('titleInput') titleInput!: InputComponent;

  public recipe?: Recipe;

  public recipes: Recipe[] = [];
  public ingredients: Ingrediends[] = [];

  public recipeForm!: FormGroup;
  public ingrediendsForm!: FormGroup;
  public categoryName!: string;

  private categoryId!: string;
  private recipeName!: string;

  private editedIngredientIndex: number | null = null;

  constructor(
    private recipeService: RecipeService,
    private routeParamService: RouteParamService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.ingrediendsForm = new FormGroup({
      ingredient: new FormControl(''),
      quantity: new FormControl(''),
    });

    this.recipeForm = new FormGroup({
      title: new FormControl('', Validators.required),
      ingredients: this.ingrediendsForm,
      instructions: new FormControl(''),
    });

    this.getUpdateRecipeForm();
  }

  ngAfterViewInit(): void {
    this.titleInput.focus();
    this.cdr.detectChanges();
  }

  public addIngrediends(): void {
    if (this.ingrediendsForm.get('ingredient')?.value.trim() && this.ingrediendsForm.get('quantity')?.value.trim()) {
      if (this.editedIngredientIndex !== null) {
        this.ingredients[this.editedIngredientIndex] = this.recipeForm.get('ingredients')?.value;
        this.editedIngredientIndex = null;
      } else {
        this.ingredients.push(this.recipeForm.get('ingredients')?.value);
        setTimeout(() => {
          this.ingredientsList.nativeElement.scrollTop = this.ingredientsList.nativeElement.scrollHeight;
        }, 0);
      }
    }

    this.ingredientInput.focus();
    this.ingrediendsForm.reset();
  }

  public deleteIngrediend(ingredient: Ingrediends): void {
    this.ingredients = this.ingredients.filter((value) => value !== ingredient);
  }

  public updateIngrediend(ingredient: Ingrediends, idx: number): void {
    this.ingrediendsForm.get('ingredient')?.setValue(ingredient.ingredient);
    this.ingrediendsForm.get('quantity')?.setValue(ingredient.quantity);
    this.editedIngredientIndex = idx;
  }

  public addOrUpdateRecipe(): void {
    const titleControl = this.recipeForm.get('title');
    const recipeTitle = titleControl?.value.trim();

    if (!recipeTitle) {
      titleControl?.setErrors({ required: true });
      titleControl?.setValue('');
      this.titleInput.focus();
      return;
    }

    if (this.checkRecipeTitleExists(recipeTitle)) {
      titleControl?.setErrors({ existsRecipe: true });
      return;
    }

    const recipe = {
      title: recipeTitle,
      id: this.recipe ? this.recipe.id : '',
      ingredients: this.ingredients,
      instructions: this.recipeForm.get('instructions')?.value,
      categoryId: this.categoryId,
      userId: '',
    };

    this.recipeName = recipe.title;

    if (this.recipe && this.recipe.id) {
      this.updateRecipe(recipe);
    } else {
      this.addRecipe(recipe);
    }
  }

  public previousRoute(categoryName: string, recipeName?: string): void {
    if (this.recipe) {
      this.router.navigate(['/home/recipe', categoryName, recipeName]);
    } else {
      this.router.navigate(['/home/recipes', categoryName]);
    }
  }

  private addRecipe(recipe: Recipe): void {
    this.recipeService.addRecipe(recipe).subscribe(() => {
      this.previousRoute(this.categoryName);
    });
  }

  private updateRecipe(recipe: Recipe): void {
    this.recipeService.updateRecipe(recipe).subscribe(() => {
      this.previousRoute(this.categoryName, this.recipeName);
    });
  }

  private getUpdateRecipeForm(): void {
    this.routeParamService.getCategoryId(this.route).subscribe((category) => {
      if (category.id) {
        this.categoryId = category.id;
        this.categoryName = category.name;

        this.routeParamService.getRecipe(this.route, category.id).subscribe((recipe) => {
          if (recipe) {
            this.recipe = recipe;
            this.ingredients = this.recipe.ingredients || [];
            this.recipeForm.patchValue({
              title: this.recipe.title,
              instructions: this.recipe.instructions,
            });
          }
        });
      }
      this.getRecipe();
    });
  }

  private getRecipe(): void {
    this.recipeService.getRecipes(this.categoryId).subscribe((recipes) => {
      this.recipes = recipes;
    });
  }

  private checkRecipeTitleExists(title: string): boolean {
    return this.recipes.some((r) => r.title === title.toLocaleLowerCase() && r.id !== this.recipe?.id);
  }
}
