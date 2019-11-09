import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditosPage } from './creditos.page';

describe('CreditosPage', () => {
  let component: CreditosPage;
  let fixture: ComponentFixture<CreditosPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreditosPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreditosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
