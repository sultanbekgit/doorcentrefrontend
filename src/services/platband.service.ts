import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Platband } from '../app/models/platband';
import { ProductMedia } from '../app/models/product-media';
import { AdminService } from './admin.service';

@Injectable({
  providedIn: 'root'
})
export class PlatbandService {

  private apiServerUrl = environment.apiUrl;

  constructor(private http: HttpClient, private adminService: AdminService) { }

  public getPlatbands(): Observable<Platband[]> {
    return this.http.get<Platband[]>(`${this.apiServerUrl}/platband/all`);
  }

  public getPlatbandById(id: number): Observable<Platband> {
    return this.http.get<Platband>(`${this.apiServerUrl}/platband/${id}`);
  }

  // Original single file update method
  updatePlatband(id: number, platband: Platband, file: File | null): Observable<Platband> {
    const formData = new FormData();
    formData.append('platband', new Blob([JSON.stringify(platband)], { type: 'application/json' }));
    // Only append file if provided
    if (file) {
      formData.append('file', file);
    }
    return this.http.put<Platband>(`${this.apiServerUrl}/admin/update/platband/${id}`, formData, {
      headers: this.adminService.getAuthHeaders(),
    });
  }

  // New method for updating with multiple media files
  updatePlatbandWithMultipleMedia(id: number, platband: Platband, imageFiles: File[], videoFiles: File[]): Observable<Platband> {
    const formData = new FormData();
    formData.append('platband', new Blob([JSON.stringify(platband)], { type: 'application/json' }));
    
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

    return this.http.put<Platband>(`${this.apiServerUrl}/admin/update/platband/${id}/with-multiple-media`, formData, {
      headers: this.adminService.getAuthHeaders(),
    });
  }

  // Method to add media to existing platband
  addMediaToPlatband(id: number, files: File[]): Observable<ProductMedia[]> {
    const formData = new FormData();
    
    if (files && files.length > 0) {
      files.forEach((file, index) => {
        formData.append('files', file);
      });
    }

    return this.http.post<ProductMedia[]>(`${this.apiServerUrl}/admin/platband/${id}/add-media`, formData, {
      headers: this.adminService.getAuthHeaders(),
    });
  }

  // Method to remove all media from platband
  removePlatbandMedia(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiServerUrl}/admin/platband/${id}/media`, {
      headers: this.adminService.getAuthHeaders(),
    });
  }

  // Method to get platband media
  getPlatbandMedia(id: number): Observable<ProductMedia[]> {
    return this.http.get<ProductMedia[]>(`${this.apiServerUrl}/admin/platband/${id}/media`, {
      headers: this.adminService.getAuthHeaders(),
    });
  }

  addPlatband(platband: Platband, file: File | null): Observable<Platband> {
    const formData = new FormData();
    formData.append('platband', new Blob([JSON.stringify(platband)], { type: 'application/json' }));
    // Only append file if provided
    if (file) {
      formData.append('file', file);
    }
    
    return this.http.post<Platband>(`${this.apiServerUrl}/admin/add/platband`, formData, {
      headers: this.adminService.getAuthHeaders(),
    });
  }
}
