import { MultiplayerGameData } from "../../../../../../common/crossword-multiplayer-data/multiplayer-game-data";
export const MAXIMUM_AMOUNT_OF_GAMES: number = 200;

export class LobbyController {

  private _gamesLookingForOpponent: Array<MultiplayerGameData>;

  public constructor() {
    this._gamesLookingForOpponent = new Array<MultiplayerGameData>();
  }

  public addNewGame( gameToAdd: MultiplayerGameData ): void {
    this._gamesLookingForOpponent.push( gameToAdd );
  }

  public getAllAvailableGames(): Array<MultiplayerGameData> {
    return this._gamesLookingForOpponent;
  }

  public removeGame(gameToRemove: MultiplayerGameData): void {
    this._gamesLookingForOpponent = this._gamesLookingForOpponent.filter((game: MultiplayerGameData) => {
      return game.players[0] !== gameToRemove.players[0];
    });
  }
}
