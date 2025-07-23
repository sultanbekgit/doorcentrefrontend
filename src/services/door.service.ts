import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';
import { Door } from '../app/models/door';
import { environment } from '../environments/environment';
import { AdminService } from './admin.service';
import { LoadingService } from './loading.service';
import { NONE_TYPE } from '@angular/compiler';


@Injectable({
  providedIn: 'root'
})
export class DoorService {

  private apiServerUrl = environment.apiUrl;

  constructor(private http: HttpClient, private adminService: AdminService, private loadingService: LoadingService) { }

  public getDoors(): Observable<Door[]> {
    this.loadingService.startLoading();
    return this.http.get<Door[]>(`${this.apiServerUrl}/door/all`).pipe(
      finalize(() => this.loadingService.stopLoading())
    );
  }

  public getDoorsByHeightAndWidth(height: string, width: string): Observable<Door[]> {
    this.loadingService.startLoading();
    const payload = { height, width };
    return this.http.post<Door[]>(`${this.apiServerUrl}/door/find-by-dimensions`, payload).pipe(
      finalize(() => this.loadingService.stopLoading())
    );
  }

  
  updateDoor(id: number, door: Door, file: File | null): Observable<Door> {
    this.loadingService.startLoading();
    const formData = new FormData();
    formData.append('door', new Blob([JSON.stringify(door)], { type: 'application/json' }));
    // Only append file if provided
    if (file) {
      formData.append('file', file);
    }
    
    
    return this.http.put<Door>(`${this.apiServerUrl}/admin/update/door/${id}`, formData, {
      headers: this.adminService.getAuthHeaders(),
    }).pipe(
      finalize(() => this.loadingService.stopLoading())
    );
    
  }

  updateDoorWithVideo(id: number, door: Door, imageFile: File | null, videoFile: File | null): Observable<Door> {
    this.loadingService.startLoading();
    const formData = new FormData();
    formData.append('door', new Blob([JSON.stringify(door)], { type: 'application/json' }));
    
    // Only append image file if provided
    if (imageFile) {
      formData.append('imageFile', imageFile);
    }
    
    // Only append video file if provided
    if (videoFile) {
      formData.append('videoFile', videoFile);
    }
    
    return this.http.put<Door>(`${this.apiServerUrl}/admin/update/door/${id}/with-video`, formData, {
      headers: this.adminService.getAuthHeaders(),
    }).pipe(
      finalize(() => this.loadingService.stopLoading())
    );
  }

  updateDoorWithMultipleMedia(id: number, door: Door, imageFiles: File[], videoFiles: File[]): Observable<Door> {
    this.loadingService.startLoading();
    const formData = new FormData();
    formData.append('door', new Blob([JSON.stringify(door)], { type: 'application/json' }));
    
    // Append multiple image files
    if (imageFiles && imageFiles.length > 0) {
      imageFiles.forEach(file => {
        formData.append('imageFiles', file);
      });
    }
    
    // Append multiple video files
    if (videoFiles && videoFiles.length > 0) {
      videoFiles.forEach(file => {
        formData.append('videoFiles', file);
      });
    }
    
    return this.http.put<Door>(`${this.apiServerUrl}/admin/update/door/${id}/with-multiple-media`, formData, {
      headers: this.adminService.getAuthHeaders(),
    }).pipe(
      finalize(() => this.loadingService.stopLoading())
    );
  }

  addDoor(door: Door, file: File | null): Observable<Door> {
    this.loadingService.startLoading();
    const formData = new FormData();
    formData.append('door', new Blob([JSON.stringify(door)], { type: 'application/json' }));
    // Only append file if provided
    if (file) {
      formData.append('file', file);
    }
    
    return this.http.post<Door>(`${this.apiServerUrl}/admin/add/door`, formData, {
      headers: this.adminService.getAuthHeaders(),
    }).pipe(
      finalize(() => this.loadingService.stopLoading())
    );
  }

  addDoorWithMultipleMedia(door: Door, imageFiles: File[], videoFiles: File[]): Observable<Door> {
    this.loadingService.startLoading();
    const formData = new FormData();
    formData.append('door', new Blob([JSON.stringify(door)], { type: 'application/json' }));
    
    // Append multiple image files
    if (imageFiles && imageFiles.length > 0) {
      imageFiles.forEach(file => {
        formData.append('imageFiles', file);
      });
    }
    
    // Append multiple video files
    if (videoFiles && videoFiles.length > 0) {
      videoFiles.forEach(file => {
        formData.append('videoFiles', file);
      });
    }
    
    return this.http.post<Door>(`${this.apiServerUrl}/admin/add/door/with-multiple-media`, formData, {
      headers: this.adminService.getAuthHeaders(),
    }).pipe(
      finalize(() => this.loadingService.stopLoading())
    );
  }

  deleteDoor(id: number): Observable<void> {
    this.loadingService.startLoading();
    return this.http.delete<void>(`${this.apiServerUrl}/admin/delete/door/${id}`, {
      headers: this.adminService.getAuthHeaders(),
    }).pipe(
      finalize(() => this.loadingService.stopLoading())
    );
  }
}
