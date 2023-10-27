import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgZxUiComponent } from 'components/lib/ng-zx-ui.component';

describe('NgZxUiComponent', () => {
  let component: NgZxUiComponent;
  let fixture: ComponentFixture<NgZxUiComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NgZxUiComponent]
    });
    fixture = TestBed.createComponent(NgZxUiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
