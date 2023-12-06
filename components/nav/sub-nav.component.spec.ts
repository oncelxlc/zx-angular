import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZxSubNavComponent } from 'zx-ui/nav/sub-nav.component';

describe('SubNavComponent', () => {
  let component: ZxSubNavComponent;
  let fixture: ComponentFixture<ZxSubNavComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ZxSubNavComponent]
    });
    fixture = TestBed.createComponent(ZxSubNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
