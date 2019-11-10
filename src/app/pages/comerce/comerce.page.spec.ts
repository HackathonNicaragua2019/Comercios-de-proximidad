import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComercePage } from './comerce.page';

describe('ComercePage', () => {
  let component: ComercePage;
  let fixture: ComponentFixture<ComercePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComercePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComercePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
