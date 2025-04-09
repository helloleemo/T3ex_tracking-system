import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShipmentOtherInfoFilesComponent } from './shipment-other-info-files.component';

describe('ShipmentOtherInfoFilesComponent', () => {
  let component: ShipmentOtherInfoFilesComponent;
  let fixture: ComponentFixture<ShipmentOtherInfoFilesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShipmentOtherInfoFilesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShipmentOtherInfoFilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
