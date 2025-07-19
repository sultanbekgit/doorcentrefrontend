import { Component, OnInit } from '@angular/core';
import { FrameService } from '../../services/frame.service';
import { Router } from '@angular/router';
import { Frame } from '../models/frame';
import { HttpErrorResponse } from '@angular/common/http';
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
  selector: 'app-frame',
  standalone: false,

  templateUrl: './frame.component.html',
  styleUrl: './frame.component.css'
})
export class FrameComponent implements OnInit {

  public product: Product | undefined;
  public frames: Frame[] | undefined;
  selectedVariants: { [frameId: number]: any } = {};

  constructor(
    private frameService: FrameService,
    private router: Router,
    private cartService: CartService,
    private toastr: ToastrService
  ) {}

    private apiServerUrl = environment.apiUrl;
    // Base URL for your backend server
  
  
    hello(): string {
      return this.apiServerUrl
    }
  

  ngOnInit(): void {
    this.getFrames();
  }

  formatPrice(price: number): string {
    return `${price} ₸`;
  }

  onVariantChange(event: Event, frame: any): void {
    const selectElement = event.target as HTMLSelectElement;
    const selectedVariantId = selectElement.value;
    const selectedVariant = frame.variants.find((variant: any) => variant.id == selectedVariantId);
    this.selectedVariants[frame.id] = selectedVariant;
  }

  public getFrames(): void {
    this.frameService.getFrames().subscribe(
      (response: Frame[]) => {
        this.frames = response;
        console.log(this.frames);
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  onSelectFrame(frame: Frame): void {
    const selectedVariant = this.selectedVariants[frame.id] || frame.variants[0]; // Default to the first variant if none is selected
    console.log("Selected variant: ", selectedVariant);

    this.product = {
      id: selectedVariant.id + 3000, // Use the selected variant ID with an offset
      name: `Коробка ${frame.type} - ${selectedVariant.height}мм - ${frame.width}мм`,
      price: selectedVariant.price,
      imageUrl: frame.imageUrl || '', // Default to an empty string if no image URL
    };

    console.log('Selected frame:', this.product);

    this.cartService.addItem(this.product);

    this.toastr.success(
      `<span style="color: white;">🎉 <strong>${this.product.name}</strong> добавлен в корзину!</span>`,
      '',
      {
        enableHtml: true,
        positionClass: 'toast-top-center', // Set top-center position
        toastClass: 'ngx-toastr custom-toast', // Add custom class for styling
      }
    );

    this.router.navigate(['home/extensions'], { queryParams: { frameId: frame.id } });
  }
}
