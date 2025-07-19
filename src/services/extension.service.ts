import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Extension } from '../app/models/extension';
import { ProductMedia } from '../app/models/product-media';
import { Observable } from 'rxjs';
import { AdminService } from './admin.service';

@Injectable({
  providedIn: 'root'
})
export class ExtensionService {

  private apiServerUrl = environment.apiUrl;

  constructor(private http: HttpClient, private adminService: AdminService) { }

  public getExtensions(): Observable<Extension[]> {
    return this.http.get<Extension[]>(`${this.apiServerUrl}/extension/all`);
  }

  public getExtensionById(id: number): Observable<Extension> {
    return this.http.get<Extension>(`${this.apiServerUrl}/extension/${id}`);
  }

  // Original single file update method
  updateExtension(id: number, extension: Extension, file: File | null): Observable<Extension> {
    const formData = new FormData();
    formData.append('extension', new Blob([JSON.stringify(extension)], { type: 'application/json' }));
    // Only append file if provided
    if (file) {
      formData.append('file', file);
    }
    return this.http.put<Extension>(`${this.apiServerUrl}/admin/update/extension/${id}`, formData, {
      headers: this.adminService.getAuthHeaders(),
    });
  }

  // New method for updating with multiple media files
  updateExtensionWithMultipleMedia(id: number, extension: Extension, imageFiles: File[], videoFiles: File[]): Observable<Extension> {
    const formData = new FormData();
    formData.append('extension', new Blob([JSON.stringify(extension)], { type: 'application/json' }));
    
    // Append image files
    if (imageFiles && imageFiles.length > 0) {
      imageFiles.forEach((file, index) => {
        formData.append('imageFiles', file);
      });
    }
    
    // Append video files
    if (videoFiles && videoFiles.length > 0) {
      videoFiles.forEach((file, index) => {
        formData.append('videoFiles', file);
      });
    }

    return this.http.put<Extension>(`${this.apiServerUrl}/admin/update/extension/${id}/with-multiple-media`, formData, {
      headers: this.adminService.getAuthHeaders(),
    });
  }

  // Method to add media to existing extension
  addMediaToExtension(id: number, files: File[]): Observable<ProductMedia[]> {
    const formData = new FormData();
    
    if (files && files.length > 0) {
      files.forEach((file, index) => {
        formData.append('files', file);
      });
    }

    return this.http.post<ProductMedia[]>(`${this.apiServerUrl}/admin/extension/${id}/add-media`, formData, {
      headers: this.adminService.getAuthHeaders(),
    });
  }

  // Method to remove all media from extension
  removeExtensionMedia(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiServerUrl}/admin/extension/${id}/media`, {
      headers: this.adminService.getAuthHeaders(),
    });
  }

  // Method to get extension media
  getExtensionMedia(id: number): Observable<ProductMedia[]> {
    return this.http.get<ProductMedia[]>(`${this.apiServerUrl}/admin/extension/${id}/media`, {
      headers: this.adminService.getAuthHeaders(),
    });
  }

  addExtension(extension: Extension, file: File | null): Observable<Extension> {
    const formData = new FormData();
    formData.append('extension', new Blob([JSON.stringify(extension)], { type: 'application/json' }));
    // Only append file if provided
    if (file) {
      formData.append('file', file);
    }
    
    return this.http.post<Extension>(`${this.apiServerUrl}/admin/add/extension`, formData, {
      headers: this.adminService.getAuthHeaders(),
    });
  }
}
