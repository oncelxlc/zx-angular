import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZxNavComponent } from './nav.component';

describe('NavComponent', () => {
  let component: ZxNavComponent;
  let fixture: ComponentFixture<ZxNavComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ZxNavComponent]
    });
    fixture = TestBed.createComponent(ZxNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
