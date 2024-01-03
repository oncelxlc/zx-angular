import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FirstNavComponent } from './first-nav.component';

describe('FirstNavComponent', () => {
  let component: FirstNavComponent;
  let fixture: ComponentFixture<FirstNavComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FirstNavComponent]
    });
    fixture = TestBed.createComponent(FirstNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
