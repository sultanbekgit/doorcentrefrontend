import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private loadingCounter = 0;

  constructor() { }

  /**
   * Observable to subscribe to loading state changes
   */
  get isLoading$(): Observable<boolean> {
    return this.loadingSubject.asObservable();
  }

  /**
   * Get current loading state
   */
  get isLoading(): boolean {
    return this.loadingSubject.value;
  }

  /**
   * Start loading - increments counter to handle multiple concurrent requests
   */
  startLoading(): void {
    this.loadingCounter++;
    if (this.loadingCounter === 1) {
      this.loadingSubject.next(true);
    }
  }

  /**
   * Stop loading - decrements counter and stops loading when counter reaches 0
   */
  stopLoading(): void {
    this.loadingCounter = Math.max(0, this.loadingCounter - 1);
    if (this.loadingCounter === 0) {
      this.loadingSubject.next(false);
    }
  }

  /**
   * Force stop loading - resets counter and stops loading immediately
   */
  forceStopLoading(): void {
    this.loadingCounter = 0;
    this.loadingSubject.next(false);
  }
} 