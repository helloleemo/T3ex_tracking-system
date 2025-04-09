import { Injectable, signal } from '@angular/core';
import { SIGNAL } from '@angular/core/primitives/signals';

@Injectable({
  providedIn: 'root'
})
export class TrackingNumberService {

  private trackingNumber = signal<string>(''); 

  setData(newTrackingNumber: string) {
    this.trackingNumber.set(newTrackingNumber); 
  }

  getData() {
    return this.trackingNumber.asReadonly(); 
  }

}
