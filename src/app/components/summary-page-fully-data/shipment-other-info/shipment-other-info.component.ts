import { Component, inject, Input } from '@angular/core';
import { ShipmentOtherInfoDetailsComponent } from '../../summary-page-fully-data/shipment-other-info-details/shipment-other-info-details.component';
import { ShipmentOtherInfoMilestonesComponent } from '../../summary-page-fully-data/shipment-other-info-milestones/shipment-other-info-milestones.component';
import { ShipmentOtherInfoFilesComponent } from '../../summary-page-fully-data/shipment-other-info-files/shipment-other-info-files.component';
import { ShipmentDataService } from '../../../services/shipment-data.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-shipment-other-info',
  imports: [ShipmentOtherInfoDetailsComponent, ShipmentOtherInfoMilestonesComponent, ShipmentOtherInfoFilesComponent, CommonModule],
  templateUrl: './shipment-other-info.component.html',
  styleUrl: './shipment-other-info.component.css'
})
export class ShipmentOtherInfoComponent {

  /*--------- @Input ---------*/

  @Input() trackingNumber: string = '';

  /*--------- Inject ---------*/
  userService = inject(ShipmentDataService);


  /*------- style settings -------*/




  /*------- Variables -------*/

  data: any = {};

  menu = ['Shipment Details', 'Milestones', 'Files']
  selectedMenu = 'Shipment Details';
  users: any[] = [];

  isLoading: boolean = false;


  /*------- Functions -------*/

  menuSelected(menu: string, $index: number): void {
    this.selectedMenu = menu;
  }




}
