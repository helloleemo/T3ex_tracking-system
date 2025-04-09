import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShipmentOtherInfoFilesGuestComponent } from './shipment-other-info-files-guest.component';

describe('ShipmentOtherInfoFilesGuestComponent', () => {
  let component: ShipmentOtherInfoFilesGuestComponent;
  let fixture: ComponentFixture<ShipmentOtherInfoFilesGuestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShipmentOtherInfoFilesGuestComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShipmentOtherInfoFilesGuestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
