import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShipmentOtherInfoComponent } from './shipment-other-info.component';

describe('ShipmentOtherInfoComponent', () => {
  let component: ShipmentOtherInfoComponent;
  let fixture: ComponentFixture<ShipmentOtherInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShipmentOtherInfoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShipmentOtherInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
