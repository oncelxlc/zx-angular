import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ZxaFirstNavComponent} from './first-nav.component';

describe('ZxaFirstNavComponent', () => {
  let component: ZxaFirstNavComponent;
  let fixture: ComponentFixture<ZxaFirstNavComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ZxaFirstNavComponent],
    });
    fixture = TestBed.createComponent(ZxaFirstNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
