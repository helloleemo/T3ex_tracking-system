import { ChangeDetectorRef, Component, effect, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from '../../components/footer/footer.component';
import { ShipmentDetailsGuestComponent } from '../../components/summary-page-guest/shipment-details-guest/shipment-details-guest.component';
import { ShipmentOtherInfoGuestComponent } from '../../components/summary-page-guest/shipment-other-info-guest/shipment-other-info-guest.component';
import { MatIconModule } from '@angular/material/icon';
import { HeaderComponent } from '../../components/header/header.component';
import { TrackingNumberService } from '../../services/tracking-number.service';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../.environments/environment.prod';
import { catchError, Observable, throwError, timeout } from 'rxjs';
import { MatRipple } from '@angular/material/core';

@Component({
  selector: 'app-shipment-summary-guest',
  imports: [RouterOutlet, FooterComponent, ShipmentDetailsGuestComponent,
    ShipmentOtherInfoGuestComponent, MatIconModule, HeaderComponent, FormsModule, MatRipple],
  templateUrl: './shipment-summary-guest.component.html',
  styleUrl: './shipment-summary-guest.component.css'
})
export class ShipmentSummaryGuestComponent {
  /*--------- Inject ---------*/
  http = inject(HttpClient)


  /*------- style settings -------*/
  rippleColor: string = 'rgba(255, 255, 255, 0.2)';

  /*------- Variables -------*/

  trackingNumber: string = '';
  data: any = {};
  errorMessages: string = 'Please enter a valid tracking number';

  loading: boolean = false;

  // No data status
  hasData: boolean = false;

  /*------- Data import -------*/

  // services
  trackingNumberService = inject(TrackingNumberService);
  summaryDataGuestAPI = environment.baseAPI;

  /*------- Functions -------*/

  // 驗證是否有登入
  // 驗證trackId是否存在

  /*------- Life Cycle Hooks -------*/

  constructor() {
    effect(() => {
      this.trackingNumber = this.trackingNumberService.getData()();
      if (this.trackingNumber) {
        this.fetchShipmentData();
      }
    });
  }

  ngInit() {

  }

  // check data from API
  getSummaryData(trackingNo: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.summaryDataGuestAPI}TrackingApi/shipmentSummary`, {
      params: new HttpParams().set('trackingNo', trackingNo)
    });
  }

  // fetch data from API
  fetchShipmentData() {
    this.loading = true;
    this.getSummaryData(this.trackingNumber)
      .pipe(timeout(15000),
        catchError(err => {
          this.hasData = false;
          this.loading = false;
          this.errorMessages = 'Request timed out. Please try again later.';
          return throwError(() => err);
        }))
      .subscribe({
        next: (res) => {
          this.data = res;
          const milestones = this.data.data.Milestone;
          if (!this.data && !this.data.ok) {
            console.warn('錯誤！', res);
            this.hasData = false;
            this.loading = false;
            this.errorMessages = `No data found.<br/>  Please check your tracking number.`;
            return;
          }
          this.hasData = true;
          this.loading = false;

        },
        error: (err) => {
          console.error('error:', err);
          this.hasData = false;
          this.errorMessages = 'Data not found.';
          this.loading = false;
        }

      }
      );
  }

  sendTrackingNumber() {
    this.loading = true;
    if (this.trackingNumber.trim() === '') {
      this.hasData = false;
      this.errorMessages = 'Please enter a valid tracking number';
      this.loading = false;
    } else {
      this.trackingNumberService.setData(this.trackingNumber);
      this.fetchShipmentData();
      this.loading = false;
    }


  }


  // Cookie
  // get coolies
  getCookie(name: string): string | null {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? match[2] : null;
  }
}
