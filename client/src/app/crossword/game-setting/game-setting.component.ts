import {Component} from "@angular/core";

@Component({
  selector: "app-game-setting",
  templateUrl: "./game-setting.component.html",
  styleUrls: ["./game-setting.component.css"]
})
export class GameSettingComponent {
  public typeOfGame: string;
  public difficulty: string;
  public startButton: string;
  public isDifficultyDisabled: boolean;

  public constructor() {
    this.soloSelected();
  }

  public soloSelected(): void {
    this.startButton = "Start Playing!";
    this.typeOfGame = "solo";
    this.difficulty = "easy";
    this.isDifficultyDisabled = false;
  }

  public multiPlayerSelected(): void {
    this.startButton = "Join lobby";
    this.difficulty = "multiplayer-lobby";
    this.isDifficultyDisabled = true;
  }

}
