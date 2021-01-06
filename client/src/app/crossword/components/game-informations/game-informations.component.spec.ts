import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { GameInformationsComponent } from "./game-informations.component";
import { AppModule } from "../../../app.module";

// tslint:disable:no-magic-numbers
describe("GameInformationsComponent", () => {
  let component: GameInformationsComponent;
  let fixture: ComponentFixture<GameInformationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AppModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GameInformationsComponent);
    component = fixture.componentInstance;
    const mockNumberOfWord: number = 40;
    component.numberOfWords = mockNumberOfWord.toString();
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  describe("Function setupGameinformation", () => {

    it("should setup the game informations", () => {
      component.setupGameinformation("easy", "singlePlayer", 40);

      expect(component.difficulty).toEqual("easy");
      expect(component.typeOfGame).toEqual("singlePlayer");
      expect(component.numberOfWords).toEqual("40");
    });

  });

  describe("Function updateProgressBar", () => {

    it("should setup the game informations", () => {
      component.updateProgressBar(30);

      expect(component.numberOfWordsFound).toEqual("30");
    });

  });
});
