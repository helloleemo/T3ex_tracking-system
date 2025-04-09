import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShipmentDetailsGuestComponent } from './shipment-details-guest.component';

describe('ShipmentDetailsGuestComponent', () => {
  let component: ShipmentDetailsGuestComponent;
  let fixture: ComponentFixture<ShipmentDetailsGuestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShipmentDetailsGuestComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShipmentDetailsGuestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
