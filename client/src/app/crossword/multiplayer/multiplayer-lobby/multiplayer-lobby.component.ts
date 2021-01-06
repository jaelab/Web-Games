import { Component, OnInit } from "@angular/core";
import { MultiplayerGameData } from "../../../../../../common/crossword-multiplayer-data/multiplayer-game-data";
import { SocketService } from "../../services/socket.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-multiplayer-lobby",
  templateUrl: "./multiplayer-lobby.component.html",
  styleUrls: ["./multiplayer-lobby.component.css"]
})
export class MultiplayerLobbyComponent implements OnInit {

  private _inWaitGames: MultiplayerGameData[];
  public newPlayerName: string;
  private _difficulty: string;

  public constructor(private socketService: SocketService, private router: Router) {
    this._inWaitGames = [];
    this.newPlayerName = "";
    this._difficulty = "easy";
  }

  public async ngOnInit(): Promise<void> {
    this.socketService.connect();
    this.getGamesOnConnect();
  }

  private async getGamesOnConnect(): Promise<void> {
    this.socketService.getGamesOnConnect().subscribe(async (arrayGames) => {
      this._inWaitGames = arrayGames;
    });
  }

  public createNewGame( newGameDifficulty: string): void {
    if (this.newPlayerName !== "") {
      this.socketService.createNewGame(new MultiplayerGameData(newGameDifficulty, this.newPlayerName));
      this.router.navigateByUrl("/crossword/multiplayer/" + newGameDifficulty + "/" + this.newPlayerName + "/" + this.newPlayerName);
    } else {
      alert("Please kev.. Enter a name");
    }
  }

  public joinGame(multiplayerGameData: MultiplayerGameData): void {
    if (this.newPlayerName !== "") {
      multiplayerGameData.players[1] = this.newPlayerName;
      this.socketService.joinGame(multiplayerGameData);
      this.router.navigateByUrl("crossword/multiplayer/"
        + multiplayerGameData.gameDifficulty + "/" + multiplayerGameData.players[0] + "/" + this.newPlayerName);

    } else {
      alert("Please Jad.. Enter a name");
    }
  }
}
