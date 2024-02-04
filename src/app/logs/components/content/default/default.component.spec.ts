import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DefaultLogLineContentComponent } from './default.component';

describe('Defaultomponent', () => {
  let component: DefaultLogLineContentComponent;
  let fixture: ComponentFixture<DefaultLogLineContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DefaultLogLineContentComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(DefaultLogLineContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
