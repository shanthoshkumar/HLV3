import { TestBed, async, inject } from '@angular/core/testing';

import { MetaguardGuard } from './metaguard.guard';

describe('MetaguardGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MetaguardGuard]
    });
  });

  it('should ...', inject([MetaguardGuard], (guard: MetaguardGuard) => {
    expect(guard).toBeTruthy();
  }));
});
