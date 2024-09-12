import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout/layout.component';
// import { AuthComponent } from './auth/auth/auth.component';
import { CategoriesComponent } from './categories/categories/categories.component';
import { RecipesComponent } from './recipes/recipes/recipes.component';
import { RecipeFormComponent } from './recipe-form/recipe-form/recipe-form.component';
import { ShowRecipeComponent } from './recipe-show/show-recipe/show-recipe.component';

import { RegistritionComponent } from './authentication/auth-email/registrition/registrition.component';
import { authGuard } from './shared/guards/auth.guard';
import { RecoverPasswordComponent } from './authentication/auth-email/recover-password/recover-password.component';
import { AuthEmailComponent } from './authentication/auth-email/auth-email/auth-email.component';
import { LoginComponent } from './authentication/auth-email/login/login/login.component';

export const routes: Routes = [
  // { path: 'auth', component: AuthComponent },
  {
    path: 'auth',
    component: AuthEmailComponent,
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'registration', component: RegistritionComponent },
      { path: 'recoverPassword', component: RecoverPasswordComponent },

      { path: '', redirectTo: 'login', pathMatch: 'full' },
    ],
  },

  {
    path: 'home',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: 'categories', component: CategoriesComponent },
      { path: 'recipes/:category', component: RecipesComponent },
      { path: 'recipe/:category/addRecipe', component: RecipeFormComponent },
      { path: 'recipe/:category/:recipe/edit', component: RecipeFormComponent },
      { path: 'recipe/:category/:recipe', component: ShowRecipeComponent },

      { path: '', redirectTo: 'categories', pathMatch: 'full' },
    ],
  },
  { path: '**', redirectTo: 'auth', pathMatch: 'full' },
];
