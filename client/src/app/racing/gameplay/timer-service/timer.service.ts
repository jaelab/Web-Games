import { Injectable } from "@angular/core";
import { Observable, Subscription } from "../../../../../node_modules/rxjs/Rx";
import { Time } from "../time";

const SIXTY_SECONDS: number = 60;
const TIME_PERIOD: number = 10;
const NINE: number = 9;

@Injectable()
export class TimerService {

  private ticks: number;
  private lapTicks: number;
  private subscription: Subscription;
  private lapSubscription: Subscription;

  public constructor() {
    this.subscription = new Subscription();
    this.lapSubscription = new Subscription();
    this.ticks = 0;
    this.lapTicks = 0;
  }

  public startTimer(time: Time, timeout: number): void {
    const timer: Observable<number> = Observable.timer(timeout, TIME_PERIOD);
    this.subscription = timer.subscribe( (nTicks: number) => {
      this.ticks = nTicks;
      this.convertTicksToTime(this.ticks, time);
      }
    );
  }

  public stopTimer(): void {
    this.subscription.unsubscribe();
  }

  public startLapTimer(time: Time, timeout: number): void {
    const lapTimer: Observable<number> = Observable.timer(timeout, TIME_PERIOD);
    this.lapSubscription = lapTimer.subscribe( (nTicks: number) => {
      this.lapTicks = nTicks;
      this.convertTicksToTime(this.lapTicks, time);
      }
    );
  }

  public stopLapTimer(): void {
    this.lapSubscription.unsubscribe();
  }

  public resetLapTimer(time: Time): void {
    this.stopLapTimer();
    this.startLapTimer(time, 0);
  }

  public compareTime(time1: Time, time2: Time): number {
    const time1String: string = this.pad(time1.minutesDisplay).toString() + ":" +
                                this.pad(time1.secondsDisplay).toString()  + ":" +
                                this.pad(time1.millisecondsDisplay).toString();
    const time2String: string = this.pad(time2.minutesDisplay).toString()  + ":" +
                                this.pad(time2.secondsDisplay).toString() + ":" +
                                this.pad(time2.millisecondsDisplay).toString();

    return (time1String < time2String ? -1 : 1);
  }

  private convertTicksToTime(ticks: number, time: Time): void {
    time.millisecondsDisplay = ticks % SIXTY_SECONDS;
    time.secondsDisplay = Math.floor(ticks / SIXTY_SECONDS) % SIXTY_SECONDS;
    time.minutesDisplay = Math.floor((ticks / SIXTY_SECONDS) / SIXTY_SECONDS);
  }

  // pour ajouter un 0 devant le temps s'il est plus petit que 9
  private pad(digit: number): string|number {
    return digit <= NINE ? "0" + digit : digit;
  }
}
