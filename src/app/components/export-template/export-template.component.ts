import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output, SimpleChanges } from '@angular/core';
import { MatRippleModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { ExportTemplateService } from '../../services/export-template.service';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../.environments/environment.prod';
import { Observable, throwError } from 'rxjs';

@Component({
  selector: 'app-export-template',
  imports: [MatIconModule, MatRippleModule,
    CommonModule],
  templateUrl: './export-template.component.html',
  styleUrl: './export-template.component.css'
})
export class ExportTemplateComponent {


  /*--------- Inject ---------*/
  http = inject(HttpClient);
  templateService = inject(ExportTemplateService)

  /*--------- style ---------*/

  /*--------- @Iutput ---------*/
  @Input() trackingNumber: string = '';
  @Input() isLoading: boolean = false;
  @Output() isLoadingOutput = new EventEmitter<boolean>();

  /*--------- data import ---------*/
  baseAPI = environment.baseAPI;

  // get shipment details
  getDetailsData(trackingNo: string): Observable<any[]> {
    const token = this.getCookie('authToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    const params = new HttpParams().set('trackingNo', trackingNo);
    return this.http.get<any[]>(`${this.baseAPI}TrackingApi/ShipmentDetails`, { headers, params });

  }


  // get milestones, dimensions, flightSegments
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



  /*--------- Variables ---------*/

  formattedDate = ''

  shipmentData: any = [];
  milestones: any = [];
  dimensions: any = [];
  flightSegments: any = [];

  //data
  milestoneCols = ['', 'Milestone', 'Date and Time', 'Files']
  milestonRows = [
    'Booking Creation', 'Cargo Arrive Terminal', 'ETD', 'ATD', 'ETA', 'ATA', 'Document Release', 'Release', 'Airport Pickup', 'Delivered', 'POD'];
  milestoneColsGuest = ['Order', 'Milestone', 'Date and Time', 'Files']
  flightCols = ['', 'Flight No.', 'From', 'To', 'ETD', 'ATD', 'ETA', 'ATA']

  shipmentDetails: any = [];
  ShipmentInfo: any = {};
  Package: any = {};


  // today
  ngOnInit() {

    // isLoading
    this.isLoading = true;
    this.isLoadingOutput.emit(this.isLoading);
    console.log('isLoading1:', this.isLoading)

    // exported date
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    this.formattedDate = formattedDate;

    // get details
    this.getDetailsData(this.trackingNumber).subscribe({
      next: (res: any) => {
        this.shipmentDetails = res.data.ShipmentDetails;
        console.log('this.shipmentDetails', this.shipmentDetails)
        this.ShipmentInfo = this.shipmentDetails.ShipmentInfo;
        console.log(this.ShipmentInfo)
        this.Package = this.shipmentDetails.Package;
      },
      error: (err) => {
        console.log(err);
      },
      complete: () => { }
    });



    // get milestones, flightSegments, dimensions
    this.getMilestonesData(this.trackingNumber).subscribe({
      next: (res: any) => {
        if (res.code != 1) {
          console.error(res.message);
        } else {
          this.shipmentData = res.data;
          this.milestones = this.aryMilestones(this.shipmentData.Milestone);

          // Flight Info
          if (this.shipmentData.FlightSegments.length > 0) {
            this.flightSegments = this.shipmentData.FlightSegments;

          } else {
            this.flightSegments = []
          }

          // Dimension Info
          if (this.shipmentData.Dimensions !== null) {

            const dimensionsData = Array.isArray(this.shipmentData.Dimensions)
              ? this.shipmentData.Dimensions
              : [this.shipmentData.Dimensions];
            this.dimensions = dimensionsData

          } else {
            this.dimensions = []
          }


        }

        // isLoading
        this.isLoading = false;
        this.isLoadingOutput.emit(this.isLoading);

      },
      error: (err) => {
        console.log(err);

        // isLoading
        this.isLoading = false;
        this.isLoadingOutput.emit(this.isLoading);

      },
      complete: () => { }
    })


    // isLoading
    this.isLoading = false;
    this.isLoadingOutput.emit(this.isLoading);
    console.log('isLoading2:', this.isLoading)
  }




  // Milestones
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
    console.log('milestones:', milestones)
    this.milestonRows.forEach((row: any) => {
      if (row === 'Booking Creation' && milestones?.BookingCreation != null && milestones?.BookingCreation != '' && milestones?.BookingCreation != 'undefined') {
        list.push({
          Milestone: row,
          DateTime: milestones?.BookingCreation ?? ''
        });
      }
      else if (row === 'Cargo Arrive Terminal' && milestones?.CargoArrive.DateTime != null && milestones?.CargoArrive.DateTime != '' && milestones?.CargoArrive.DateTime != 'undefined') {
        list.push({
          Milestone: row,
          DateTime: milestones?.CargoArrive?.DateTime ?? ''
        });
      }
      else if (row === 'ETD' && milestones?.ETD != null && milestones?.ETD != '' && milestones?.ETD != 'undefined') {
        list.push({
          Milestone: row,
          DateTime: milestones?.ETD ?? ''
        });
      }
      else if (row === 'ATD' && milestones?.ATD != null && milestones?.ATD != '' && milestones?.ATD != 'undefined') {
        list.push({
          Milestone: row,
          DateTime: milestones?.ATD ?? ''
        });
      }
      else if (row === 'ETA' && milestones?.ETA != null && milestones?.ETA != '' && milestones?.ETA != 'undefined') {
        list.push({
          Milestone: row,
          DateTime: milestones?.ETA ?? '',
        });
      }
      else if (row === 'ATA' && milestones?.ATA != null && milestones?.ATA != '' && milestones?.ATA != 'undefined') {
        list.push({
          Milestone: row,
          DateTime: milestones?.ATA ?? ''
        });
      }
      else if (row === 'Document Release') {
        if (milestones.DocReleaseDate != null && milestones.DocReleaseDate != '' && milestones.DocReleaseDate != 'undefined') {
          list.push({
            Milestone: row,
            DateTime: milestones?.DocReleaseDate ?? ''
          });
        }
      }
      else if (row === 'Release') {
        if (milestones.ReleaseDate != null && milestones.ReleaseDate != '' && milestones.ReleaseDate != 'undefined') {
          list.push({
            Milestone: row,
            DateTime: milestones?.ReleaseDate ?? ''
          });
        }
      }
      else if (row === 'Airport Pickup') {
        if (milestones.ReleaseDate != null && milestones.ReleaseDate != '' && milestones.ReleaseDate != 'undefined') {
          list.push({
            Milestone: row,
            DateTime: milestones?.AirportPickup?.DateTime ?? ''
          });
        }
      }
      else if (row === 'Delivered') {
        if (milestones.Delivered.DateTime != null && milestones.Delivered.DateTime != '' && milestones.Delivered.DateTime != 'undefined') {
          list.push({
            Milestone: row,
            DateTime: milestones?.Delivered?.DateTime ?? ''
          });
        }
      }
      else if (row === 'POD') {
        if (milestones.Pod.DateTime != null && milestones.Pod.DateTime != '' && milestones.Pod.DateTime != 'undefined') {
          list.push({
            Milestone: row,
            DateTime: milestones?.Pod?.DateTime ?? ''
          });
        }
      }
    });

    return list;

  }


  // Cookie
  // get coolies
  getCookie(name: string): string | null {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? match[2] : null;
  }
}

