import { TestBed } from '@angular/core/testing';

import { ToastService } from './toast.service';

describe('ToastService', () => {
  let service: ToastService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ToastService);
    service.toasts = [];
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('should add toast', () => {
    service.show('Toasty!');
    expect(service.toasts.length > 0).toBeTruthy();
  });
  it('should remove toast', () => {
    service.show('Toasty!');
    service.remove({textOrTpl: 'Toasty!'});
    expect(service.toasts.includes({textOrTpl: 'Toasty!'})).toBeFalsy();
  });
});
