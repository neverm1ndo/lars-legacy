import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TargetLoglineContentComponent } from './target-logline-content.component';

describe('TargetLoglineContentComponent', () => {
  let component: TargetLoglineContentComponent;
  let fixture: ComponentFixture<TargetLoglineContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TargetLoglineContentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TargetLoglineContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
