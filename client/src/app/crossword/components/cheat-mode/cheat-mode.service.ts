import { Injectable } from "@angular/core";

@Injectable()
export class CheatModeService {

  public _isCheatMode: boolean = false;
  public _mode: string = "Mots à placer";

  public constructor() { }

  public changeMode(): void {
    this._isCheatMode = !this._isCheatMode;
    (this._isCheatMode) ? this._mode = "Définitions" : this._mode = "Mots à placer";
  }
}
