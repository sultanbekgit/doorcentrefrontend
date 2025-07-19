import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminPlatbandComponent } from './admin-platband.component';

describe('AdminPlatbandComponent', () => {
  let component: AdminPlatbandComponent;
  let fixture: ComponentFixture<AdminPlatbandComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminPlatbandComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminPlatbandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
