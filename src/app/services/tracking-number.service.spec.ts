import { TestBed } from '@angular/core/testing';

import { TrackingNumberService } from './tracking-number.service';

describe('TrackingNumberService', () => {
  let service: TrackingNumberService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TrackingNumberService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
