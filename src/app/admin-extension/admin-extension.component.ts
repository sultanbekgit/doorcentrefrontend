import { Component, OnInit, ViewChild, TemplateRef, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ExtensionService } from '../../services/extension.service';
import { Extension } from '../models/extension';
import { ExtensionVariant } from '../models/extension-variant';
import { HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-admin-extension',
  templateUrl: './admin-extension.component.html',
  standalone: false,
  styleUrls: ['./admin-extension.component.css']
})
export class AdminExtensionComponent implements OnInit {
  public extensions: Extension[] = [];
  public editForm: FormGroup;
  public addForm: FormGroup;
  public selectedExtension: Extension | null = null;

  private apiServerUrl = environment.apiBaseUrl;
  // Base URL for your backend server


  hello(): string {
    return this.apiServerUrl
  }


  @ViewChild('editExtensionModal') editExtensionModal!: TemplateRef<any>;
  @ViewChild('addExtensionModal') addExtensionModal!: TemplateRef<any>;
  @ViewChild('fileInput') fileInput!: ElementRef;
  @ViewChild('addFileInput') addFileInput!: ElementRef;

  constructor(
    private extensionService: ExtensionService,
    private fb: FormBuilder,
    private modalService: NgbModal,
    private toastr: ToastrService
  ) {
    this.editForm = this.fb.group({
      type: ['', Validators.required],
      imageUrl: [''],
      variants: this.fb.array([])
    });

    this.addForm = this.fb.group({
      type: ['', Validators.required],
      variants: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.getExtensions();
  }

  get variants(): FormArray {
    return this.editForm.get('variants') as FormArray;
  }

  private createVariantGroup(variant?: ExtensionVariant): FormGroup {
    return this.fb.group({
      id: [variant ? variant.id : null],
      height: [variant ? variant.height : null, Validators.required],
      width: [variant ? variant.width : null, Validators.required],
      price: [variant ? variant.price : null, Validators.required]
    });
  }

  private populateVariants(variants: ExtensionVariant[]): void {
    this.variants.clear();
    variants.forEach(variant => this.variants.push(this.createVariantGroup(variant)));
  }

  public getExtensions(): void {
    this.extensionService.getExtensions().subscribe({
      next: (response: Extension[]) => {
        this.extensions = response;
      },
      error: (error: HttpErrorResponse) => {
        this.toastr.error('Ошибка загрузки доборок.', '', { positionClass: 'toast-top-center' });
        console.error('Error fetching extensions:', error);
      }
    });
  }

  openEditModal(extension: Extension): void {
    this.selectedExtension = extension;
    this.editForm.patchValue({
      type: extension.type,
      imageUrl: extension.imageUrl
    });
    this.populateVariants(extension.variants);
    this.modalService.open(this.editExtensionModal, { centered: true });
  }

  addVariant(): void {
    this.variants.push(this.createVariantGroup());
  }

  removeVariant(index: number): void {
    this.variants.removeAt(index);
  }

  onSubmit(): void {
    if (this.editForm.valid && this.selectedExtension) {
      const updatedExtension: Extension = {
        ...this.selectedExtension,
        ...this.editForm.value
      };

      const fileInputElement: HTMLInputElement = this.fileInput.nativeElement;
      const file: File | null = fileInputElement.files && fileInputElement.files.length > 0
        ? fileInputElement.files[0]
        : null;

      this.extensionService.updateExtension(updatedExtension.id, updatedExtension, file).subscribe({
        next: (extension: Extension) => {
          this.toastr.success('Доборка успешно обновлена!', '', {
            positionClass: 'toast-top-center'
          });
          this.getExtensions();
          this.modalService.dismissAll();
        },
        error: (err) => {
          this.toastr.error('Ошибка при обновлении доборки.', '', {
            positionClass: 'toast-top-center'
          });
          console.error('Error updating extension:', err);
        }
      });
    }
  }

  get addVariants(): FormArray {
    return this.addForm.get('variants') as FormArray;
  }

  openAddModal(): void {
    // Reset the add form
    this.addForm.reset({
      type: ''
    });
    // Clear variants
    this.addVariants.clear();
    this.modalService.open(this.addExtensionModal, { centered: true });
  }

  addVariantToAddForm(): void {
    this.addVariants.push(this.createVariantGroup());
  }

  removeVariantFromAddForm(index: number): void {
    this.addVariants.removeAt(index);
  }

  onAddSubmit(): void {
    if (this.addForm.valid) {
      const newExtension: Extension = {
        id: 0, // Will be set by backend
        type: this.addForm.value.type,
        imageUrl: '',
        variants: this.addForm.value.variants
      };

      // Get the image file from the add file input (if one is selected)
      const addFileInputElement: HTMLInputElement = this.addFileInput.nativeElement;
      const imageFile: File | null = addFileInputElement.files && addFileInputElement.files.length > 0
        ? addFileInputElement.files[0]
        : null;

      this.extensionService.addExtension(newExtension, imageFile).subscribe({
        next: (extension: Extension) => {
          this.toastr.success('Доборка успешно добавлена!', '', {
            positionClass: 'toast-top-center',
          });
          this.getExtensions(); // Refresh list
          this.modalService.dismissAll();
        },
        error: (err: any) => {
          this.toastr.error('Ошибка при добавлении доборки.', '', {
            positionClass: 'toast-top-center',
          });
          console.error('Error adding extension:', err);
        },
      });
    }
  }
}
