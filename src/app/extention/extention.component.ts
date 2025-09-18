import { Component, OnInit } from '@angular/core';
import { ExtensionService } from '../../services/extension.service';
import { Router } from '@angular/router';
import { Extension } from '../models/extension';
import { HttpErrorResponse } from '@angular/common/http';
import { CartService } from '../cart.service';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../environments/environment';
import { UrlService } from '../services/url.service';
interface Product {
  id: number,
  name: string,

  price: number | undefined,
  imageUrl: string
}


@Component({
  selector: 'app-extention',
  standalone: false,

  templateUrl: './extention.component.html',
  styleUrl: './extention.component.css'
})
export class ExtentionComponent implements OnInit {
  public extensions: Extension[] = [];
  public filteredExtensions: Extension[] = [];
  public selectedExtensionType: string = ""
  public selectedVariant: { [key: number]: any } = {};
  public product : Product | undefined;
 


  constructor(private extensionService: ExtensionService, private router: Router, private cartService: CartService,  
    private toastr: ToastrService, private urlService: UrlService) { }

   private apiServerUrl = environment.apiUrl;
    // Base URL for your backend server
  
  
    hello(): string {
      return this.apiServerUrl
    }

    getMediaUrl(url: string | null | undefined): string {
      return this.urlService.getMediaUrl(url);
    }
  

  ngOnInit(): void {
    this.getExtensions();
  }

  public getExtensions(): void {
    this.extensionService.getExtensions().subscribe(
      (response: Extension[]) => {
        this.extensions = response;
        this.filteredExtensions = response; // Initialize with all extensions
        
        // Set default selected variant for each extension
        this.extensions.forEach((extension) => {
          if (extension.variants && extension.variants.length > 0) {
            this.selectedVariant[extension.id] = extension.variants[0].id; // Default to the first variant
          }
        });
  
        console.log(this.extensions);
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }



  public onSelectExtension(extension: Extension): void {
    const selectedVariantId = this.selectedVariant[extension.id];
    const selectedVariant = extension.variants.find((variant: any) => variant.id == selectedVariantId);
  
    if (selectedVariant) {
      this.product = {
        id: selectedVariant.id + 4000,
        name: `Доборка ${extension.type} - ${selectedVariant.height}мм - ${selectedVariant.width}мм`,
        price: selectedVariant.price,
        imageUrl: extension.imageUrl || '', // Default to an empty string if no image URL
      };
  
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
     
      console.log("Product added to cart:", this.product);
    } else {
      alert("Пожалуйста, выберите вариант перед добавлением в корзину.");
    }
  }
}
