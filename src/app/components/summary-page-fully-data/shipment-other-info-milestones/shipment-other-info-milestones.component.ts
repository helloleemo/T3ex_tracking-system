import { Component, inject, Input } from '@angular/core';
import { MatRipple } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../../.environments/environment.prod';
import { ViewImgComponent } from '../../view-img/view-img.component';
import { ExportTemplateService } from '../../../services/export-template.service';

@Component({
  selector: 'app-shipment-other-info-milestones',
  imports: [MatIconModule, MatRipple, ViewImgComponent],
  templateUrl: './shipment-other-info-milestones.component.html',
  styleUrl: './shipment-other-info-milestones.component.css'
})
export class ShipmentOtherInfoMilestonesComponent {

  /*--------- style settings ---------*/
  skeletonClass: string = 'w-full h-5 rounded bg-gradient-to-r from-gray-50 via-gray-100 to-gray-50 bg-[length:200%_100%] animate-[shimmer_1s_infinite_linear]';
  isError: boolean = false;

  /*--------- Inject ---------*/
  http = inject(HttpClient);
  exportTemplate = inject(ExportTemplateService)

  /*--------- @Iutput ---------*/
  @Input() trackingNumber: string = '';
  // trackingNumber: string = 'THI132400003' // 測試檔案用
  // trackingNumber: string = 'TECSHA126236' // 測試圖片用


  /*--------- Variables ---------*/

  // image viewer
  isViewImg: boolean = false;
  newImagesList: any[] = []


  // skeleton loader
  isSkeletonLoading: boolean = true;

  //data
  milestoneCols = ['', 'Milestone', 'Date and Time', 'Show Images']
  milestonRows = [
    'Booking Creation', 'Cargo Arrive Terminal', 'ETD', 'ATD', 'ETA', 'ATA', 'Document Release', 'Release', 'Airport Pickup', 'Delivered', 'POD'];
  milestoneColsGuest = ['Order', 'Milestone', 'Date and Time', 'Files']
  flightCols = ['', 'Flight No.', 'From', 'To', 'ETD', 'ATD', 'ETA', 'ATA']
  // dimensionCols =[ 'Length', 'Width', 'Height', 'Pkg Qty', 'VW']

  shipmentData: any = [];
  milestones: any = [];
  dimensions: any = [];
  unit: any = {}

  flightSegments: any = [];

  /*--------- Data import ---------*/

  baseAPI = environment.baseAPI;

  // get milestones Date and Time
  getMilestonesData(trackingNumber: string): Observable<any[]> {
    const token = this.getCookie('authToken');

    if (!token) {
      console.error('No auth token found');
      return throwError(() => new Error('No auth token found'));
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    const params = new HttpParams().set('trackingNo', trackingNumber);

    return this.http.get<any[]>(`${this.baseAPI}TrackingApi/milestones`, { headers, params });
  }

  getViewerMilestonesData(trackingNumber: string, token: string): Observable<any[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    const params = new HttpParams().set('viewerToken', token);

    return this.http.get<any[]>(`${this.baseAPI}TrackingApi/viewer/milestones`, { headers, params });
  }



  /*--------- Functions ---------*/

  ngOnInit() {
    this.isSkeletonLoading = true;

    const params = new URLSearchParams(window.location.search);
    const trackingNo = params.get('trackingNo');
    const viewerToken = params.get('viewerToken');

    const targetTrackingNo = trackingNo ?? this.trackingNumber;

    const apiCall = (trackingNo && viewerToken)
      ? this.getViewerMilestonesData(targetTrackingNo, viewerToken)
      : this.getMilestonesData(targetTrackingNo);

    apiCall.subscribe({
      next: (res: any) => {
        if (res.code !== "1") {
          console.error(res.message);
          this.isSkeletonLoading = false;
          this.isError = true;
          return;
        }

        this.shipmentData = res.data;
        this.milestones = this.aryMilestones(this.shipmentData.Milestone);

        // Flight Info
        if (this.shipmentData.FlightSegments.length > 0) {
          this.flightSegments = this.shipmentData.FlightSegments;
        } else {
          this.flightSegments = [];
        }

        // Dimension Info
        if (this.shipmentData.Dimensions !== null) {
          const dimensionsData = Array.isArray(this.shipmentData.Dimensions)
            ? this.shipmentData.Dimensions
            : [this.shipmentData.Dimensions];
          this.dimensions = dimensionsData;
        } else {
          this.dimensions = [];
        }

        this.isSkeletonLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.isSkeletonLoading = false;
      },
      complete: () => {
        this.isSkeletonLoading = false;
      }
    });
  }


  // Obj to Ary
  objToAry(obj: any) {
    if (!obj || typeof obj !== 'object') {
      return [];
    }

    return Object.entries(obj).map(([key, value]) => ({
      key,
      value
    }));
  }




  aryMilestones(milestones: any) {
    // 'Booking Creation', 'Cargo Arrive Terminal', 'ETD', 'ATD', 'ETA', 'ATA', 'Document Release', 'Release', 'Airport Pickup', 'Delivered', 'POD'];

    const list: any = [];

    this.milestonRows.forEach((row: any) => {
      if (row === 'Booking Creation') {
        list.push({
          Milestone: row,
          DateTime: milestones?.BookingCreation ?? '',
          Imgs: [],
        });
      }
      else if (row === 'Cargo Arrive Terminal') {
        list.push({
          Milestone: row,
          DateTime: milestones?.CargoArrive?.DateTime ?? '',
          Imgs: milestones?.CargoArrive?.ImageUrls ?? [],
        });
      }
      else if (row === 'ETD') {
        list.push({
          Milestone: row,
          DateTime: milestones?.ETD ?? '',
          Imgs: [],
        });
      }
      else if (row === 'ATD') {
        list.push({
          Milestone: row,
          DateTime: milestones?.ATD ?? '',
          Imgs: [],
        });
      }
      else if (row === 'ETA') {
        list.push({
          Milestone: row,
          DateTime: milestones?.ETA ?? '',
          Imgs: [],
        });
      }
      else if (row === 'ATA') {
        list.push({
          Milestone: row,
          DateTime: milestones?.ATA ?? '',
          Imgs: [],
        });
      }
      else if (row === 'Document Release') {
        if (milestones.DocReleaseDate != null && milestones.DocReleaseDate != '' && milestones.DocReleaseDate != 'undefined') {
          list.push({
            Milestone: row,
            DateTime: milestones?.DocReleaseDate ?? '',
            Imgs: [],
          });
        }
      }
      else if (row === 'Release') {
        if (milestones.ReleaseDate != null && milestones.ReleaseDate != '' && milestones.ReleaseDate != 'undefined') {
          list.push({
            Milestone: row,
            DateTime: milestones?.ReleaseDate ?? '',
            Imgs: [],
          });
        }
      }
      else if (row === 'Airport Pickup') {
        list.push({
          Milestone: row,
          DateTime: milestones?.AirportPickup?.DateTime ?? '',
          Imgs: milestones?.AirportPickup?.ImageUrls ?? [],
        });
      }
      else if (row === 'Delivered') {
        list.push({
          Milestone: row,
          DateTime: milestones?.Delivered?.DateTime ?? '',
          Imgs: milestones?.Delivered?.ImageUrls ?? [],
        });
      }
      else if (row === 'POD') {
        list.push({
          Milestone: row,
          DateTime: milestones?.Pod?.DateTime ?? '',
          Imgs: milestones?.Pod?.ImageUrls ?? [],
        });
      }
    });

    return list;

  }

  // get img
  getImg(list: any) {
    if (Array.isArray(list)) {
      this.newImagesList = list.map(item => ({
        ...item,
        Name: item.FileName
      }));
    } else {
      this.newImagesList = [{
        ...list,
        Name: list.FileName
      }];
    }

    this.isViewImg = true;

  }


  postFilesData(guid: string): Observable<any> {

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

  // Cookie
  // get coolies
  getCookie(name: string): string | null {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? match[2] : null;
  }

  // get close button

  getClosedStatus(e: any) {
    this.isViewImg = e;
  }
}
