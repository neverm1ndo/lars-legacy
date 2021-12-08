import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToastsContainer} from './toasts-container.component';

describe('ToastsContainerComponent', () => {
  let component: ToastsContainer;
  let fixture: ComponentFixture<ToastsContainer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ToastsContainer ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ToastsContainer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
