import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { CheatModeComponent } from "./cheat-mode.component";
import { CheatModeService } from "./cheat-mode.service";

describe("CheatModeComponent", () => {
  let component: CheatModeComponent;
  let fixture: ComponentFixture<CheatModeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheatModeComponent ], providers: [CheatModeService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheatModeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
