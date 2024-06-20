import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OldPasswordComponent } from './old-password.component';

describe('OldPasswordComponent', () => {
  let component: OldPasswordComponent;
  let fixture: ComponentFixture<OldPasswordComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OldPasswordComponent]
    });
    fixture = TestBed.createComponent(OldPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
