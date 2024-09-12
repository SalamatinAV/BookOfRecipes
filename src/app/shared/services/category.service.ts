import { Injectable } from '@angular/core';
import { Auth, authState } from '@angular/fire/auth';
import { Firestore, collection, doc, getDocs, query, setDoc, where, deleteDoc } from '@angular/fire/firestore';
import { from, Observable, switchMap, map } from 'rxjs';
import { Category } from '../models/category';
import { User } from 'firebase/auth';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  constructor(private firestore: Firestore, private auth: Auth) {}

  private checkCategoryExists(name: string, userId: string): Observable<boolean> {
    const userCategoriesCollection = collection(this.firestore, `users/${userId}/categories`);
    const q = query(userCategoriesCollection, where('name', '==', name));
    return from(getDocs(q)).pipe(map((querySnapshot) => querySnapshot.size > 0));
  }

  addCategory(category: Category): Observable<void> {
    return authState(this.auth).pipe(
      switchMap((user: User | null) => {
        if (user) {
          const userCategoriesCollection = collection(this.firestore, `users/${user.uid}/categories`);

          return this.checkCategoryExists(category.name, user.uid).pipe(
            switchMap((exists) => {
              if (exists) {
                return from(Promise.reject('Category with this name already exists'));
              } else {
                const id = doc(userCategoriesCollection).id;

                return from(
                  setDoc(doc(this.firestore, `users/${user.uid}/categories/${id}`), {
                    ...category,
                    id,
                    userId: user.uid,
                  })
                );
              }
            })
          );
        } else {
          return from(Promise.reject('No user logged in'));
        }
      })
    );
  }

  getCategories(): Observable<Category[]> {
    return authState(this.auth).pipe(
      switchMap((user: User | null) => {
        if (user) {
          const userCategoriesCollection = collection(this.firestore, `users/${user.uid}/categories`);
          const q = query(userCategoriesCollection);
          return from(getDocs(q)).pipe(
            map((querySnapshot) =>
              querySnapshot.docs.map((doc) => ({
                ...(doc.data() as Category),
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

  deleteCategory(categoryId: string): Observable<void> {
    return authState(this.auth).pipe(
      switchMap((user: User | null) => {
        if (user) {
          return from(deleteDoc(doc(this.firestore, `users/${user.uid}/categories/${categoryId}`)));
        } else {
          return from(Promise.reject('No user logged in'));
        }
      })
    );
  }

  updateCategory(newName: string, categoryId: string): Observable<void> {
    return authState(this.auth).pipe(
      switchMap((user: User | null) => {
        if (user) {
          const categoryDocRef = doc(this.firestore, `users/${user.uid}/categories/${categoryId}`);
          return from(setDoc(categoryDocRef, { name: newName }, { merge: true }));
        } else {
          return from(Promise.reject('No user logged in'));
        }
      })
    );
  }
}
