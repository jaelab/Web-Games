import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { SoloComponent } from "./solo.component";
import { AppModule } from "../../app.module";

describe("SoloComponent", () => {
  let component: SoloComponent;
  let fixture: ComponentFixture<SoloComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AppModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SoloComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  describe("Function getCrossword", () => {

    it("should get a crossword from the server", async() => {
      component.getCrossword();
      expect(component.crossword).not.toEqual(undefined);
    });

  });
});
