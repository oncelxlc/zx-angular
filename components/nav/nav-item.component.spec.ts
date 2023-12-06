import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZxNavItemComponent } from 'components/nav/nav-item.component';

describe('NavItemComponent', () => {
  let component: ZxNavItemComponent;
  let fixture: ComponentFixture<ZxNavItemComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ZxNavItemComponent]
    });
    fixture = TestBed.createComponent(ZxNavItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
