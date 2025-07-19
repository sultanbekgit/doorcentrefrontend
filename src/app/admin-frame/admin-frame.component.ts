import { Component, OnInit, ViewChild, TemplateRef, ElementRef } from '@angular/core';
import { FrameService } from '../../services/frame.service';
import { Frame } from '../models/frame';
import { FrameVariant } from '../models/frame-variant';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-admin-frame',
  standalone: false,
  templateUrl: './admin-frame.component.html',
  styleUrls: ['./admin-frame.component.css']
})
export class AdminFrameComponent implements OnInit {
  public frames: Frame[] = [];
  public editForm: FormGroup;
  public addForm: FormGroup;
  public selectedFrame: Frame | null = null;

  @ViewChild('editFrameModal') editFrameModal!: TemplateRef<any>;
  @ViewChild('addFrameModal') addFrameModal!: TemplateRef<any>;
  @ViewChild('fileInput') fileInput!: ElementRef;
  @ViewChild('addFileInput') addFileInput!: ElementRef;

  private apiServerUrl = environment.apiBaseUrl;
  // Base URL for your backend server


  hello(): string {
    return this.apiServerUrl
  }


  constructor(
    private frameService: FrameService,
    private fb: FormBuilder,
    private modalService: NgbModal,
    private toastr: ToastrService
  ) {
    this.editForm = this.fb.group({
      width: [null, Validators.required],
      thickness: [null, Validators.required],
      type: ['', Validators.required],
      color: ['', Validators.required],
      imageUrl: [''],
      variants: this.fb.array([])
    });

    this.addForm = this.fb.group({
      width: [null, Validators.required],
      thickness: [null, Validators.required],
      type: ['', Validators.required],
      color: ['', Validators.required],
      variants: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.getFrames();
  }

  get variants(): FormArray {
    return this.editForm.get('variants') as FormArray;
  }

  createVariantGroup(variant?: FrameVariant): FormGroup {
    return this.fb.group({
      id: [variant ? variant.id : null],
      height: [variant ? variant.height : null, Validators.required],
      price: [variant ? variant.price : null, Validators.required]
    });
  }

  private populateVariants(variants: FrameVariant[]): void {
    this.variants.clear();
    variants.forEach(variant => this.variants.push(this.createVariantGroup(variant)));
  }

  public getFrames(): void {
    this.frameService.getFrames().subscribe(
      (response: Frame[]) => {
        this.frames = response;
      },
      (error: HttpErrorResponse) => {
        this.toastr.error('Ошибка загрузки рамок.', '', { positionClass: 'toast-top-center' });
        console.error('Error fetching frames:', error);
      }
    );
  }

  openEditModal(frame: Frame): void {
    this.selectedFrame = frame;
    this.editForm.patchValue({
      width: frame.width,
      thickness: frame.thickness,
      type: frame.type,
      color: frame.color,
      imageUrl: frame.imageUrl
    });
    this.populateVariants(frame.variants);
    this.modalService.open(this.editFrameModal, { centered: true });
  }

  addVariant(): void {
    this.variants.push(this.createVariantGroup());
  }

  removeVariant(index: number): void {
    this.variants.removeAt(index);
  }

  onSubmit(): void {
    if (this.editForm.valid && this.selectedFrame) {
      const updatedFrame: Frame = {
        ...this.selectedFrame,
        ...this.editForm.value
      };

      const fileInputElement: HTMLInputElement = this.fileInput.nativeElement;
      const file: File | null = fileInputElement.files && fileInputElement.files.length > 0
        ? fileInputElement.files[0]
        : null;

      this.frameService.updateFrame(updatedFrame.id, updatedFrame, file).subscribe({
        next: (frame: Frame) => {
          this.toastr.success('Рамка успешно обновлена!', '', { positionClass: 'toast-top-center' });
          this.getFrames();
          this.modalService.dismissAll();
        },
        error: (err) => {
          this.toastr.error('Ошибка при обновлении рамки.', '', { positionClass: 'toast-top-center' });
          console.error('Error updating frame:', err);
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
      width: null,
      thickness: null,
      type: '',
      color: ''
    });
    // Clear variants
    this.addVariants.clear();
    this.modalService.open(this.addFrameModal, { centered: true });
  }

  addVariantToAddForm(): void {
    this.addVariants.push(this.createVariantGroup());
  }

  removeVariantFromAddForm(index: number): void {
    this.addVariants.removeAt(index);
  }

  onAddSubmit(): void {
    if (this.addForm.valid) {
      const newFrame: Frame = {
        id: 0, // Will be set by backend
        width: this.addForm.value.width,
        thickness: this.addForm.value.thickness,
        type: this.addForm.value.type,
        color: this.addForm.value.color,
        imageUrl: '',
        variants: this.addForm.value.variants
      };

      // Get the image file from the add file input (if one is selected)
      const addFileInputElement: HTMLInputElement = this.addFileInput.nativeElement;
      const imageFile: File | null = addFileInputElement.files && addFileInputElement.files.length > 0
        ? addFileInputElement.files[0]
        : null;

      this.frameService.addFrame(newFrame, imageFile).subscribe({
        next: (frame: Frame) => {
          this.toastr.success('Рамка успешно добавлена!', '', {
            positionClass: 'toast-top-center',
          });
          this.getFrames(); // Refresh list
          this.modalService.dismissAll();
        },
        error: (err: any) => {
          this.toastr.error('Ошибка при добавлении рамки.', '', {
            positionClass: 'toast-top-center',
          });
          console.error('Error adding frame:', err);
        },
      });
    }
  }
}
