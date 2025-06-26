import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportabilidadComponent } from './reportabilidad.component';

describe('ReportabilidadComponent', () => {
  let component: ReportabilidadComponent;
  let fixture: ComponentFixture<ReportabilidadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportabilidadComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportabilidadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
