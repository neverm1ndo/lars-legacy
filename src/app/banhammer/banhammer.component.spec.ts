import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BanhammerComponent } from './banhammer.component';

describe('BanhammerComponent', () => {
  let component: BanhammerComponent;
  let fixture: ComponentFixture<BanhammerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BanhammerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BanhammerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
