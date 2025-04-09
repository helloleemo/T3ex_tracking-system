import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../.environments/environment.prod';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShipmentDataService {

  /*--------- Inject ---------*/
  http = inject(HttpClient)

  /*--------- Variables ---------*/
  // shipmentDataAPI = environment.shipmentDataAPI;
  // flightsDataAPI = environment.shipmentDataAPI;



  /*--------- Functions ---------*/
  // getShipmentData(): Observable<any[]> {
  // return this.http.get<any[]>(`${this.shipmentDataAPI}/data`);
  // }

  // getFlightsData(): Observable<any[]> {
  // return this.http.get<any[]>(`${this.flightsDataAPI}/data`);
  // }





}
