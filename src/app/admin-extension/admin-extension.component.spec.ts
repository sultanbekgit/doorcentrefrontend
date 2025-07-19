import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminExtensionComponent } from './admin-extension.component';

describe('AdminExtensionComponent', () => {
  let component: AdminExtensionComponent;
  let fixture: ComponentFixture<AdminExtensionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminExtensionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminExtensionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
