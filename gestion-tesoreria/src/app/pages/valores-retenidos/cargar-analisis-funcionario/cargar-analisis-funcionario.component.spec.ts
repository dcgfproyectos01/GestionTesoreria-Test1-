import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CargarAnalisisFuncionarioComponent } from './cargar-analisis-funcionario.component';

describe('CargarAnalisisFuncionarioComponent', () => {
  let component: CargarAnalisisFuncionarioComponent;
  let fixture: ComponentFixture<CargarAnalisisFuncionarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CargarAnalisisFuncionarioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CargarAnalisisFuncionarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
