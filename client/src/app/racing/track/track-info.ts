import { Time } from "../gameplay/time";
const DEFAULT_TIME: number = 10;
export class BestTime {
  public player: string;
  public time: Time;

  public constructor(player: string, time: Time) {
    this.player = player;
    this.time = time;
  }
}

const MAX_BEST_TIME: number = 5;

export class TrackInfo {
  public description: string;
  public noTimesPlayed: number;
  public bestTime: BestTime[];

  public constructor() {
    this.description = "no description";
    this.noTimesPlayed = 0;
    this.bestTime = new Array<BestTime>();
    for (let i: number = 0; i < MAX_BEST_TIME; i++) {
      const time: Time = new Time();
      time.minutesDisplay = DEFAULT_TIME;
      this.bestTime.push(new BestTime("human player" + i, time));
    }
  }
}
