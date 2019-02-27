import { TestBed, async, inject } from '@angular/core/testing';

import { BrokerGuard } from './broker.guard';

describe('BrokerGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BrokerGuard]
    });
  });

  it('should ...', inject([BrokerGuard], (guard: BrokerGuard) => {
    expect(guard).toBeTruthy();
  }));
});
