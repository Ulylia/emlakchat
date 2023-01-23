import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GorevComponent } from './gorev.component';

describe('GorevComponent', () => {
  let component: GorevComponent;
  let fixture: ComponentFixture<GorevComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GorevComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GorevComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
