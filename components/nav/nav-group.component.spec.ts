import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZxNavGroupComponent } from 'components/nav/nav-group.component';

describe('ZxNavGroupComponent', () => {
  let component: ZxNavGroupComponent;
  let fixture: ComponentFixture<ZxNavGroupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ZxNavGroupComponent]
    });
    fixture = TestBed.createComponent(ZxNavGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
