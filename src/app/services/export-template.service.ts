import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class ExportTemplateService {


  private milestonesSource = new BehaviorSubject<any[]>([]);
  private flightSegmentsSource = new BehaviorSubject<any[]>([]);
  private dimensionsSource = new BehaviorSubject<any[]>([]);

  milestones$ = this.milestonesSource.asObservable();
  flightSegments$ = this.flightSegmentsSource.asObservable();
  dimensions$ = this.dimensionsSource.asObservable();

  constructor() {}


  // SETTER

  setMilestones(milestones: any[]) {
    this.milestonesSource.next(milestones);
  }

  setFlightSegments(flights: any[]) {
    this.flightSegmentsSource.next(flights);
  }

  setDimensions(dimensions: any[]) {
    this.dimensionsSource.next(dimensions);
  }


  // GETTER
  getMilestones() {
    return this.milestonesSource.value;
  }

  getFlightSegments() {
    return this.flightSegmentsSource.value;
  }

  getDimensions() {
    return this.dimensionsSource.value;
  }


}
