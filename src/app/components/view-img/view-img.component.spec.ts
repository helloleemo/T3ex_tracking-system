import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewImgComponent } from './view-img.component';

describe('ViewImgComponent', () => {
  let component: ViewImgComponent;
  let fixture: ComponentFixture<ViewImgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewImgComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewImgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
