import { PlayerData } from "./player-data";
import { Crossword } from "../communication/crossword";

export class MultiplayerGameData {

  public players: string[];
  public id: string;

  public constructor( public gameDifficulty: string, gameCreatorName: string ) {
    this.players = [];
    this.players.push( gameCreatorName, "" );
    this.id = gameCreatorName;
  }
}
