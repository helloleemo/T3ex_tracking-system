import { TestBed } from '@angular/core/testing';

import { ShipmentDataService } from './shipment-data.service';

describe('ShipmentDataService', () => {
  let service: ShipmentDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShipmentDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
