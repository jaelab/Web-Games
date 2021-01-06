import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { GameSettingComponent } from "./game-setting.component";
import { AppModule } from "../../app.module";

describe("GameSettingComponent", () => {
  let component: GameSettingComponent;
  let fixture: ComponentFixture<GameSettingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AppModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GameSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  describe("Function soloSelected", () => {

    it("should initialize the view with the solo informations", () => {
      component.soloSelected();
      expect(component.startButton).toEqual("Start Playing!");
      expect(component.typeOfGame).toEqual("solo");
      expect(component.difficulty).toEqual("easy");
      expect(component.isDifficultyDisabled).toEqual(false);
    });

  });

  describe("Function multiPlayerSelected", () => {

    it("should initialize the view with the multiplayer informations", () => {
      component.multiPlayerSelected();
      expect(component.startButton).toEqual("Join lobby");
      expect(component.difficulty).toEqual("multiplayer-lobby");
      expect(component.isDifficultyDisabled).toEqual(true);
    });

  });
});
