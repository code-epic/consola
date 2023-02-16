import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MonitorestatusComponent } from './monitorestatus.component';

describe('MonitorestatusComponent', () => {
  let component: MonitorestatusComponent;
  let fixture: ComponentFixture<MonitorestatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MonitorestatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MonitorestatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
