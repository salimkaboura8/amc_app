import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class StorageService {
  private platformId = inject(PLATFORM_ID);
  private mem = new Map<string, string>();

  private get isBrowser() {
    return isPlatformBrowser(this.platformId);
  }

  getItem(key: string): string | null {
    if (this.isBrowser) return window.localStorage.getItem(key);
    return this.mem.has(key) ? (this.mem.get(key) as string) : null;
  }

  setItem(key: string, value: string): void {
    if (this.isBrowser) {
      window.localStorage.setItem(key, value);
    } else {
      this.mem.set(key, value);
    }
  }

  removeItem(key: string): void {
    if (this.isBrowser) {
      window.localStorage.removeItem(key);
    } else {
      this.mem.delete(key);
    }
  }
}
