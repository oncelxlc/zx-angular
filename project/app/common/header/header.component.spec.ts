import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ZxaHeaderComponent } from './header.component';

describe('ZxaHeaderComponent', () => {
  let component: ZxaHeaderComponent;
  let fixture: ComponentFixture<ZxaHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ZxaHeaderComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ZxaHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
