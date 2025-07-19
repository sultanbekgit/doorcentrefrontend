import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { Customer } from '../app/models/customer';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  private apiServerUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  public saveCustomer(customer: Customer): Observable<Customer> {
    return this.http.post<Customer>(`${this.apiServerUrl}/customer/add`, customer);
  }
}




