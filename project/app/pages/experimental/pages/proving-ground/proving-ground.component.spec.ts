import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProvingGroundComponent } from './proving-ground.component';

describe('ProvingGroundComponent', () => {
  let component: ProvingGroundComponent;
  let fixture: ComponentFixture<ProvingGroundComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ProvingGroundComponent]
    });
    fixture = TestBed.createComponent(ProvingGroundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
