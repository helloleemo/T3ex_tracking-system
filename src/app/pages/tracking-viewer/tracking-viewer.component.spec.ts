import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrackingViewerComponent } from './tracking-viewer.component';

describe('TrackingViewerComponent', () => {
  let component: TrackingViewerComponent;
  let fixture: ComponentFixture<TrackingViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrackingViewerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrackingViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
