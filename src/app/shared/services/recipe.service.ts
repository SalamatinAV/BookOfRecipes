import { Injectable } from '@angular/core';
import { Auth, authState } from '@angular/fire/auth';
import {
  collection,
  deleteDoc,
  doc,
  Firestore,
  getDocs,
  query,
  setDoc,
} from '@angular/fire/firestore';
import { from, Observable, switchMap, map } from 'rxjs';
import { Recipe } from '../models/recipe';
import { User } from 'firebase/auth';

@Injectable({
  providedIn: 'root',
})
export class RecipeService {
  constructor(private firestore: Firestore, private auth: Auth) {}

  addRecipe(recipe: Recipe): Observable<void> {
    return authState(this.auth).pipe(
      switchMap((user: User | null) => {
        if (user) {
          const id = doc(
            collection(
              this.firestore,
              `users/${user.uid}/categories/${recipe.categoryId}/recipes`
            )
          ).id;
          return from(
            setDoc(
              doc(
                this.firestore,
                `users/${user.uid}/categories/${recipe.categoryId}/recipes/${id}`
              ),
              {
                ...recipe,
                id,
                userId: user.uid,
              }
            )
          );
        } else {
          return from(Promise.reject('No user logged in'));
        }
      })
    );
  }

  getRecipes(categoryId: string): Observable<Recipe[]> {
    return authState(this.auth).pipe(
      switchMap((user: User | null) => {
        if (user) {
          const userRecipesCollection = collection(
            this.firestore,
            `users/${user.uid}/categories/${categoryId}/recipes`
          );
          const q = query(userRecipesCollection);
          return from(getDocs(q)).pipe(
            map((querySnapshot) =>
              querySnapshot.docs.map((doc) => ({
                ...(doc.data() as Recipe),
                id: doc.id,
              }))
            )
          );
        } else {
          return from(Promise.reject('No user logged in'));
        }
      })
    );
  }

  deleteRecipe(categoryId: string, recipeId: string): Observable<void> {
    return from(
      deleteDoc(
        doc(
          this.firestore,
          `users/${this.auth.currentUser?.uid}/categories/${categoryId}/recipes/${recipeId}`
        )
      )
    );
  }

  updateRecipe(recipe: Recipe): Observable<void> {
    return authState(this.auth).pipe(
      switchMap((user: User | null) => {
        if (user) {
          const recipeDocRef = doc(
            this.firestore,
            `users/${user.uid}/categories/${recipe.categoryId}/recipes/${recipe.id}`
          );
          return from(setDoc(recipeDocRef, recipe, { merge: true }));
        } else {
          return from(Promise.reject('No user logged in'));
        }
      })
    );
  }
}
