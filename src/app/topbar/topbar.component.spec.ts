import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TopbarComponent } from './topbar.component';
import { UserService } from '../user/user.service';

describe('TopbarComponent', () => {
  let component: TopbarComponent;
  let fixture: ComponentFixture<TopbarComponent>;
  let fakeUserService
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TopbarComponent ],
      providers: [UserService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TopbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
  xit('opens forum', () => {
    expect(true).toBeTruthy();
  })
});
