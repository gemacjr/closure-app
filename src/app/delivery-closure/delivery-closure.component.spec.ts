import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveryClosureComponent } from './delivery-closure.component';

describe('DeliveryClosureComponent', () => {
  let component: DeliveryClosureComponent;
  let fixture: ComponentFixture<DeliveryClosureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeliveryClosureComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeliveryClosureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
