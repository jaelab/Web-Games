import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { RaceResultsComponent } from "./race-results.component";
import { AppModule } from "../../../app.module";

describe("RaceResultsComponent", () => {
  let component: RaceResultsComponent;
  let fixture: ComponentFixture<RaceResultsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AppModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RaceResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
