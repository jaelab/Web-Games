import { Injectable } from "@angular/core";
import { Player } from "../../../gameplay/player";
import { TimerService } from "../../../gameplay/timer-service/timer.service";

@Injectable()
export class SortTableService {

  public constructor(private _timerService: TimerService) { }

  public sortDataAsc(players: Player[]): void {
    players.sort((a: Player, b: Player) => {
      return this._timerService.compareTime(a.totalTime, b.totalTime);
    });
  }
}
