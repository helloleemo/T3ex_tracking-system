import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ViewDetailsTrackingNumberService {

  private viewDetailsTrackingNumber = signal<string>(''); 

  setData(newTrackingNumber: string) {
    this.viewDetailsTrackingNumber.set(newTrackingNumber); 
  }

  getData() {
    return this.viewDetailsTrackingNumber.asReadonly(); 
  }
}
