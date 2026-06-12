import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TerminalComponent } from './terminal.component';

xdescribe('TerminalComponent', () => {
  let component: TerminalComponent;
  let fixture: ComponentFixture<TerminalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TerminalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TerminalComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
