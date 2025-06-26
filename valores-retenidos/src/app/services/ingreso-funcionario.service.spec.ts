import { TestBed } from '@angular/core/testing';

import { IngresoFuncionarioService } from './ingreso-funcionario.service';

describe('IngresoFuncionarioService', () => {
  let service: IngresoFuncionarioService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IngresoFuncionarioService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
