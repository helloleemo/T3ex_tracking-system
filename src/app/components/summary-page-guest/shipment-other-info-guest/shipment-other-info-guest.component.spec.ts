import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShipmentOtherInfoGuestComponent } from './shipment-other-info-guest.component';

describe('ShipmentOtherInfoGuestComponent', () => {
  let component: ShipmentOtherInfoGuestComponent;
  let fixture: ComponentFixture<ShipmentOtherInfoGuestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShipmentOtherInfoGuestComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShipmentOtherInfoGuestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
