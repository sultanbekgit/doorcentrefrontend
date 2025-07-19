import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Orders } from '../app/models/orders';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private apiServerUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) { }

  public saveOrder(order: Orders): Observable<Orders> {
    return this.http.post<Orders>(`${this.apiServerUrl}/order/add`, order);
  }

}
