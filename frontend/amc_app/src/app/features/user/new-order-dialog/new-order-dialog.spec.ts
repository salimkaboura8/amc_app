import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewOrderDialog } from './new-order-dialog';

describe('NewOrderDialog', () => {
  let component: NewOrderDialog;
  let fixture: ComponentFixture<NewOrderDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewOrderDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewOrderDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
