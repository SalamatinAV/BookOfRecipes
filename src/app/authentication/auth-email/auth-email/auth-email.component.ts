import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-auth-email.',
  standalone: true,
  imports: [MatIconModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './auth-email.component.html',
  styleUrl: './auth-email.component.scss',
})
export class AuthEmailComponent {}
