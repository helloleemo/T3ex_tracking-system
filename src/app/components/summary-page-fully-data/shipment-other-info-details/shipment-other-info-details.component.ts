import { Component, inject, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { CubeComponent } from '../../cube/cube.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../../.environments/environment.prod';
import { ViewDetailsTrackingNumberService } from '../../../services/view-details-tracking-number.service';

@Component({
  selector: 'app-shipment-other-info-details',
  imports: [MatListModule, MatIconModule, MatIconModule, CubeComponent, MatTooltipModule],
  templateUrl: './shipment-other-info-details.component.html',
  styleUrl: './shipment-other-info-details.component.css'
})
export class ShipmentOtherInfoDetailsComponent {
  /*--------- @Input ---------*/

  @Input() trackingNumber: string = '' // 完成要記得解除註解
  // trackingNumber: string = 'THI132400003' // 測試檔案用
  // trackingNumber: string = 'TECSHA126236' // 測試圖片用


  /*--------- Style settings ---------*/

  skeletonClass: string = 'w-full h-5 rounded bg-gradient-to-r from-gray-50 via-gray-100 to-gray-50 bg-[length:200%_100%] animate-[shimmer_1.5s_infinite_linear]';

  /*--------- Inject ---------*/
  http = inject(HttpClient);

  /*--------- Variables ---------*/

  // skeleton loader
  isSkeletonLoading: boolean = true;
  data: any = {};

  // services
  trackingNumberService = inject(ViewDetailsTrackingNumberService);
  baseAPI = environment.baseAPI;


  // shipmentDataService = inject(ShipmentDataService);
  shipmentData: any = [];
  shipmentDetails: any = [];

  // 3D render
  dimensionX: number = 0;
  dimensionY: number = 0;
  dimensionZ: number = 0;
  pictureUrl: string = '';

  /*------- Data import -------*/

  // get shipment details
  getDetailsData(trackingNo: string): Observable<any[]> {
    const token = this.getCookie('authToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    const params = new HttpParams().set('trackingNo', trackingNo);
    return this.http.get<any[]>(`${this.baseAPI}TrackingApi/ShipmentDetails`, { headers, params });

  }

  // get viewer data from API
  getViewerDetailsData(trackingNo: string, token: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    const params = new HttpParams().set('viewerToken', token);
    return this.http.get<any>(`${this.baseAPI}TrackingApi/viewer/details`, { headers, params });
  }

  /*--------- Functions ---------*/

  ngOnInit() {
    this.isSkeletonLoading = true;

    // 從網址取得 trackingNo 和 viewerToken
    const params = new URLSearchParams(window.location.search);
    const trackingNo = params.get('trackingNo');
    const viewerToken = params.get('viewerToken');

    // 優先使用網址的 trackingNo
    const targetTrackingNo = trackingNo ?? this.trackingNumber;

    const apiCall = viewerToken
      ? this.getViewerDetailsData(targetTrackingNo, viewerToken)
      : this.getDetailsData(targetTrackingNo);

    apiCall.subscribe({
      next: (res: any) => {
        this.data = res;
        this.shipmentData = this.data.data;
        this.shipmentDetails = this.shipmentData.ShipmentDetails;

        if (this.shipmentDetails.ShipmentInfo.PictureUrl !== null) {
          const url = this.shipmentDetails.ShipmentInfo.PictureUrl;
          this.postFilesData(url).subscribe({
            next: (blob: Blob) => {
              const url = URL.createObjectURL(blob);
              this.pictureUrl = url;
            },
            error: (err: any) => {
              console.error(err);
            }
          });
        } else {
          this.pictureUrl = '';
        }

        if (this.shipmentDetails.Dimensions.length > 0) {
          this.dimensionX = this.shipmentDetails.Dimensions[0].Length;
          this.dimensionY = this.shipmentDetails.Dimensions[0].Height;
          this.dimensionZ = this.shipmentDetails.Dimensions[0].Width;
        }

        this.isSkeletonLoading = false;
      },
      error: (error: any) => {
        console.error('API Error:', error);
        this.isSkeletonLoading = false;
      }
    });
  }



  // Copy text 

  copyText(text: string, e: any) {
    if (!text) { return; }

    navigator.clipboard.writeText(text).then(() => {
      console.log(text);
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


  postFilesData(guid: string): Observable<Blob> {
    const token = this.getCookie('authToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    const params = new HttpParams().set('guid', guid);

    return this.http.get(`${this.baseAPI}TrackingApi/Download`, {
      headers,
      params,
      responseType: 'blob'
    });
  }


  // send deatils for export
  sendDetailsForExport() {

  }

  // Cookie
  // get coolies
  getCookie(name: string): string | null {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? match[2] : null;
  }


}




