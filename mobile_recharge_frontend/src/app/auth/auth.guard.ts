import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AdminGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const user = JSON.parse(sessionStorage.getItem('subscriber') || 'null');
    if (user && user.role?.includes('ADMIN')) {
      return true;
    }
    this.router.navigate(['/admin-login']);
    return false;
  }
}
