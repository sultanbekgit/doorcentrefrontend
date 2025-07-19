import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private apiServerUrl = environment.apiUrl;
  errorMessage: string = '';
  private adminLoggedIn = false;
  

  hello(): string {
    return this.apiServerUrl;
  }

  loginAsAdmin(): void {
    this.adminLoggedIn = true;
  }

  logoutAdmin(): void {
    this.adminLoggedIn = false;
    this.router.navigate(['home']);

  }

  isAdminLoggedIn(): boolean {
    return this.adminLoggedIn;
  }

  constructor(private http: HttpClient, private router: Router) { }

  public getAuthHeaders(): { [header: string]: string } {
    const username = localStorage.getItem('username');
    const password = localStorage.getItem('password');

    if (username && password) {
      return {
        Authorization: 'Basic ' + btoa(`${username}:${password}`),
      };
    }
    return {};
  }


  onLogin(username: string, password: string): void {

    console.log("jeas")
    // Send a request to the backend to authenticate
    this.http.get(`${this.apiServerUrl}/admin/dashboard`, {
      headers: {
        Authorization: 'Basic ' + btoa(`${username}:${password}`),
      },
      responseType: 'text'
    })
      .subscribe({
        next: () => {
          // Store credentials in localStorage (for simplicity)
          localStorage.setItem('username', username);
          localStorage.setItem('password', password);
          localStorage.setItem('isAdmin', "yes");
          this.loginAsAdmin();
          this.router.navigate(['home/admin']); // Redirect to admin dashboard
          console.log("nice!")
        },
        error: () => {
          this.errorMessage = 'Invalid username or password';
        },
      });
  }
}
