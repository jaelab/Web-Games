import { Injectable } from "@angular/core";
import { Player } from "../player";
import { TimerService } from "../timer-service/timer.service";
import { CountdownService, TIMEOUT } from "../countdown-service/countdown.service";
import { LapCountingService } from "../lapCounting-service/lap-counting.service";
import { SimulateResultService } from "../simulateResults-service/simulate-result.service";
import { NUMBER_OF_PLAYERS, RACE_COMPLETED, P } from "../../constants/race-constants";
import { Track } from "../../track/track";
import { AiCar } from "../../car/aiCar";

@Injectable()
export class PlayerService {

  public players: Player[];

  public constructor(public countdownService: CountdownService,
                     public timerService: TimerService,
                     public lapCountingService: LapCountingService,
                     private _simulateResultsService: SimulateResultService) {
    this.players = new Array(NUMBER_OF_PLAYERS);
    this.players[P.Human] = new Player("Human Player");
    for (let i: number = 1; i < NUMBER_OF_PLAYERS; i++) {
      this.players[i] = new Player("AI Player" + i);
    }
  }

  private startAi(): void {
    let aiCar: AiCar;
    for (let i: number = 1; i < this.players.length; i++) {
      aiCar = this.players[i].car as AiCar;
      aiCar.isEngineStart = true;
    }
  }

  public startPlay(): void {
    this.countdownService.startCountdown();
    this.timerService.startTimer(this.players[P.Human].totalTime, TIMEOUT);
    this.timerService.startLapTimer(this.players[P.Human].lapTime, TIMEOUT);
    setTimeout(() => {this.startAi(); }, TIMEOUT);

    for (const player of this.players) {
      this.lapCountingService.startLapCounting(player);
    }
  }

  public stopPlay(player: Player, track: Track): void {
    if (player.name === "Human Player") {
      this.timerService.stopTimer();
      this.timerService.stopLapTimer();
      this._simulateResultsService.simulateResults(this.players, track);
    } else {
      player.totalTime.set(this.players[P.Human].totalTime);
      player.completedLap = RACE_COMPLETED;
    }
  }

}
