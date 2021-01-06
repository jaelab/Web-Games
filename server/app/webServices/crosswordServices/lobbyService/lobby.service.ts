import { injectable } from "inversify";
import { LobbyController } from "./lobby-processing/lobby-controller";
import * as io from "socket.io";
import { MultiplayerGameData } from "../../../../../common/crossword-multiplayer-data/multiplayer-game-data";
import { Crossword } from "../../../../../common/communication/crossword";
import { Word } from "../../../../../common/communication/word";

@injectable()
export class LobbyService {

  public io: SocketIO.Server;
  private lobbyManager: LobbyController;

  constructor() {
    this.io = io();
    this.lobbyManager = new LobbyController;
    this.sendGamesOnConnect();
    this.processNewGameRequest();
    this.joinGameRequest();
    this.sendCrossword();
    this.sendCorrectWord();
  }

  private sendGamesOnConnect(): void {
    this.io.on("connection", (socket: SocketIO.Socket) => {
      socket.emit("initialize games", this.lobbyManager.getAllAvailableGames());
    });
  }

  private processNewGameRequest(): void {
    this.io.on("connection", (socket: SocketIO.Socket) => {
      socket.on("new game", (newGameToProcess: MultiplayerGameData) => {
        this.lobbyManager.addNewGame(newGameToProcess);
        this.io.sockets.emit("initialize games", this.lobbyManager.getAllAvailableGames());
        socket.join(newGameToProcess.id);
      });
    });
  }

  private joinGameRequest(): void {
    this.io.on("connection", (socket: SocketIO.Socket) => {
      socket.on("join game", (gameToJoin: MultiplayerGameData) => {
        socket.join(gameToJoin.id);
        socket.to(gameToJoin.id).emit("playerJoined", true);

        this.lobbyManager.removeGame(gameToJoin);
        this.io.sockets.emit("initialize games", this.lobbyManager.getAllAvailableGames());
      });
    });
  }

  private sendCrossword(): void {
    this.io.on("connection", (socket: SocketIO.Socket) => {
      socket.on("crossword sent", (crossword: Crossword, id: string) => {
        socket.to(id).emit("crossword received", crossword);
      });
    });
  }

  private sendCorrectWord(): void {
    this.io.on("connection", (socket: SocketIO.Socket) => {
      socket.on("correct word sent", (word: Word) => {
        const keys: string[] = Object.keys(socket.rooms);
        socket.to(socket.rooms[keys[1]]).emit("correct word received", word);
      });
    });
  }
}
