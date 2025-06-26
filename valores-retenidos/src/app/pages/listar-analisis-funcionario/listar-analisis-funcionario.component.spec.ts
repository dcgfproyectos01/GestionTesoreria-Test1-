import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarAnalisisFuncionarioComponent } from './listar-analisis-funcionario.component';

describe('ListarAnalisisFuncionarioComponent', () => {
  let component: ListarAnalisisFuncionarioComponent;
  let fixture: ComponentFixture<ListarAnalisisFuncionarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListarAnalisisFuncionarioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListarAnalisisFuncionarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
