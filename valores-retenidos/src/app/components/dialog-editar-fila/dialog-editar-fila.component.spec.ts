import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogEditarFilaComponent } from './dialog-editar-fila.component';

describe('DialogEditarFilaComponent', () => {
  let component: DialogEditarFilaComponent;
  let fixture: ComponentFixture<DialogEditarFilaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogEditarFilaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogEditarFilaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
