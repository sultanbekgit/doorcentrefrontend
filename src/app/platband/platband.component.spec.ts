import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlatbandComponent } from './platband.component';

describe('PlatbandComponent', () => {
  let component: PlatbandComponent;
  let fixture: ComponentFixture<PlatbandComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PlatbandComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlatbandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
