import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  public username: string = '';
  public password: string = '';
  errorMessage: string = '';



  constructor(private http: HttpClient, private router: Router, private adminSerivce: AdminService) { }


  public onLogin(): void {
    this.adminSerivce.onLogin(this.username, this.password)
  }
}

