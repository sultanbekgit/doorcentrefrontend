import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AdminService } from '../services/admin.service';

@Injectable({
  providedIn: 'root'
})
export class AdminAuthGuard implements CanActivate {

  constructor(private adminService: AdminService, private router: Router) {}

  canActivate(): boolean {
    if (this.adminService.isAdminLoggedIn()) {
      console.log("kakak")
      return true;
    } else {
      this.router.navigate(['/home']); // Redirect if not admin
      console.log("nonono")
      return false;
    }
  }
}
