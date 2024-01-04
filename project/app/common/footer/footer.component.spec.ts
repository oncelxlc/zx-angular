import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ZxaFooterComponent } from './footer.component';

describe('ZxaFooterComponent', () => {
  let component: ZxaFooterComponent;
  let fixture: ComponentFixture<ZxaFooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ZxaFooterComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ZxaFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
