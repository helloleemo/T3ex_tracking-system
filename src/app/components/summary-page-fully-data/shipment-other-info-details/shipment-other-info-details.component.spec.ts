import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShipmentOtherInfoDetailsComponent } from './shipment-other-info-details.component';

describe('ShipmentOtherInfoDetailsComponent', () => {
  let component: ShipmentOtherInfoDetailsComponent;
  let fixture: ComponentFixture<ShipmentOtherInfoDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShipmentOtherInfoDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShipmentOtherInfoDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
