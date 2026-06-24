import { TestBed } from '@angular/core/testing';

import { GrupoPetService } from './grupo-pet.service';

describe('GrupoPetService', () => {
  let service: GrupoPetService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GrupoPetService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
