import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZxButtonComponent } from './button.component';

describe('ButtonComponent', () => {
  let component: ZxButtonComponent;
  let fixture: ComponentFixture<ZxButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ZxButtonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ZxButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
