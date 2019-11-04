import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AlertComponent } from './alert.component';

describe('AlertComponent', () => {
  let component: AlertComponent;
  let fixture: ComponentFixture<AlertComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AlertComponent],
      imports: [BrowserAnimationsModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should contains the message in the alert', () => {
    spyOn(component.closeAlert, 'emit');
    const compiled = fixture.debugElement.nativeElement;
    component.message = 'some error';
    fixture.detectChanges();
    expect(compiled.querySelector('p').textContent).toContain('some error');
    component.message = '';
    fixture.detectChanges();
  });

  it('should emit the event in case of calling closeAlert', () => {
    spyOn(component.closeAlert, 'emit');
    const compiled = fixture.debugElement.nativeElement;
    component.message = 'some error';
    fixture.detectChanges();
    compiled.querySelector('button').click();
    component.message = '';
    fixture.detectChanges();
    expect(component.closeAlert.emit).toHaveBeenCalled();
  });
});
