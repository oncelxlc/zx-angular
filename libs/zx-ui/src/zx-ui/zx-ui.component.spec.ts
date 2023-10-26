import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ZxUiComponent } from 'src/zx-ui/zx-ui.component';

describe('ZxUiComponent', () => {
  let component: ZxUiComponent;
  let fixture: ComponentFixture<ZxUiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ZxUiComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ZxUiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
