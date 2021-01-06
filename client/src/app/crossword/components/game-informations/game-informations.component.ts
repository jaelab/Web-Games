import { Component } from "@angular/core";

@Component({
  selector: "app-game-informations",
  templateUrl: "./game-informations.component.html",
  styleUrls: ["./game-informations.component.css"]
})
export class GameInformationsComponent {

  public difficulty: string;
  public typeOfGame: string;
  public numberOfWords: string = "0";
  public numberOfWordsFound: string = "0";

  public setupGameinformation(difficulty: string, typeOfGame: string, numberOfWords: number): void {
    this.difficulty = difficulty;
    this.numberOfWords = String(numberOfWords);
    this.typeOfGame = typeOfGame;
  }

  public updateProgressBar(numberOfWordsFound: number): void {
    this.numberOfWordsFound = String(numberOfWordsFound);
  }
}
