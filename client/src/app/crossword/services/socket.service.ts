import { Injectable } from "@angular/core";
import * as io from "socket.io-client";
import { Observable } from "rxjs/Observable";
import { MultiplayerGameData } from "../../../../../common/crossword-multiplayer-data/multiplayer-game-data";
import { Crossword } from "../../../../../common/communication/crossword";
import { Word } from "../../../../../common/communication/word";

const SERVER_URL: string = "http://localhost:3000";

@Injectable()
export class SocketService {

  private socket: SocketIOClient.Socket;

  public connect(): void {
    this.socket = io(SERVER_URL);
  }

  public createNewGame(gameData: MultiplayerGameData): void {
    this.socket.emit("new game", gameData);
  }

  public joinGame(gameData: MultiplayerGameData): void {
    this.socket.emit("join game", gameData);
  }

  public getGamesOnConnect(): Observable<MultiplayerGameData[]> {
    return new Observable((observable) => {
      this.socket.on("initialize games", (allGames: Array<MultiplayerGameData>) => {
        observable.next(allGames);
      });

      return() => {
        this.socket.disconnect();
      };
    });
  }

  public opponentJoined(): Observable<boolean> {
    return new Observable((observable) => {
        this.socket.on("playerJoined", (joined: boolean) => {
          observable.next(joined);
        });

        return() => {
          this.socket.disconnect();
        };
    });
  }

  public sendCrossword(crossword: Crossword, roomId: string): void {
    this.socket.emit("crossword sent", crossword, roomId);
  }

  public getCrossword(): Observable<Crossword> {
    return new Observable((observable) => {
      this.socket.on("crossword received", (crossword: Crossword) => {
        observable.next(crossword);
      });

      return() => {
        this.socket.disconnect();
      };
    });
  }

  public sendCorrectWord(word: Word): void {
    this.socket.emit("correct word sent", word);
  }

  public getCorrectWord(): Observable<Word> {
    return new Observable((observable) => {
      this.socket.on("correct word received", (word: Word) => {
        observable.next(word);
      });

      return() => {
        this.socket.disconnect();
      };
    });
  }

}
