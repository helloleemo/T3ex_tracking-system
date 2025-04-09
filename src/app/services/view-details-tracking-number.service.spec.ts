import { TestBed } from '@angular/core/testing';

import { ViewDetailsTrackingNumberService } from './view-details-tracking-number.service';

describe('ViewDetailsTrackingNumberService', () => {
  let service: ViewDetailsTrackingNumberService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ViewDetailsTrackingNumberService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
