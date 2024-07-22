import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentTipsComponent } from './document-tips.component';

describe('DocumentTipsComponent', () => {
  let component: DocumentTipsComponent;
  let fixture: ComponentFixture<DocumentTipsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ DocumentTipsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocumentTipsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
