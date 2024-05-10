import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OverlayExpComponent } from './overlay-exp.component';

describe('OverlayExpComponent', () => {
  let component: OverlayExpComponent;
  let fixture: ComponentFixture<OverlayExpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OverlayExpComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OverlayExpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
