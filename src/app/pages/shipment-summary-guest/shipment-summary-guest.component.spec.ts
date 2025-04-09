import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShipmentSummaryGuestComponent } from './shipment-summary-guest.component';

describe('ShipmentSummaryGuestComponent', () => {
  let component: ShipmentSummaryGuestComponent;
  let fixture: ComponentFixture<ShipmentSummaryGuestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShipmentSummaryGuestComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShipmentSummaryGuestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
