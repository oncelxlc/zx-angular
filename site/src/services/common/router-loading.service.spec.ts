import { TestBed } from '@angular/core/testing';

import { RouterLoadingService } from './router-loading.service';

describe('RouterLoadingService', () => {
  let service: RouterLoadingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RouterLoadingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
