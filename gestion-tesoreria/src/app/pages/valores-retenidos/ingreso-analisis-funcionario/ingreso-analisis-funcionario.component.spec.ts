import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IngresoAnalisisFuncionarioComponent } from './ingreso-analisis-funcionario.component';

describe('IngresoAnalisisFuncionarioComponent', () => {
  let component: IngresoAnalisisFuncionarioComponent;
  let fixture: ComponentFixture<IngresoAnalisisFuncionarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IngresoAnalisisFuncionarioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IngresoAnalisisFuncionarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
