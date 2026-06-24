import { TestBed } from '@angular/core/testing';

import { ExtensionistaService } from './extensionista.service';

describe('ExtensionistaService', () => {
  let service: ExtensionistaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExtensionistaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
