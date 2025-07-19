import { Component } from '@angular/core';
import { CartService } from '../cart.service';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-header',
  standalone: false,

  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {


  constructor(public cartService: CartService, public adminService: AdminService){

  }

  



}
