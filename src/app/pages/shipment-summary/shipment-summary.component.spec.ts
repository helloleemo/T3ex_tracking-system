import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShipmentSummaryComponent } from './shipment-summary.component';

describe('ShipmentSummaryComponent', () => {
  let component: ShipmentSummaryComponent;
  let fixture: ComponentFixture<ShipmentSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShipmentSummaryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShipmentSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
