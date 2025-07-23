import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { Frame } from '../app/models/frame';
import { ProductMedia } from '../app/models/product-media';
import { AdminService } from './admin.service';
import { LoadingService } from './loading.service';

@Injectable({
  providedIn: 'root'
})
export class FrameService {
 private apiServerUrl = environment.apiUrl;

  constructor(private http: HttpClient, private adminService: AdminService, private loadingService: LoadingService){}

  public getFrames(): Observable<Frame[]> {
    this.loadingService.startLoading();
    return this.http.get<Frame[]>(`${this.apiServerUrl}/frame/all`).pipe(
      finalize(() => this.loadingService.stopLoading())
    );
  }

  public getFrameById(id: number): Observable<Frame> {
    this.loadingService.startLoading();
    return this.http.get<Frame>(`${this.apiServerUrl}/frame/${id}`).pipe(
      finalize(() => this.loadingService.stopLoading())
    );
  }

  // Original single file update method
  updateFrame(id: number, frame: Frame, file: File | null): Observable<Frame> {
    this.loadingService.startLoading();
    const formData = new FormData();
    formData.append('frame', new Blob([JSON.stringify(frame)], { type: 'application/json' }));
    // Only append file if provided
    if (file) {
      formData.append('file', file);
    }
    return this.http.put<Frame>(`${this.apiServerUrl}/admin/update/frame/${id}`, formData, {
      headers: this.adminService.getAuthHeaders(),
    }).pipe(
      finalize(() => this.loadingService.stopLoading())
    );
  }

  // New method for updating with multiple media files
  updateFrameWithMultipleMedia(id: number, frame: Frame, imageFiles: File[], videoFiles: File[]): Observable<Frame> {
    this.loadingService.startLoading();
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
    }).pipe(
      finalize(() => this.loadingService.stopLoading())
    );
  }

  // Method to add media to existing frame
  addMediaToFrame(id: number, files: File[]): Observable<ProductMedia[]> {
    this.loadingService.startLoading();
    const formData = new FormData();
    
    if (files && files.length > 0) {
      files.forEach((file, index) => {
        formData.append('files', file);
      });
    }

    return this.http.post<ProductMedia[]>(`${this.apiServerUrl}/admin/frame/${id}/add-media`, formData, {
      headers: this.adminService.getAuthHeaders(),
    }).pipe(
      finalize(() => this.loadingService.stopLoading())
    );
  }

  // Method to remove all media from frame
  removeFrameMedia(id: number): Observable<void> {
    this.loadingService.startLoading();
    return this.http.delete<void>(`${this.apiServerUrl}/admin/frame/${id}/media`, {
      headers: this.adminService.getAuthHeaders(),
    }).pipe(
      finalize(() => this.loadingService.stopLoading())
    );
  }

  // Method to get frame media
  getFrameMedia(id: number): Observable<ProductMedia[]> {
    this.loadingService.startLoading();
    return this.http.get<ProductMedia[]>(`${this.apiServerUrl}/admin/frame/${id}/media`, {
      headers: this.adminService.getAuthHeaders(),
    }).pipe(
      finalize(() => this.loadingService.stopLoading())
    );
  }

  addFrame(frame: Frame, file: File | null): Observable<Frame> {
    this.loadingService.startLoading();
    const formData = new FormData();
    formData.append('frame', new Blob([JSON.stringify(frame)], { type: 'application/json' }));
    // Only append file if provided
    if (file) {
      formData.append('file', file);
    }
    
    return this.http.post<Frame>(`${this.apiServerUrl}/admin/add/frame`, formData, {
      headers: this.adminService.getAuthHeaders(),
    }).pipe(
      finalize(() => this.loadingService.stopLoading())
    );
  }
}
