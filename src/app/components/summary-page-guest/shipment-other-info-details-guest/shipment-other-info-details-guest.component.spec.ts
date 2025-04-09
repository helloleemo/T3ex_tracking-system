import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShipmentOtherInfoDetailsGuestComponent } from './shipment-other-info-details-guest.component';

describe('ShipmentOtherInfoDetailsGuestComponent', () => {
  let component: ShipmentOtherInfoDetailsGuestComponent;
  let fixture: ComponentFixture<ShipmentOtherInfoDetailsGuestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShipmentOtherInfoDetailsGuestComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShipmentOtherInfoDetailsGuestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
