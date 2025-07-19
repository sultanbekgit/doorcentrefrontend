import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';
import { OrderCustomerRequest } from '../app/models/order-customer-request';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BotService {

  private apiServerUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) { }

  public sendNotification(OrderCustomerRequest: OrderCustomerRequest): Observable<OrderCustomerRequest> {
    return this.http.post<OrderCustomerRequest>(`${this.apiServerUrl}/bot/get-order`, OrderCustomerRequest);
  }
}
