import { Component, OnInit } from '@angular/core';
import { Platband } from '../models/platband';
import { PlatbandService } from '../../services/platband.service';
import { HttpErrorResponse } from '@angular/common/http';
import { PlatbandVariant } from '../models/platband-variant';
import { Router } from '@angular/router';
import { CartService } from '../cart.service';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../environments/environment';


interface Product {
  id: number,
  name: string,

  price: number | undefined,
  imageUrl: string
}

@Component({
  selector: 'app-platband',
  standalone: false,

  templateUrl: './platband.component.html',
  styleUrl: './platband.component.css'
})
export class PlatbandComponent implements OnInit {
  public platbands: Platband[] | undefined;
  public filteredPlatbands: Platband[] | undefined;
  public typeFilter: string = '';
  public selectedVariants: { [platbandId: number]: any } = {};
  public selectedType: string = '';
  public product: Product | undefined;

  constructor(private platbandService: PlatbandService, private router: Router, private cartService: CartService, private toastr: ToastrService) { }


  private apiServerUrl = environment.apiUrl;
  // Base URL for your backend server


  hello(): string {
    return this.apiServerUrl
  }

  ngOnInit(): void {
    this.getPlatbands();
  }

  formatPrice(price: number): string {
    return `${price} ₸`;
  }

  public getPlatbands(): void {
    this.platbandService.getPlatbands().subscribe(
      (response: Platband[]) => {
        this.platbands = response;
        this.filteredPlatbands = response;
        console.log('Platbands fetched successfully:', this.platbands);
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  filterPlatbands(): void {
    if (this.typeFilter) {
      this.filteredPlatbands = this.platbands?.filter(
        (platband) => platband.type === this.typeFilter
      );
    } else {
      this.filteredPlatbands = this.platbands;
    }
  }

  onVariantChange(event: Event, platband: Platband): void {
    const selectElement = event.target as HTMLSelectElement;
    const selectedVariantId = selectElement.value;
    const selectedVariant = platband.variants.find((variant: any) => variant.id == selectedVariantId);
    this.selectedVariants[platband.id] = selectedVariant;
  }

  onSelectPlatband(platband: Platband): void {
    const selectedVariant = this.selectedVariants[platband.id] || platband.variants[0];

    if (selectedVariant) {
      this.product = {
        id: selectedVariant.id + 2000,
        name: `Наличник ${platband.type} - ${platband.color} - ${platband.width}мм - ${selectedVariant.height}мм`,
        price: selectedVariant.price,
        imageUrl: platband.imageUrl || '',
      };

      this.cartService.addItem(this.product);
      console.log('Selected platband:', this.product);
      this.toastr.success(
        `<span style="color: white;">🎉 <strong>${this.product.name}</strong> добавлен в корзину!</span>`,
        '',
        {
          enableHtml: true,
          positionClass: 'toast-top-center', // Set top-center position
          toastClass: 'ngx-toastr custom-toast', // Add custom class for styling
        }
      );

      this.router.navigate(['home/frames'], { queryParams: { platbandId: platband.id } });
    } else {
      alert('Please select a variant before adding to the cart.');
    }
  }
}
