import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShipmentOtherInfoMilestonesComponent } from './shipment-other-info-milestones.component';

describe('ShipmentOtherInfoMilestonesComponent', () => {
  let component: ShipmentOtherInfoMilestonesComponent;
  let fixture: ComponentFixture<ShipmentOtherInfoMilestonesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShipmentOtherInfoMilestonesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShipmentOtherInfoMilestonesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
