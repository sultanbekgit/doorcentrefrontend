import { Component, OnInit, ViewChild, TemplateRef, ElementRef } from '@angular/core';
import { DoorService } from '../../services/door.service';
import { Door } from '../models/door';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { DoorVariant } from '../models/door-variant';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  standalone: false,
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  public doors: Door[] = [];
  public editForm: FormGroup;
  public addForm: FormGroup;
  public selectedDoor: Door | null = null;

  @ViewChild('editDoorModal') editDoorModal!: TemplateRef<any>;
  @ViewChild('addDoorModal') addDoorModal!: TemplateRef<any>;
  @ViewChild('multipleImageInput') multipleImageInput!: ElementRef;
  @ViewChild('multipleVideoInput') multipleVideoInput!: ElementRef;
  @ViewChild('addMultipleImageInput') addMultipleImageInput!: ElementRef;
  @ViewChild('addMultipleVideoInput') addMultipleVideoInput!: ElementRef;

    private apiServerUrl = environment.apiUrl;
      // Base URL for your backend server
    
    
      hello(): string {
        return this.apiServerUrl
      }
    

  constructor(
    private doorService: DoorService,
    private fb: FormBuilder,
    private modalService: NgbModal,
    private toastr: ToastrService
  ) {
    this.editForm = this.fb.group({
      name: ['', Validators.required],
      withMirror: [false],
      // imageUrl field is now managed by the backend and previewed in the modal
      imageUrl: [''],
      variants: this.fb.array([])
    });

    this.addForm = this.fb.group({
      name: ['', Validators.required],
      withMirror: [false],
      variants: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.getDoors();
  }

  get variants(): FormArray {
    return this.editForm.get('variants') as FormArray;
  }

  createVariantGroup(variant?: DoorVariant): FormGroup {
    return this.fb.group({
      id: [variant ? variant.id : null],
      height: [variant ? variant.height : null, Validators.required],
      width: [variant ? variant.width : null, Validators.required],
      price: [variant ? variant.price : null, Validators.required]
    });
  }

  private populateVariants(variants: DoorVariant[]): void {
    this.variants.clear();
    variants.forEach(variant => {
      this.variants.push(this.createVariantGroup(variant));
    });
  }

  public getDoors(): void {
    this.doorService.getDoors().subscribe(
      (response: Door[]) => {
        this.doors = response;
      },
      (error: HttpErrorResponse) => {
        this.toastr.error('Ошибка загрузки дверей.', '', { positionClass: 'toast-top-center' });
        console.error('Error fetching doors:', error);
      }
    );
  }

  openEditModal(door: Door): void {
    this.selectedDoor = door;
    // Populate the form with existing door data
    this.editForm.patchValue({
      name: door.name,
      withMirror: door.withMirror,
      imageUrl: door.imageUrl
    });
    // Populate the variants FormArray with door variants
    this.populateVariants(door.variants);
    this.modalService.open(this.editDoorModal, { centered: true });
  }

  addVariant(): void {
    this.variants.push(this.createVariantGroup());
  }

  removeVariant(index: number): void {
    this.variants.removeAt(index);
  }

  onSubmit(): void {
    if (this.editForm.valid && this.selectedDoor) {
      const updatedDoor: Door = {
        ...this.selectedDoor,
        ...this.editForm.value,
      };

      // Get multiple image files
      const multipleImageInputElement: HTMLInputElement = this.multipleImageInput.nativeElement;
      const multipleImageFiles: File[] = multipleImageInputElement.files 
        ? Array.from(multipleImageInputElement.files) 
        : [];

      // Get multiple video files
      const multipleVideoInputElement: HTMLInputElement = this.multipleVideoInput.nativeElement;
      const multipleVideoFiles: File[] = multipleVideoInputElement.files 
        ? Array.from(multipleVideoInputElement.files) 
        : [];

      // Check if multiple files are selected
      const hasMultipleFiles = multipleImageFiles.length > 0 || multipleVideoFiles.length > 0;

      if (hasMultipleFiles) {
        // Use multiple media upload
        this.doorService.updateDoorWithMultipleMedia(updatedDoor.id, updatedDoor, multipleImageFiles, multipleVideoFiles).subscribe({
          next: (door: Door) => {
            this.toastr.success('Дверь успешно обновлена с несколькими медиафайлами!', '', {
              positionClass: 'toast-top-center',
            });
            this.getDoors(); // Refresh door list
            this.modalService.dismissAll();
          },
          error: (err: any) => {
            this.toastr.error('Ошибка при обновлении двери с несколькими медиафайлами.', '', {
              positionClass: 'toast-top-center',
            });
            console.error('Error updating door with multiple media:', err);
          },
        });
      } else {
        // If no files are selected, use the regular update method
        this.doorService.updateDoor(updatedDoor.id, updatedDoor, null).subscribe({
          next: (door: Door) => {
            this.toastr.success('Дверь успешно обновлена!', '', {
              positionClass: 'toast-top-center',
            });
            this.getDoors(); // Refresh door list
            this.modalService.dismissAll();
          },
          error: (err: any) => {
            this.toastr.error('Ошибка при обновлении двери.', '', {
              positionClass: 'toast-top-center',
            });
            console.error('Error updating door:', err);
          },
        });
      }
    }
  }

  get addVariants(): FormArray {
    return this.addForm.get('variants') as FormArray;
  }

  openAddModal(): void {
    // Reset the add form
    this.addForm.reset({
      name: '',
      withMirror: false
    });
    // Clear variants
    this.addVariants.clear();
    this.modalService.open(this.addDoorModal, { centered: true });
  }

  addVariantToAddForm(): void {
    this.addVariants.push(this.createVariantGroup());
  }

  removeVariantFromAddForm(index: number): void {
    this.addVariants.removeAt(index);
  }

  onAddSubmit(): void {
    if (this.addForm.valid) {
      const newDoor: Door = {
        id: 0, // Will be set by backend
        name: this.addForm.value.name,
        withMirror: this.addForm.value.withMirror,
        imageUrl: '',
        variants: this.addForm.value.variants
      };

      // Get multiple image files
      const addMultipleImageInputElement: HTMLInputElement = this.addMultipleImageInput.nativeElement;
      const multipleImageFiles: File[] = addMultipleImageInputElement.files 
        ? Array.from(addMultipleImageInputElement.files) 
        : [];

      // Get multiple video files
      const addMultipleVideoInputElement: HTMLInputElement = this.addMultipleVideoInput.nativeElement;
      const multipleVideoFiles: File[] = addMultipleVideoInputElement.files 
        ? Array.from(addMultipleVideoInputElement.files) 
        : [];

      // Check if any files are selected
      const hasFiles = multipleImageFiles.length > 0 || multipleVideoFiles.length > 0;

      if (hasFiles) {
        // Use multiple media upload
        this.doorService.addDoorWithMultipleMedia(newDoor, multipleImageFiles, multipleVideoFiles).subscribe({
          next: (door: Door) => {
            this.toastr.success('Дверь успешно добавлена с медиафайлами!', '', {
              positionClass: 'toast-top-center',
            });
            this.getDoors(); // Refresh door list
            this.modalService.dismissAll();
          },
          error: (err: any) => {
            this.toastr.error('Ошибка при добавлении двери с медиафайлами.', '', {
              positionClass: 'toast-top-center',
            });
            console.error('Error adding door with multiple media:', err);
          },
        });
      } else {
        // Add door without any media files
        this.doorService.addDoor(newDoor, null).subscribe({
          next: (door: Door) => {
            this.toastr.success('Дверь успешно добавлена!', '', {
              positionClass: 'toast-top-center',
            });
            this.getDoors(); // Refresh door list
            this.modalService.dismissAll();
          },
          error: (err: any) => {
            this.toastr.error('Ошибка при добавлении двери.', '', {
              positionClass: 'toast-top-center',
            });
            console.error('Error adding door:', err);
          },
        });
      }
    }
  }

  deleteDoor(door: Door): void {
    const confirmed = confirm('Вы уверены, что хотите удалить эту дверь? Это действие необратимо.');
    
    if (confirmed) {
      this.doorService.deleteDoor(door.id).subscribe({
        next: () => {
          this.toastr.success('Дверь успешно удалена!', '', {
            positionClass: 'toast-top-center',
          });
          this.getDoors(); // Refresh the door list
        },
        error: (err: any) => {
          this.toastr.error('Ошибка при удалении двери.', '', {
            positionClass: 'toast-top-center',
          });
          console.error('Error deleting door:', err);
        },
      });
    }
  }
}
