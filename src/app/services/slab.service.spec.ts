import { TestBed } from '@angular/core/testing';

import { SlabService } from './slab.service';

describe('SlabService', () => {
  let service: SlabService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SlabService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
