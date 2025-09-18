import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UrlService {
  private apiServerUrl = environment.apiUrl;

  /**
   * Returns a complete URL for images/media.
   * If the URL is already absolute (starts with http:// or https://), returns it as is.
   * If the URL is relative, prepends the API server URL.
   */
  getMediaUrl(url: string | null | undefined): string {
    if (!url) {
      return '';
    }

    // Check if URL is already absolute
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }

    // For relative URLs, prepend the API server URL
    return this.apiServerUrl + url;
  }

  /**
   * Legacy method - kept for backward compatibility
   * Use getMediaUrl() instead for better handling of absolute URLs
   */
  getApiServerUrl(): string {
    return this.apiServerUrl;
  }
}