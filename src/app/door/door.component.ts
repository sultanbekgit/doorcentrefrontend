import { Component, OnInit } from '@angular/core';
import { DoorService } from '../../services/door.service';
import { Door } from '../models/door';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { CartService } from '../cart.service';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../environments/environment';
import { UrlService } from '../services/url.service';

interface Product {
  id: number;
  name: string;
  price: number | undefined;
  imageUrl: string;
}

@Component({
  selector: 'app-door',
  templateUrl: './door.component.html',
  standalone: false,
  styleUrls: ['./door.component.css']
})
export class DoorComponent implements OnInit {
  public doors: Door[] = [];
  public filteredDoors: Door[] = [];
  public product: Product | undefined;
  public videoVisibility: { [doorId: number]: boolean } = {}; // Track video visibility per door
  public currentMediaIndex: { [doorId: number]: number } = {}; // Track current media index per door

  private heightInput: string = '';
  private widthInput: string = '';
  private currentSortOption: string = '';

  private apiServerUrl = environment.apiUrl;
  // Base URL for your backend server


  hello(): string {
    return this.apiServerUrl;
  }

  getMediaUrl(url: string | null | undefined): string {
    return this.urlService.getMediaUrl(url);
  }

  // Save selected variants for each door
  selectedVariants: { [doorId: number]: any } = {};

  // Helper methods for media navigation
  getTotalMediaCount(door: Door): number {
    const imageCount = door.images?.length || (door.imageUrl ? 1 : 0);
    const videoCount = door.videos?.length || (door.videoUrl ? 1 : 0);
    return imageCount + videoCount;
  }

  getCurrentMediaIndex(door: Door): number {
    return this.currentMediaIndex[door.id] || 0;
  }

  navigateToMedia(event: Event, door: Door, direction: 'prev' | 'next'): void {
    event.preventDefault();
    
    const button = event.target as HTMLElement;
    const card = button.closest('.card');
    const scrollContainer = card?.querySelector('.scroll-container') as HTMLElement;
    
    if (scrollContainer) {
      const totalCount = this.getTotalMediaCount(door);
      const currentIndex = this.getCurrentMediaIndex(door);
      
      let newIndex = currentIndex;
      if (direction === 'next') {
        newIndex = (currentIndex + 1) % totalCount;
      } else {
        newIndex = (currentIndex - 1 + totalCount) % totalCount;
      }
      
      // Update the current media index
      this.currentMediaIndex[door.id] = newIndex;
      
      // Scroll to the new position
      scrollContainer.scrollTo({
        left: newIndex * scrollContainer.offsetWidth,
        behavior: 'smooth'
      });
      
      // Update video visibility based on new position
      this.updateVideoVisibilityFromIndex(door, newIndex);
    }
  }

  private updateVideoVisibilityFromIndex(door: Door, index: number): void {
    const imageCount = door.images?.length || (door.imageUrl ? 1 : 0);
    this.videoVisibility[door.id] = index >= imageCount;
  }

  // Helper method to get media array for display
  getMediaArray(door: Door): Array<{mediaUrl: string, mediaType: 'IMAGE' | 'VIDEO', displayOrder: number}> {
    const mediaArray: Array<{mediaUrl: string, mediaType: 'IMAGE' | 'VIDEO', displayOrder: number}> = [];
    
    // Add images
    if (door.images?.length) {
      door.images.forEach(image => {
        mediaArray.push({
          mediaUrl: image.mediaUrl,
          mediaType: 'IMAGE',
          displayOrder: image.displayOrder
        });
      });
    } else if (door.imageUrl) {
      mediaArray.push({
        mediaUrl: door.imageUrl,
        mediaType: 'IMAGE',
        displayOrder: 0
      });
    }
    
    // Add videos
    if (door.videos?.length) {
      door.videos.forEach(video => {
        mediaArray.push({
          mediaUrl: video.mediaUrl,
          mediaType: 'VIDEO',
          displayOrder: video.displayOrder + 1000 // Ensure videos come after images
        });
      });
    } else if (door.videoUrl) {
      mediaArray.push({
        mediaUrl: door.videoUrl,
        mediaType: 'VIDEO',
        displayOrder: 1000
      });
    }
    
    return mediaArray.sort((a, b) => a.displayOrder - b.displayOrder);
  }

  constructor(
    private doorService: DoorService,
    private router: Router,
    private cartService: CartService,
    private toastr: ToastrService,
    private urlService: UrlService
  ) { }

  formatPrice(price: number): string {
    return `${price} ₸`;
  }

  onVariantChange(event: Event, door: any) {
    const selectElement = event.target as HTMLSelectElement;
    const selectedVariantId = selectElement.value;
    const selectedVariant = door.variants.find((variant: any) => variant.id == selectedVariantId);
    this.selectedVariants[door.id] = selectedVariant;
  }

  public getDoors(): void {
    this.doorService.getDoors().subscribe(
      (response: Door[]) => {
        this.doors = response;
        // Initialize video visibility state after doors are loaded
        this.initializeVideoVisibility();
      },
      (error: HttpErrorResponse) => {
        console.error('Error fetching doors:', error);
      }
    );
  }

  fetchDoorsByDimensions(height: string, width: string): void {
    this.doorService.getDoorsByHeightAndWidth(height, width).subscribe({
      next: (response: Door[]) => {
        this.doors = response;
        console.log('Doors fetched successfully:', this.doors);
      },
      error: (err) => {
        console.error('Error fetching doors:', err);
      },
    });
  }

  onSelectDoor(door: Door): void {
    const mirrorText = door.withMirror ? " (со стеклом)" : "";
    const selectedVariant = this.selectedVariants[door.id] || door.variants[0]; // default to the first variant if none selected
    console.log("Selected variant: ", selectedVariant);
    this.product = {
      id: selectedVariant.id + 1000,
      name: `Дверь ${door.name}${mirrorText} - ${selectedVariant.height}см - ${selectedVariant.width}см`,
      price: door.variants.find((variant: any) => variant.id == selectedVariant.id)?.price,
      // If needed, you can also prepend the backend URL here for other uses
      imageUrl: door.imageUrl || '',
    };

    console.log('Selected door:', this.product);
    this.cartService.addItem(this.product);
    this.toastr.success(
      `<span style="color: white;">🎉 <strong>${this.product.name}</strong> добавлен в корзину!</span>`,
      '',
      {
        enableHtml: true,
        positionClass: 'toast-top-center',
        toastClass: 'ngx-toastr custom-toast',
      }
    );
    this.router.navigate(['home/platbands'], { queryParams: { doorId: door.id } });
  }

  ngOnInit() {
    this.getDoors();
  }

  initializeVideoVisibility(): void {
    // Initialize video visibility state to false for all doors
    this.doors.forEach(door => {
      this.videoVisibility[door.id] = false;
      this.currentMediaIndex[door.id] = 0;
    });
  }

  onScroll(event: WheelEvent): void {
    // Prevent default vertical scroll behavior
    event.preventDefault();
    
    // Get the scroll container
    const scrollContainer = event.currentTarget as HTMLElement;
    
    // Horizontal scroll based on wheel direction
    // Positive deltaY = scroll right, negative deltaY = scroll left
    const scrollAmount = event.deltaY > 0 ? 100 : -100;
    
    // Apply horizontal scroll
    scrollContainer.scrollLeft += scrollAmount;
    
    // Update current media index and video visibility state based on scroll position
    this.updateMediaStateFromScroll(scrollContainer);
  }

  updateMediaStateFromScroll(scrollContainer: HTMLElement): void {
    // Find the door ID from the card containing this scroll container
    const card = scrollContainer.closest('.card');
    const doorCard = card?.closest('[data-door-id]');
    
    if (doorCard) {
      const doorId = parseInt(doorCard.getAttribute('data-door-id') || '0');
      const door = this.doors.find(d => d.id === doorId);
      
      if (door) {
        // Calculate current media index based on scroll position
        const itemWidth = scrollContainer.offsetWidth;
        const currentIndex = Math.round(scrollContainer.scrollLeft / itemWidth);
        
        // Update current media index
        this.currentMediaIndex[doorId] = Math.max(0, Math.min(currentIndex, this.getTotalMediaCount(door) - 1));
        
        // Update video visibility based on current position
        this.updateVideoVisibilityFromIndex(door, this.currentMediaIndex[doorId]);
      }
    }
  }

  // New sorting functionality
  onSortChange(event: any): void {
    this.currentSortOption = event.target.value;
    this.sortDoors();
  }

  sortDoors(): void {
    const doorsToSort = this.filteredDoors.length > 0 ? this.filteredDoors : this.doors;
    
    switch (this.currentSortOption) {
      case 'price-asc':
        doorsToSort.sort((a, b) => this.getMinPrice(a) - this.getMinPrice(b));
        break;
      case 'price-desc':
        doorsToSort.sort((a, b) => this.getMinPrice(b) - this.getMinPrice(a));
        break;
      case 'size-asc':
        doorsToSort.sort((a, b) => this.getMinSize(a) - this.getMinSize(b));
        break;
      case 'size-desc':
        doorsToSort.sort((a, b) => this.getMinSize(b) - this.getMinSize(a));
        break;
      case 'name':
        doorsToSort.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        // No sorting
        break;
    }
  }

  private getMinPrice(door: Door): number {
    if (door.variants && door.variants.length > 0) {
      return Math.min(...door.variants.map(v => v.price));
    }
    return 0;
  }

  private getMinSize(door: Door): number {
    if (door.variants && door.variants.length > 0) {
      return Math.min(...door.variants.map(v => v.height * v.width));
    }
    return 0;
  }

  // Reset filters functionality
  resetFilters(): void {
    this.heightInput = '';
    this.widthInput = '';
    this.currentSortOption = '';
    
    // Clear input values
    const heightInput = document.getElementById('heightInput') as HTMLInputElement;
    const widthInput = document.getElementById('widthInput') as HTMLInputElement;
    const sortSelect = document.getElementById('sortSelect') as HTMLSelectElement;
    
    if (heightInput) heightInput.value = '';
    if (widthInput) widthInput.value = '';
    if (sortSelect) sortSelect.value = '';
    
    // Reset to original doors list
    this.filteredDoors = [];
    this.doors = [...this.doors]; // Trigger change detection
  }



  // Enhanced filter functionality
  filterDoors(): void {
    const heightInput = document.getElementById('heightInput') as HTMLInputElement;
    const widthInput = document.getElementById('widthInput') as HTMLInputElement;
    
    this.heightInput = heightInput?.value || '';
    this.widthInput = widthInput?.value || '';

    if (!this.heightInput && !this.widthInput) {
      this.filteredDoors = [];
      return;
    }

    this.filteredDoors = this.doors.filter(door => {
      if (!door.variants || door.variants.length === 0) {
        return false;
      }

      return door.variants.some(variant => {
        const heightMatch = !this.heightInput || variant.height.toString().includes(this.heightInput);
        const widthMatch = !this.widthInput || variant.width.toString().includes(this.widthInput);
        return heightMatch && widthMatch;
      });
    });

    // Apply current sorting to filtered results
    if (this.currentSortOption) {
      this.sortDoors();
    }
  }
}
