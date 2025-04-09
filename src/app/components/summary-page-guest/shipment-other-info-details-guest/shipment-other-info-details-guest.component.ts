import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, inject, Input } from '@angular/core';
import { environment } from '../../../.environments/environment.prod';
import { Observable } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-shipment-other-info-details-guest',
  imports: [MatIconModule],
  templateUrl: './shipment-other-info-details-guest.component.html',
  styleUrl: './shipment-other-info-details-guest.component.css'
})
export class ShipmentOtherInfoDetailsGuestComponent {


  /*--------- Style settings ---------*/
  rippleColor: string = 'rgba(0, 0, 0, 0.1)';
  skeletonClass: string = 'w-full h-5 rounded bg-gradient-to-r from-gray-50 via-gray-100 to-gray-50 bg-[length:200%_100%] animate-[shimmer_1.5s_infinite_linear]';


  /*--------- Inject ---------*/
  http = inject(HttpClient);

  /*--------- Variables ---------*/

  // skeleton loader
  isSkeletonLoading: boolean = true;

  // shipmentDataService = inject(ShipmentDataService);
  shipmentData: any = [];
  shipmentDetails: any = [];

  /*--------- Data import ---------*/

  // @Input
  @Input() trackingNo: string = ''


  // API
  summaryDataGuestAPI = environment.baseAPI;

  getSummaryData(trackingNo: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.summaryDataGuestAPI}TrackingApi/shipmentSummary`, {
      params: new HttpParams().set('trackingNo', trackingNo)
    });
  }


  /*--------- Functions ---------*/

  ngOnInit() {
    this.getSummaryData(this.trackingNo).subscribe({

      next: (res) => {
        this.isSkeletonLoading = false;

        this.shipmentData = res;
        this.shipmentDetails = this.shipmentData.data.ShipmentDetails;
      },
      error: (err) => {
        console.log(err);
        this.isSkeletonLoading = false;

      }
    })

  }


  // Copy text 


  copyText(text: string, e: any) {
    if (!text) { return; }

    navigator.clipboard.writeText(text).then(() => {
      console.log('clipboard:', text);
    });

    const copiedElement = e.target.closest('.copyIcon');
    if (!copiedElement || !copiedElement.parentElement) return;

    const copiedMessage = document.createElement('span');
    copiedMessage.textContent = 'Copied!';
    copiedMessage.className = 'absolute inline-block ml-2 px-2 py-1 bg-blackColor/30 bg-opacity-75 text-white rounded text-sm opacity-100 transition-opacity duration-500'

    copiedElement.parentElement.insertBefore(copiedMessage, copiedElement.nextSibling);
    setTimeout(() => {
      copiedMessage.classList.add('opacity-0');
      setTimeout(() => copiedMessage.remove(), 400);
    });
  }





}
