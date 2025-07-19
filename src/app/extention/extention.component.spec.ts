import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtentionComponent } from './extention.component';

describe('ExtentionComponent', () => {
  let component: ExtentionComponent;
  let fixture: ComponentFixture<ExtentionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ExtentionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExtentionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
