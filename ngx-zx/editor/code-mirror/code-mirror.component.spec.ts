import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CodeMirrorComponent } from './code-mirror.component';

describe('CodeMirrorComponent', () => {
  let component: CodeMirrorComponent;
  let fixture: ComponentFixture<CodeMirrorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CodeMirrorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CodeMirrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
