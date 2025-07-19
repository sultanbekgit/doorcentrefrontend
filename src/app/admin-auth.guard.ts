import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AdminAuthGuard implements CanActivate {
  
  constructor(private router: Router) { }

  canActivate(): boolean {
    // Add your authentication logic here
    // For now, return true to allow access
    // You can implement proper authentication check later
    const isAdmin = localStorage.getItem('isAdmin') === 'true';
    
    if (!isAdmin) {
      this.router.navigate(['/login']);
      return false;
    }
    
    return true;
  }
} 