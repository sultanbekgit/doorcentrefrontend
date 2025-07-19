import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs';
import { Frame } from '../app/models/frame';
import { ProductMedia } from '../app/models/product-media';
import { AdminService } from './admin.service';

@Injectable({
  providedIn: 'root'
})
export class FrameService {
 private apiServerUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient, private adminService: AdminService){}

  public getFrames(): Observable<Frame[]> {
    return this.http.get<Frame[]>(`${this.apiServerUrl}/frame/all`);
  }

  public getFrameById(id: number): Observable<Frame> {
    return this.http.get<Frame>(`${this.apiServerUrl}/frame/${id}`);
  }

  // Original single file update method
  updateFrame(id: number, frame: Frame, file: File | null): Observable<Frame> {
    const formData = new FormData();
    formData.append('frame', new Blob([JSON.stringify(frame)], { type: 'application/json' }));
    // Only append file if provided
    if (file) {
      formData.append('file', file);
    }
    return this.http.put<Frame>(`${this.apiServerUrl}/admin/update/frame/${id}`, formData, {
      headers: this.adminService.getAuthHeaders(),
    });
  }

  // New method for updating with multiple media files
  updateFrameWithMultipleMedia(id: number, frame: Frame, imageFiles: File[], videoFiles: File[]): Observable<Frame> {
    const formData = new FormData();
    formData.append('frame', new Blob([JSON.stringify(frame)], { type: 'application/json' }));
    
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

    return this.http.put<Frame>(`${this.apiServerUrl}/admin/update/frame/${id}/with-multiple-media`, formData, {
      headers: this.adminService.getAuthHeaders(),
    });
  }

  // Method to add media to existing frame
  addMediaToFrame(id: number, files: File[]): Observable<ProductMedia[]> {
    const formData = new FormData();
    
    if (files && files.length > 0) {
      files.forEach((file, index) => {
        formData.append('files', file);
      });
    }

    return this.http.post<ProductMedia[]>(`${this.apiServerUrl}/admin/frame/${id}/add-media`, formData, {
      headers: this.adminService.getAuthHeaders(),
    });
  }

  // Method to remove all media from frame
  removeFrameMedia(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiServerUrl}/admin/frame/${id}/media`, {
      headers: this.adminService.getAuthHeaders(),
    });
  }

  // Method to get frame media
  getFrameMedia(id: number): Observable<ProductMedia[]> {
    return this.http.get<ProductMedia[]>(`${this.apiServerUrl}/admin/frame/${id}/media`, {
      headers: this.adminService.getAuthHeaders(),
    });
  }

  addFrame(frame: Frame, file: File | null): Observable<Frame> {
    const formData = new FormData();
    formData.append('frame', new Blob([JSON.stringify(frame)], { type: 'application/json' }));
    // Only append file if provided
    if (file) {
      formData.append('file', file);
    }
    
    return this.http.post<Frame>(`${this.apiServerUrl}/admin/add/frame`, formData, {
      headers: this.adminService.getAuthHeaders(),
    });
  }
}
