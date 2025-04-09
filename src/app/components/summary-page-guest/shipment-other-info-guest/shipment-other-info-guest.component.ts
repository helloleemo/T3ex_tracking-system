import { Component, Input } from '@angular/core';
import { ShipmentOtherInfoDetailsGuestComponent } from '../shipment-other-info-details-guest/shipment-other-info-details-guest.component';
import { ShipmentOtherInfoMilestonesGuestComponent } from '../shipment-other-info-milestones-guest/shipment-other-info-milestones-guest.component';

@Component({
  selector: 'app-shipment-other-info-guest',
  imports: [ShipmentOtherInfoDetailsGuestComponent, 
    ShipmentOtherInfoMilestonesGuestComponent
  ],
  templateUrl: './shipment-other-info-guest.component.html',
  styleUrl: './shipment-other-info-guest.component.css'
})
export class ShipmentOtherInfoGuestComponent {

  /*------- style settings -------*/

  /*------- Variables -------*/

  menu = ['Shipment Details', 'Milestones']
  selectedMenu = 'Shipment Details';
  users: any[] = [];


  /*------- Data import -------*/
  // @Input
  @Input() trackingNo: string = ''


  /*------- Functions -------*/

  menuSelected(menu: string, $index: number): void {
    this.selectedMenu = menu;
  }

}
