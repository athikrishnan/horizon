import { Injectable } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';

@Injectable({
  providedIn: 'root'
})
export class AppUpdateService {
  constructor(private readonly updates: SwUpdate) { }

  checkForUpdates(): void {
    this.updates.available.subscribe(() => {
      console.warn('app has updates. please reload');
    });
  }
}
