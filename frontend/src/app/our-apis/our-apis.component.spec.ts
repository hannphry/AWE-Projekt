import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OurAPIsComponent } from './our-apis.component';

describe('OurAPIsComponent', () => {
  let component: OurAPIsComponent;
  let fixture: ComponentFixture<OurAPIsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OurAPIsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OurAPIsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
