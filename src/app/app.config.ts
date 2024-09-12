import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideFirebaseApp(() =>
      initializeApp({
        apiKey: 'AIzaSyCvawZMbHPzFzgGrj9ZHBhCKTJGTmI9y9Q',
        authDomain: 'book-of-recipes-7500e.firebaseapp.com',
        projectId: 'book-of-recipes-7500e',
        storageBucket: 'book-of-recipes-7500e.appspot.com',
        messagingSenderId: '324361750328',
        appId: '1:324361750328:web:dbd300676f2d8fff9423cd',
      })
    ),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    {
      provide: MAT_DIALOG_DEFAULT_OPTIONS,
      useValue: { width: '90vw', disableClose: true },
    },
  ],
};
