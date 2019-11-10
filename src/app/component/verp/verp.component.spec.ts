import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VerpComponent } from './verp.component';

describe('VerpComponent', () => {
  let component: VerpComponent;
  let fixture: ComponentFixture<VerpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VerpComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
