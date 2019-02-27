import { TestBed, inject } from '@angular/core/testing';

import { Web3codeService } from './web3code.service';

describe('Web3codeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [Web3codeService]
    });
  });

  it('should be created', inject([Web3codeService], (service: Web3codeService) => {
    expect(service).toBeTruthy();
  }));
});
