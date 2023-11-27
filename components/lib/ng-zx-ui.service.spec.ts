import { TestBed } from '@angular/core/testing';
import { NgZxUiService } from 'zx-ui/lib/ng-zx-ui.service'

describe('NgZxUiService', () => {
  let service: NgZxUiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgZxUiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
