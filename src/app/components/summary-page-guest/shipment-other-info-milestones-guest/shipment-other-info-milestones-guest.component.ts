import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, inject, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { environment } from '../../../.environments/environment.prod';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-shipment-other-info-milestones-guest',
  imports: [MatIconModule],
  templateUrl: './shipment-other-info-milestones-guest.component.html',
  styleUrl: './shipment-other-info-milestones-guest.component.css'
})
export class ShipmentOtherInfoMilestonesGuestComponent {

  /*--------- Inject ---------*/
  http = inject(HttpClient);

  /*--------- Style settings ---------*/
  skeletonClass: string = 'w-full h-5 rounded bg-gradient-to-r from-gray-50 via-gray-100 to-gray-50 bg-[length:200%_100%] animate-[shimmer_1.5s_infinite_linear]';


  /*--------- Variables ---------*/

  // skeleton loader
  isSkeletonLoading: boolean = true;

  milestoneCols = ['Order', 'Milestone', 'Date and Time']
  milestonRows = [
    'Booking Creation', 'Cargo Arrive Terminal', 'ETD', 'ATD', 'ETA', 'ATA', 'Document Release', 'Release', 'Airport Pickup', 'Delivered', 'POD'];
  flightCols = ['Flight No.', 'From', 'To', 'ETD', 'ATD', 'ETA', 'ATA']

  // dimensionCols =[ 'Length', 'Width', 'Height', 'Pkg Qty', 'VW']

  shipmentData: any = [];
  milestones: any = [];
  milestonesCols: string[] = ['Booking Creation', 'Cargo Arrive Terminal', 'ETD', 'ATD', 'ETA', 'ATA', 'Document Release', 'Release', 'Airport Pickup', 'Delivered', 'POD'];
  dimensions: any = [];
  unit: any = {}

  flightSegments: any = [];

  /*--------- Data import ---------*/

  baseAPI = environment.baseAPI;

  @Input() trackingNo: string = ''

  getMilestonesData(trackingNo: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseAPI}TrackingApi/shipmentSummary`, {
      params: new HttpParams().set('trackingNo', trackingNo)
    });
  }


  /*--------- Functions ---------*/

  ngOnInit() {
    this.getMilestonesData(this.trackingNo).subscribe({
      next: (res: any) => {
        // isSkeletonLoading
        this.isSkeletonLoading = false;

        //  milestones
        this.shipmentData = res;

        // flight segments
        this.flightSegments = this.shipmentData.data.FlightSegments;
        this.milestones = this.aryMilestones(this.shipmentData.data.Milestone)

        this.unit = this.shipmentData.data.ShipmentDetails.Package

        // isSkeletonLoading
        this.isSkeletonLoading = false;

      },
      error: (err) => {
        console.log(err);
        this.isSkeletonLoading = false;
      },
      complete: () => { }
    })

  }

  // Obj to Ary
  objToAry(obj: any) {
    if (!obj) return [];
    const ary = Object.entries(obj).map(([key, value]) => ({
      key,
      value
    }));
    return ary;
  }

  // get milestones Date and Time
  aryMilestones(milestones: any) {
    // 'Booking Creation', 'Cargo Arrive Terminal', 'ETD', 'ATD', 'ETA', 'ATA', 'Document Release', 'Release', 'Airport Pickup', 'Delivered', 'POD'];

    const list: any = [];

    this.milestonRows.forEach((row: any) => {
      if (row === 'Booking Creation') {
        list.push({
          Milestone: row,
          DateTime: milestones?.BookingCreation ?? '',
        });
      }
      else if (row === 'Cargo Arrive Terminal') {
        list.push({
          Milestone: row,
          DateTime: milestones?.CargoArrive?.DateTime ?? '',
        });
      }
      else if (row === 'ETD') {
        list.push({
          Milestone: row,
          DateTime: milestones?.ETD.DateTime ?? '',
        });
      }
      else if (row === 'ATD') {
        list.push({
          Milestone: row,
          DateTime: milestones?.ATD ?? '',
        });
      }
      else if (row === 'ETA') {
        list.push({
          Milestone: row,
          DateTime: milestones?.ETA.DateTime ?? '',
        });
      }
      else if (row === 'ATA') {
        list.push({
          Milestone: row,
          DateTime: milestones?.ATA ?? '',
        });
      }
      else if (row === 'Document Release') {
        if (milestones.DocReleaseDate != null && milestones.DocReleaseDate != '' && milestones.DocReleaseDate != 'undefined') {
          list.push({
            Milestone: row,
            DateTime: milestones?.DocReleaseDate ?? '',
          });
        }
      }
      else if (row === 'Release') {
        if (milestones.ReleaseDate != null && milestones.ReleaseDate != '' && milestones.ReleaseDate != 'undefined') {
          list.push({
            Milestone: row,
            DateTime: milestones?.ReleaseDate ?? '',
          });
        }
      }
      else if (row === 'Airport Pickup') {
        list.push({
          Milestone: row,
          DateTime: milestones?.AirportPickup?.DateTime ?? '',
        });
      }
      else if (row === 'Delivered') {
        list.push({
          Milestone: row,
          DateTime: milestones?.Delivered?.DateTime ?? '',
        });
      }
      else if (row === 'POD') {
        list.push({
          Milestone: row,
          DateTime: milestones?.Pod?.DateTime ?? '',
        });
      }
    });


    return list;

  }

  // Replace Chinese to number date (YYYY-MM-DD HH:mm format)
  replaceChineseToEnglish(str: string): string {
    if (!str) return str;

    const match = str.match(/(\d{4})年(\d{1,2})月(\d{1,2})日\s+(\d{1,2}):(\d{1,2})/);
    if (!match) return str;

    const [, year, month, day, hour, minute] = match.map(Number);
    const date = new Date(year, month - 1, day, hour, minute);
    const formattedDate = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')} ${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;

    return formattedDate;
  }



}
