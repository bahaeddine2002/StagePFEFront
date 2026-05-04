import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TccRessourceFormDrawerComponent } from './tcc-ressource-form-drawer.component';

describe('TccRessourceFormDrawerComponent', () => {
  let component: TccRessourceFormDrawerComponent;
  let fixture: ComponentFixture<TccRessourceFormDrawerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TccRessourceFormDrawerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TccRessourceFormDrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
