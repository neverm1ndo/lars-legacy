import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthLoglineContentComponent } from './auth-logline-content.component';

describe('AuthLoglineContentComponent', () => {
  let component: AuthLoglineContentComponent;
  let fixture: ComponentFixture<AuthLoglineContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuthLoglineContentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthLoglineContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
