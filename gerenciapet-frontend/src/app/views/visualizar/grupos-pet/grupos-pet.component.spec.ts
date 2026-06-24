import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GruposPetComponent } from './grupos-pet.component';

describe('GruposPetComponent', () => {
  let component: GruposPetComponent;
  let fixture: ComponentFixture<GruposPetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GruposPetComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GruposPetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
