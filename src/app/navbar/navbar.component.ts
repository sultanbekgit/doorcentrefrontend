import { Component } from '@angular/core';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-navbar',
  standalone: false,
  
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {



  constructor(private adminService: AdminService) {
    // Example condition: update with real logic
  
  }
  
  public isAdminLogged(){
    return this.adminService.isAdminLoggedIn()
  }

  public logout(){
    this.adminService.logoutAdmin();
  }

}
