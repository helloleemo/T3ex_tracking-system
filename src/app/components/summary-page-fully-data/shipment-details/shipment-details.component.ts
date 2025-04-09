import { Component, inject, Input } from '@angular/core';
import { MatRippleModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ExportBtnComponent } from '../../export-btn/export-btn.component';
import { ExportTemplateComponent } from '../../export-template/export-template.component';

@Component({
  selector: 'app-shipment-details',
  imports: [MatIconModule, MatRippleModule,
    CommonModule, ExportBtnComponent],
  templateUrl: './shipment-details.component.html',
  styleUrl: './shipment-details.component.css'
})
export class ShipmentDetailsComponent {

  /*--------- Inject ---------*/
  http = inject(HttpClient)

  /*--------- @Input ---------*/

  @Input() data: any = {}; // input from 'shipment-summary.component.ts'

  /*------- style settings -------*/
  rippleColor: string = 'rgba(0, 0, 0, 0.1)';
  skeletonClass: string = 'w-full h-5 rounded bg-gradient-to-r from-gray-50 via-gray-100 to-gray-50 bg-[length:200%_100%] animate-[shimmer_1.5s_infinite_linear]';


  /*------- Variables -------*/

  // skeleton loader
  isSkeletonLoading: boolean = true;

  processList: any = [
    {
      "title": "Booking Creation",
      "icon": "inventory",
    },
    {
      "title": "ETD",
      "icon": "package_2"

    },
    {
      "title": "ATD",
      "icon": "box"
    },
    {
      "title": "ETA",
      "icon": "flight_land"
    },
    {
      "title": "ATA",
      "icon": "event_available"
    },
  ]

  /*------- Data import -------*/

  trackingNumber: string = '';

  shipmentData: any = [];
  shipmentInfo: any = {};
  milestones: any = {};

  processTimeList: any = []
  lastStatus: string = ''

  lastTime: Date = new Date();
  trackingNo: string = '';
  isCompleted: boolean = false



  /*------- Functions -------*/

  ngOnInit() {
    if (this.data.code != '0') {

      if (this.data.data.ShipmentSummary.HAWBNo !== '') {
        this.trackingNumber = this.data.data.ShipmentSummary.HAWBNo
      }
      else {
        this.trackingNumber = this.data.data.ShipmentSummary.MAWBNo
      }

      this.shipmentInfo = this.data.data.ShipmentDetails.ShipmentInfo;

      this.milestones = this.data.data.Milestone
      this.lastStatus = this.isCompleteStatus(this.data.data.MilestoneNode);

      this.processList = this.processListData();

      // 完成記得刪掉 setTimeout
      setTimeout(() => {
        this.isSkeletonLoading = false;
      }, 200)


    } else {
      this.isSkeletonLoading = false;
    }
  }



  // Import data from shipment-data.service.ts
  processListData() {
    const processListCopy = JSON.parse(JSON.stringify(this.processList));

    processListCopy.forEach((item: any) => {
      if (item.title === 'Booking Creation') {
        if (this.milestones.BookingCreation == 'null' && this.milestones.AirportPickup == 'null') {
          item.dateTime = ''
        } else if (this.milestones.BookingCreation == 'null' && this.milestones.AirportPickup != 'null') {
          item.dateTime = this.replaceChineseToEnglish(this.milestones.AirportPickup)
        } else {
          item.dateTime = this.replaceChineseToEnglish(this.milestones.BookingCreation)

        }
      } else if (item.title === 'ETD') {
        item.dateTime = this.replaceChineseToEnglish(this.milestones.ETD.DateTime)

        item.originCode = this.milestones.ETD.OriginCode
        item.destCode = this.milestones.ETD.DestCode
        item.flightNo = this.milestones.ETD.FlightNo
      } else if (item.title === 'ATD') {
        item.dateTime = this.replaceChineseToEnglish(this.milestones.ATD)

      } else if (item.title === 'ETA') {
        item.dateTime = this.replaceChineseToEnglish(this.milestones.ETA.DateTime)

        item.originCode = this.milestones.ETA.OriginCode
        item.destCode = this.milestones.ETA.DestCode
        item.flightNo = this.milestones.ETA.FlightNo
      } else if (item.title === 'ATA') {
        item.dateTime = this.replaceChineseToEnglish(this.milestones.ATA)

      }
    }

    );
    return processListCopy;
  }

  // complete status setting
  isCompleteStatus(MilestoneNode: string): string {
    let calLastStatus = 'Booking Creation'
    if (MilestoneNode === 'BookingCreation') {
      calLastStatus = 'Booking Creation'
    } else if (
      MilestoneNode === 'ETD' ||
      MilestoneNode === 'ATD' ||
      MilestoneNode === 'ETA' ||
      MilestoneNode === 'ATA'
    ) {
      calLastStatus = MilestoneNode
    } else if (MilestoneNode === 'Pod') {
      calLastStatus = 'Completed'
    }
    return calLastStatus
  }

  // Replace Chinese to English
  replaceChineseToEnglish(str: string): string {
    if (!str) return str;

    // 支援 "YYYY-MM-DD HH:mm" 和 "YYYY年MM月DD日 HH:mm" 兩種格式
    const match = str.match(/(\d{4})[-年](\d{1,2})[-月](\d{1,2})[日\s]+(\d{1,2}):(\d{1,2})/);
    if (!match) return str;

    const [, year, month, day, hour, minute] = match.map(Number);
    const date = new Date(year, month - 1, day, hour, minute);

    // 格式化為 "Nov. 05, 2024 12:00"
    const options: Intl.DateTimeFormatOptions = {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false // 24小時制
    };

    let formattedDate = new Intl.DateTimeFormat('en-US', options).format(date);

    // 確保月份後加上 "."，避免某些情況 Intl 會輸出 "Nov 05, 2024"
    // formattedDate = formattedDate.replace(/^(\w{3})/, '$1.');

    return formattedDate;
  }


  // Status class implementation
  getStatusClass(title: string): string {
    const completedStatuses = ["Booking Creation", "ETD", "ATD", "ETA", "ATA", "Completed"];
    // 1️若 `title` 與 `lastStatus` 完全相同，則標記為 `primary`
    if (this.lastStatus === title) {
      return "text-primary";
    }
    // 2️只允許特定狀態變成 `text-primary`
    const allowedPairs: { [key: string]: string[] } = {
      "Booking Creation": ["Booking Creation"],
      "ETD": ["Booking Creation", "ETD"],
      "ATD": ["Booking Creation", "ETD", "ATD"],
      "ETA": ["Booking Creation", "ETD", "ATD", "ETA"],
      "ATA": ["Booking Creation", "ETD", "ATD", "ETA", "ATA"],
      "Completed": ["Booking Creation", "ETD", "ATD", "ETA", "ATA", "Completed"]
    };
    if (allowedPairs[this.lastStatus as keyof typeof allowedPairs]?.includes(title)) {
      return "text-primary";
    }
    return "text-blackColor/40";
  }

  getLineClass(title: string): string {
    const completedStatuses = ["Booking Creation", "ETD", "ATD", "ETA", "ATA", "Completed"];
    // 1️⃣ 若 `title` 與 `lastStatus` 完全相同，則標記為 `bg-primary`
    if (this.lastStatus === title) {
      return "bg-primary";
    }
    // 2️⃣ 只允許特定狀態變成 `bg-primary`
    const allowedPairs: { [key: string]: string[] } = {
      "Booking Creation": ["Booking Creation"],
      "ETD": ["Booking Creation", "ETD"],
      "ATD": ["Booking Creation", "ETD", "ATD"],
      "ETA": ["Booking Creation", "ETD", "ATD", "ETA"],
      "ATA": ["Booking Creation", "ETD", "ATD", "ETA", "ATA"],
      "Completed": ["Booking Creation", "ETD", "ATD", "ETA", "ATA", "Completed"]

    };
    if (allowedPairs[this.lastStatus]?.includes(title)) {
      return "bg-primary";
    }
    // 3️⃣ 其他情況顯示 `bg-blackColor/40`
    return "bg-blackColor/40";
  }



}