import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OurDataComponent } from './our-data.component';

describe('OurDataComponent', () => {
  let component: OurDataComponent;
  let fixture: ComponentFixture<OurDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OurDataComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OurDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
