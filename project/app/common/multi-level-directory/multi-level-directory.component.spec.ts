import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiLevelDirectoryComponent } from './multi-level-directory.component';

describe('MultiLevelDirectoryComponent', () => {
  let component: MultiLevelDirectoryComponent;
  let fixture: ComponentFixture<MultiLevelDirectoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MultiLevelDirectoryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MultiLevelDirectoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
