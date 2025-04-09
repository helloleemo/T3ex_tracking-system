import { Component, EventEmitter, inject, Input, Output, SimpleChanges } from '@angular/core';
import { MatRipple } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule } from '@angular/forms';
import { ViewDetailsTrackingNumberService } from '../../services/view-details-tracking-number.service';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../.environments/environment.prod';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-list-table',
  imports: [MatIconModule, MatTooltipModule, MatRipple, FormsModule, NgClass],
  templateUrl: './list-table.component.html',
  styleUrl: './list-table.component.css'
})
export class ListTableComponent {


  /*--------- Inject ---------*/
  trackingNumberService = inject(ViewDetailsTrackingNumberService);
  router = inject(Router);
  http = inject(HttpClient)

  /*--------- get data from outter ---------*/
  @Input() selectedMenuInner: number = 0;
  @Input() searchContentsData: object = {};
  @Output() totalPages = new EventEmitter<number>();
  @Output() isLoginExpired = new EventEmitter<boolean>();

  /*--------- Variables ---------*/

  // Style
  isSkeletonLoading: boolean = true;
  skeletonClass: string = 'w-full h-10 rounded bg-gradient-to-r from-gray-50 via-gray-100 to-gray-0 bg-[length:200%_100%] animate-[shimmer_1.5s_infinite_linear]';

  // table related
  itemsCols: string[] = ['', 'MAWB No.', 'HAWB No.', 'Milestones', '', '', '', ''];
  allStatus: string[] = ['Booked', 'ETD', 'ATD', 'ETA', 'ATA', 'Completed'];
  lastStatus: string = 'Booked'

  // trackingNumber
  trackingNumber: string = '';

  // pagination

  totalPage: number = 0;
  currentPage: number = 1;

  // Variables
  isInit: boolean = false;
  hasData: boolean = false;


  /*--------- Data import ---------*/

  items: any[] = [
    { nowStatus: 'Completed' }, { nowStatus: 'ATD' }
  ]

  shipmentList: any[] = []

  // data import
  baseAPI = environment.baseAPI;


  /*--------- Functions ---------*/

  ngOnInit() {
    this.renderItems(this.searchContentsData);
    this.isInit = true;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!this.isInit) return;
    if (changes['selectedMenuInner']) {
      this.renderItems(this.searchContentsData);
    }
    if (changes['searchContentsData']) {
      this.renderItems(this.searchContentsData);
    }
  }

  // render 
  renderItems(obj: any) {
    this.currentPage = obj.Page;
    this.isSkeletonLoading = true;
    this.postSearchData(obj).subscribe({
      next: (res) => {
        console.log('res', res)
        if (res.code == 1) {
          this.hasData = true;
          this.shipmentList = res.data.Shipments;
          if (this.shipmentList.length === 0) {
            this.hasData = false;
            this.isSkeletonLoading = false;
          } else {
            this.totalPage = res.data.TotalPages;
            this.totalPages.emit(this.totalPage);
            this.isSkeletonLoading = false
          }
        } else {
          if (res.status === 401) {
            this.router.navigate(['/login']);
          }
          this.isSkeletonLoading = false
          this.hasData = false;
        }
      },
      error: (err) => {
        console.log('err', err)
        if (err.status === 401) {
          this.isLoginExpired.emit(true);
          // this.router.navigate(['/login']);  // 這裡要改成跳轉到登入頁面
        }
        this.isSkeletonLoading = false
        this.hasData = false;
        this.isSkeletonLoading = false

      },
      complete: () => { }
    });
  }

  postSearchData(searchContent: object): Observable<any> {
    const token = this.getCookie('authToken');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    return this.http.post<any[]>(
      `${this.baseAPI}TrackingApi/search`,
      searchContent,
      { headers }
    );
  }


  // view items
  //Click and view the details of the item

  viewItemBtn(HAWBNo: string, MAWBNo: string) {
    console.log(HAWBNo, MAWBNo)
    if (HAWBNo !== '') {
      this.trackingNumber = HAWBNo;
      this.trackingNumberService.setData(this.trackingNumber);
      this.router.navigate(['/shipment-summary']);
    } else {
      this.trackingNumber = MAWBNo;
      this.trackingNumberService.setData(this.trackingNumber);
      this.router.navigate(['/shipment-summary']);
    }
  }


  // table items
  // findNowStatusIndex(allStatus: string[], nowStatus: string): number {
  //   return allStatus.indexOf(nowStatus);
  // }


  // Cookie
  // get coolies
  getCookie(name: string): string | null {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? match[2] : null;
  }


  // Status class implementation

  getStatusClass(MilestoneNode: string | null, nowStatus: string): any {
    if (!MilestoneNode) {
      return "bg-gray-300"; // 當 MilestoneNode 為 null 時，使用預設灰色樣式
    }
    // MilestoneNode === 'Booked'
    if (MilestoneNode === 'Booked') {
      if (nowStatus === 'Booked') {
        return "bg-primary";
      } else if (nowStatus === 'ETD') {
        return "bg-gray-300";
      } else if (nowStatus === 'ATD') {
        return "bg-gray-300";
      } else if (nowStatus === 'ETA') {
        return "bg-gray-300";
      } else if (nowStatus === 'ATA') {
        return "bg-gray-300";
      } else if (nowStatus === 'Completed') {
        return "bg-gray-300";
      }
    }
    // MilestoneNode === 'ETD'
    if (MilestoneNode === 'ETD') {
      if (nowStatus === 'Booked') {
        return "bg-primary";
      } else if (nowStatus === 'ETD') {
        return "bg-primary";
      } else if (nowStatus === 'ATD') {
        return "bg-gray-300";
      } else if (nowStatus === 'ETA') {
        return "bg-gray-300";
      } else if (nowStatus === 'ATA') {
        return "bg-gray-300";
      } else if (nowStatus === 'Completed') {
        return "bg-gray-300";
      }
    }
    // MilestoneNode === 'ATD'
    if (MilestoneNode === 'ATD') {
      if (nowStatus === 'Booked') {
        return "bg-primary";
      } else if (nowStatus === 'ETD') {
        return "bg-primary";
      } else if (nowStatus === 'ATD') {
        return "bg-primary";
      } else if (nowStatus === 'ETA') {
        return "bg-gray-300";
      } else if (nowStatus === 'ATA') {
        return "bg-gray-300";
      } else if (nowStatus === 'Completed') {
        return "bg-gray-300";
      }
    }
    // MilestoneNode === 'ETA'
    if (MilestoneNode === 'ATD') {
      if (nowStatus === 'Booked') {
        return "bg-primary";
      } else if (nowStatus === 'ETD') {
        return "bg-primary";
      } else if (nowStatus === 'ATD') {
        return "bg-primary";
      } else if (nowStatus === 'ETA') {
        return "bg-primary";
      } else if (nowStatus === 'ATA') {
        return "bg-gray-300";
      } else if (nowStatus === 'Completed') {
        return "bg-gray-300";
      }
    }

    if (MilestoneNode === 'Pod') {
      return "bg-primary";
    }
    if (MilestoneNode === 'ATA') {
      return nowStatus === 'Completed' ? "bg-gray-300" : "bg-primary";
    }
    if (MilestoneNode === 'ETA') {
      return (nowStatus === 'Completed' || nowStatus === 'ATA') ? "bg-gray-300" : "bg-primary";
    }

    return "bg-gray-300";
  }

  getTextClass(MilestoneNode: string | null, nowStatus: string): any {
    if (!MilestoneNode) {
      return "text-gray-400"; // 當 MilestoneNode 為 null 時，使用預設樣式
    }

    // MilestoneNode === 'Booked'
    if (MilestoneNode === 'Booked') {
      if (nowStatus === 'Booked') {
        return "text-primary";
      } else if (nowStatus === 'ETD') {
        return "text-gray-300";
      } else if (nowStatus === 'ATD') {
        return "text-gray-300";
      } else if (nowStatus === 'ETA') {
        return "text-gray-300";
      } else if (nowStatus === 'ATA') {
        return "text-gray-300";
      } else if (nowStatus === 'Completed') {
        return "text-gray-300";
      }
    }
    // MilestoneNode === 'ETD'
    if (MilestoneNode === 'ETD') {
      if (nowStatus === 'Booked') {
        return "text-primary";
      } else if (nowStatus === 'ETD') {
        return "text-gray-300";
      } else if (nowStatus === 'ATD') {
        return "text-gray-300";
      } else if (nowStatus === 'ETA') {
        return "text-gray-300";
      } else if (nowStatus === 'ATA') {
        return "text-gray-300";
      } else if (nowStatus === 'Completed') {
        return "text-gray-300";
      }
    }
    // MilestoneNode === 'ATD'
    if (MilestoneNode === 'ATD') {
      if (nowStatus === 'Booked') {
        return "text-primary";
      } else if (nowStatus === 'ETD') {
        return "text-primary";
      } else if (nowStatus === 'ATD') {
        return "text-gray-300";
      } else if (nowStatus === 'ETA') {
        return "text-gray-300";
      } else if (nowStatus === 'ATA') {
        return "text-gray-300";
      } else if (nowStatus === 'Completed') {
        return "text-gray-300";
      }
    }
    // MilestoneNode === 'ATD'
    if (MilestoneNode === 'ATD') {
      if (nowStatus === 'Booked') {
        return "text-primary";
      } else if (nowStatus === 'ETD') {
        return "text-primary";
      } else if (nowStatus === 'ATD') {
        return "text-primary";
      } else if (nowStatus === 'ETA') {
        return "text-gray-300";
      } else if (nowStatus === 'ATA') {
        return "text-gray-300";
      } else if (nowStatus === 'Completed') {
        return "text-gray-300";
      }
    }

    if (MilestoneNode === 'Pod') {
      return "text-primary";
    }
    if (MilestoneNode === 'ATA') {
      return nowStatus === 'Completed' ? "text-gray-300" : "text-primary";
    }
    if (MilestoneNode === 'ETA') {
      return (nowStatus === 'Completed' || nowStatus === 'ATA') ? "text-gray-300" : "text-primary";
    }

    return "text-gray-400";
  }









}
