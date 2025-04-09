import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShipmentOtherInfoMilestonesGuestComponent } from './shipment-other-info-milestones-guest.component';

describe('ShipmentOtherInfoMilestonesGuestComponent', () => {
  let component: ShipmentOtherInfoMilestonesGuestComponent;
  let fixture: ComponentFixture<ShipmentOtherInfoMilestonesGuestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShipmentOtherInfoMilestonesGuestComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShipmentOtherInfoMilestonesGuestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
