import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const user = JSON.parse(sessionStorage.getItem('subscriber') || 'null');

    if (user && user.role === 'ADMIN') {
      return true;
    }

    // Not logged in or not admin
    this.router.navigate(['/login']);
    return false;
  }
}
