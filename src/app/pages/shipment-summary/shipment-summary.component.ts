import { Component, effect, inject, SimpleChanges } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { ShipmentDetailsComponent } from '../../components/summary-page-fully-data/shipment-details/shipment-details.component';
import { ShipmentOtherInfoComponent } from '../../components/summary-page-fully-data/shipment-other-info/shipment-other-info.component';
import { CommonModule } from '@angular/common';
import { MatRippleModule } from '@angular/material/core';
import { environment } from '../../.environments/environment.prod';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, Observable, throwError, timeout } from 'rxjs';
import { ViewDetailsTrackingNumberService } from '../../services/view-details-tracking-number.service';

@Component({
  selector: 'app-shipment-summary',
  imports: [HeaderComponent, FooterComponent, RouterOutlet,
    MatIconModule, ShipmentDetailsComponent,
    ShipmentOtherInfoComponent, CommonModule,
    MatRippleModule, MatRippleModule, RouterLink],
  templateUrl: './shipment-summary.component.html',
  styleUrl: './shipment-summary.component.css'
})
export class ShipmentSummaryComponent {

  /*--------- Inject ---------*/
  http = inject(HttpClient)
  router = inject(Router);

  /*------- Data import -------*/


  // services
  trackingNumberService = inject(ViewDetailsTrackingNumberService);
  baseAPI = environment.baseAPI;

  /*------- style settings -------*/

  /*------- Variables -------*/

  trackingNumber: string = ''; // 完成要記得解除註解
  // trackingNumber: string = 'THI132400003'; // 測試檔案用
  data: any = {};
  errorMessages: string = '';

  loading: boolean = false;

  // No data status
  hasData: boolean = false;


  /*------- Functions -------*/



  /*------- Life Cycle Hooks -------*/

  constructor() {
    this.loading = true;

    // get url parameters
    const params = new URLSearchParams(window.location.search);
    const trackingNo = params.get('trackingNo');
    const viewerToken = params.get('viewerToken');

    if (trackingNo && viewerToken) {
      // viewer's data
      this.trackingNumber = trackingNo;
      this.getViewerDetailsData(trackingNo, viewerToken)
        .pipe(
          timeout(15000),
          catchError(err => {
            console.error('API Timeout or Error:', err);
            this.hasData = false;
            this.loading = false;
            this.errorMessages = 'Request timed out. Please try again later.';
            return throwError(() => err);
          })
        )
        .subscribe({
          next: (res) => {
            this.data = res;
            this.hasData = true;
            this.loading = false;
          },
          error: (err) => {
            console.error('API Error:', err);
            this.loading = false;
            if (err.status === 401) {
              this.router.navigate(['/login']);
            } else {
              this.hasData = false;
              this.errorMessages = `${this.trackingNumber} not found.<br/>Please check your tracking number.`;
            }
          }
        });
    } else {
      // service's data
      this.trackingNumber = this.trackingNumberService.getData()();

      if (this.trackingNumber) {
        this.getDetailsData(this.trackingNumber)
          .pipe(
            timeout(15000),
            catchError(err => {
              console.error('API Timeout or Error:', err);
              this.hasData = false;
              this.loading = false;
              this.errorMessages = 'Request timed out. Please try again later.';
              return throwError(() => err);
            })
          )
          .subscribe({
            next: (res) => {
              this.data = res;
              this.hasData = true;
              this.loading = false;
            },
            error: (err) => {
              console.log(err);
              this.loading = false;
              if (err.status === 401) {
                this.router.navigate(['/login']);
              } else {
                this.hasData = false;
                this.errorMessages = `Please check your tracking number`;
              }
            }
          });
      } else {
        this.hasData = false;
        this.loading = false;
        this.errorMessages = `There is no data`;
      }
    }
  }


  ngOnInit() {
    window.scrollTo(0, 0);
  }


  // get data from API
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

  // Btn

  backToLink() {
    this.router.navigate(['/shipment-list']);
  }

  // Cookie
  // get coolies
  getCookie(name: string): string | null {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? match[2] : null;
  }



}
