import { Component } from '@angular/core';
import { CartService } from '../cart.service';
import { Router } from '@angular/router';
import { CustomerService } from '../../services/customer.service';
import { Customer } from '../models/customer';
import { OrderService } from '../../services/order.service';
import { Orders } from '../models/orders';
import { consumerMarkDirty } from '@angular/core/primitives/signals';
import { BotService } from '../../services/bot.service';
import { OrderCustomerRequest } from '../models/order-customer-request';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-cart',
  standalone: false,

  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent {


  constructor(private cartService: CartService, private router: Router, private customerService: CustomerService,
    private orderService: OrderService, private botService: BotService, private toastr: ToastrService
    
  ) { }


    private apiServerUrl = environment.apiBaseUrl;
    // Base URL for your backend server
  
  
    hello(): string {
      return this.apiServerUrl
    }
  
  

  cart: any[] = [];
  message: any = null;
  totalPrice: number = 0;
  public phoneNumber: string = '';
  public city: string = '';
  public isCheckoutVisible: boolean = false;


  public order: Orders | undefined;
  public orderCustomerRequest: OrderCustomerRequest | undefined;
  public customer: Customer | undefined;

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart(): void {
    this.cart = this.cartService.getCart();
    this.calculateTotalPrice()
  }

  calculateTotalPrice(): void {
    this.totalPrice = this.cart.reduce((total, item) => total + item.price * item.quantity, 0)

  }

  formatPrice(price: number): string {
    return `${price} ₸`;
  }

  incrementItem(itemId: number): void {
    this.cartService.incrementItem(itemId)
    this.loadCart();
  }

  decrementItem(itemId: number): void {
    this.cartService.decrementItem(itemId)
    this.loadCart();
  }

  removeItem(itemId: number): void {
    this.cartService.removeItem(itemId)
    this.loadCart();
  }
  clearCart(): void {
    this.cartService.clearCart()
    this.loadCart();
  }




  toggleCheckoutForm(): void {
    this.isCheckoutVisible = !this.isCheckoutVisible;
  }

  submitOrder(): void {

    if (!this.phoneNumber) {
      alert('Введите номер телефона!');
      return;
    }

    // Save the customer first
    const customerData = { phoneNumber: this.phoneNumber, city: this.city };

    this.customerService.saveCustomer(customerData).subscribe({
      next: (customerResponse) => {
        console.log('Customer saved:', customerResponse);
        console.log('Customer id:', customerResponse.id);
        this.customer = customerResponse;
        const listOrders: Orders[] = [];

        // Save each order linked to the customer

        this.cart.forEach((cartItem) => {

          this.order = {
            name: cartItem.name,
            price: cartItem.price,
            customerId: customerResponse.id,
            quantity: cartItem.quantity,
            // Link customer to the order
          };
          listOrders.push(this.order);
          console.log(this.order);


          this.orderService.saveOrder(this.order).subscribe({
            next: (orderResponse) => {
              console.log('Order saved:', orderResponse);
              console.log(orderResponse.customerId);
            },
            error: (error) => {

              console.error('Failed to save order:', error);
            },
          });
        });
      
        const orderCustomerRequest: OrderCustomerRequest = {
          orders: listOrders,
          customer: customerResponse,
        };
  
        this.botService.sendNotification(orderCustomerRequest).subscribe({
          next: () => {
            this.toastr.success(
              `<span style="color: white;">🎉 Заказ оформлен!</span>`,
              '',
              {
                enableHtml: true,
                positionClass: 'toast-top-center', // Set top-center position
                toastClass: 'ngx-toastr custom-toast', // Add custom class for styling
              }
            );
            this.clearCart(); // Clear the cart after a successful order
          },
          error: (error) => {
            console.error('Failed to send notification:', error);
            alert('Ошибка при отправке уведомления!');
          },
        });
      },
      error: (error) => {
        console.error('Failed to save customer:', error);
        alert('Ошибка при сохранении данных клиента. Попробуйте еще раз.');
      },
    });
    

  }
}




