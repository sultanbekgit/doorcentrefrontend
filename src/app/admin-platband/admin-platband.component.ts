import { Component, OnInit, ViewChild, TemplateRef, ElementRef } from '@angular/core';
import { PlatbandService } from '../../services/platband.service';
import { Platband } from '../models/platband';
import { ProductMedia } from '../models/product-media';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { PlatbandVariant } from '../models/platband-variant';
import { environment } from '../../environments/environment';
import { UrlService } from '../services/url.service';

@Component({
  selector: 'app-admin-platband',
  templateUrl: './admin-platband.component.html',
  standalone: false,
  styleUrls: ['./admin-platband.component.css']
})
export class AdminPlatbandComponent implements OnInit {
  public platbands: Platband[] = [];
  public editForm: FormGroup;
  public addForm: FormGroup;
  public selectedPlatband: Platband | null = null;
  private apiServerUrl = environment.apiUrl;

  @ViewChild('editPlatbandModal') editPlatbandModal!: TemplateRef<any>;
  @ViewChild('addPlatbandModal') addPlatbandModal!: TemplateRef<any>;
  @ViewChild('fileInput') fileInput!: ElementRef;
  @ViewChild('addFileInput') addFileInput!: ElementRef;

  constructor(
    private platbandService: PlatbandService,
    private fb: FormBuilder,
    private modalService: NgbModal,
    private toastr: ToastrService,
    private urlService: UrlService
  ) {
    this.editForm = this.fb.group({
      width: [null, Validators.required],
      color: ['', Validators.required],
      type: ['', Validators.required],
      imageUrl: [''],
      variants: this.fb.array([])
    });

    this.addForm = this.fb.group({
      width: [null, Validators.required],
      color: ['', Validators.required],
      type: ['', Validators.required],
      variants: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.getPlatbands();
  }

  hello(): string {
    return this.apiServerUrl;
  }

  getMediaUrl(url: string | null | undefined): string {
    return this.urlService.getMediaUrl(url);
  }

  get variants(): FormArray {
    return this.editForm.get('variants') as FormArray;
  }

  // Helper methods for displaying media information
  getDisplayImage(platband: Platband): string {
    if (platband.media && platband.media.length > 0) {
      const firstImage = platband.media.find(m => m.mediaType === 'IMAGE');
      if (firstImage) {
        return this.hello() + firstImage.mediaUrl;
      }
    }
    return this.hello() + platband.imageUrl;
  }

  getImageCount(platband: Platband): number {
    if (!platband.media) return 0;
    return platband.media.filter(m => m.mediaType === 'IMAGE').length;
  }

  getVideoCount(platband: Platband): number {
    if (!platband.media) return 0;
    return platband.media.filter(m => m.mediaType === 'VIDEO').length;
  }





  createVariantGroup(variant?: PlatbandVariant): FormGroup {
    return this.fb.group({
      id: [variant ? variant.id : null],
      height: [variant ? variant.height : null, Validators.required],
      price: [variant ? variant.price : null, Validators.required]
    });
  }

  private populateVariants(variants: PlatbandVariant[]): void {
    this.variants.clear();
    variants.forEach(variant => {
      this.variants.push(this.createVariantGroup(variant));
    });
  }

  public getPlatbands(): void {
    this.platbandService.getPlatbands().subscribe(
      (response: Platband[]) => {
        this.platbands = response;
      },
      (error: HttpErrorResponse) => {
        this.toastr.error('Ошибка загрузки наличников.', '', { positionClass: 'toast-top-center' });
        console.error('Error fetching platbands:', error);
      }
    );
  }

  openEditModal(platband: Platband): void {
    this.selectedPlatband = platband;
    this.editForm.patchValue({
      width: platband.width,
      color: platband.color,
      type: platband.type,
      imageUrl: platband.imageUrl
    });
    this.populateVariants(platband.variants);
    
    this.modalService.open(this.editPlatbandModal, { centered: true });
  }

  addVariant(): void {
    this.variants.push(this.createVariantGroup());
  }

  removeVariant(index: number): void {
    this.variants.removeAt(index);
  }

  onSubmit(): void {
    if (this.editForm.valid && this.selectedPlatband) {
      const updatedPlatband: Platband = {
        ...this.selectedPlatband,
        ...this.editForm.value
      };

      console.log('=== PLATBAND UPDATE DEBUG ===');
      console.log('Updated platband object:', updatedPlatband);
      console.log('Form value:', this.editForm.value);
      console.log('Selected platband:', this.selectedPlatband);

      const fileInputElement: HTMLInputElement = this.fileInput.nativeElement;
      const file: File | null = fileInputElement.files && fileInputElement.files.length > 0
        ? fileInputElement.files[0]
        : null;

      console.log('Selected file:', file);
      console.log('File input element:', fileInputElement);

      this.platbandService.updatePlatband(updatedPlatband.id, updatedPlatband, file).subscribe({
        next: (platband: Platband) => {
          console.log('Update successful:', platband);
          this.toastr.success('Наличник успешно обновлен!', '', { positionClass: 'toast-top-center' });
          this.getPlatbands();
          this.modalService.dismissAll();
        },
        error: (err) => {
          console.error('=== UPDATE ERROR DETAILS ===');
          console.error('Error object:', err);
          console.error('Error status:', err.status);
          console.error('Error message:', err.message);
          console.error('Error details:', err.error);
          this.toastr.error('Ошибка при обновлении наличника.', '', { positionClass: 'toast-top-center' });
        }
      });
    } else {
      console.log('Form invalid or no platband selected');
      console.log('Form valid:', this.editForm.valid);
      console.log('Selected platband:', this.selectedPlatband);
      console.log('Form errors:', this.editForm.errors);
    }
  }

  get addVariants(): FormArray {
    return this.addForm.get('variants') as FormArray;
  }

  openAddModal(): void {
    // Reset the add form
    this.addForm.reset({
      width: null,
      color: '',
      type: ''
    });
    // Clear variants
    this.addVariants.clear();
    this.modalService.open(this.addPlatbandModal, { centered: true });
  }

  addVariantToAddForm(): void {
    this.addVariants.push(this.createVariantGroup());
  }

  removeVariantFromAddForm(index: number): void {
    this.addVariants.removeAt(index);
  }

  onAddSubmit(): void {
    if (this.addForm.valid) {
      const newPlatband: Platband = {
        id: 0, // Will be set by backend
        width: this.addForm.value.width,
        color: this.addForm.value.color,
        type: this.addForm.value.type,
        imageUrl: '',
        variants: this.addForm.value.variants
      };

      // Get the image file from the add file input (if one is selected)
      const addFileInputElement: HTMLInputElement = this.addFileInput.nativeElement;
      const imageFile: File | null = addFileInputElement.files && addFileInputElement.files.length > 0
        ? addFileInputElement.files[0]
        : null;

      this.platbandService.addPlatband(newPlatband, imageFile).subscribe({
        next: (platband: Platband) => {
          this.toastr.success('Наличник успешно добавлен!', '', {
            positionClass: 'toast-top-center',
          });
          this.getPlatbands(); // Refresh list
          this.modalService.dismissAll();
        },
        error: (err: any) => {
          this.toastr.error('Ошибка при добавлении наличника.', '', {
            positionClass: 'toast-top-center',
          });
          console.error('Error adding platband:', err);
        },
      });
    }
  }
}
