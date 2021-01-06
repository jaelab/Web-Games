import { Component, Input } from "@angular/core";
import { Track } from "../../track/track";
import { Player } from "../../gameplay/player";
import { TimerService } from "../../gameplay/timer-service/timer.service";
import { HttpTracksService } from "../../httpTrackService/http-tracks.service";
import { BestTime } from "../../track/track-info";

const LAST_POSITION: number = 4;
@Component({
  selector: "app-best-time",
  templateUrl: "./best-time.component.html",
  styleUrls: ["./best-time.component.css"]
})
export class BestTimeComponent {

  @Input() public track: Track;
  @Input() public players: Player[];
  public displayedColumns: string[] = ["player", "time"];
  private _newRecordPlayerName: string;
  private _alreadyEnteredName: boolean;

  public constructor(private _timerService: TimerService,
                     private _httpTrackService: HttpTracksService) {
    this._newRecordPlayerName = "Human Player";
    this._alreadyEnteredName = false;
  }

  private bestTimeSort(bestTime1: BestTime, bestTime2: BestTime): number {
    if (bestTime1.time.minutesDisplay < bestTime2.time.minutesDisplay) {
      return -1;
    } else if (bestTime1.time.minutesDisplay === bestTime2.time.minutesDisplay
      && bestTime1.time.secondsDisplay < bestTime2.time.secondsDisplay) {
      return -1;
    } else if (bestTime1.time.secondsDisplay === bestTime2.time.secondsDisplay
      && bestTime1.time.millisecondsDisplay < bestTime2.time.millisecondsDisplay) {
      return -1;
    }

    return 1;
  }

  public async onSubmit(): Promise<void> {
    if (!this._alreadyEnteredName) {
      for (const bestTime of this.track.trackInfo.bestTime) {
        if (this._timerService.compareTime(this.players[0].totalTime, bestTime.time) === -1 ) {
          this.track.trackInfo.bestTime[LAST_POSITION].player = this._newRecordPlayerName;
          this.track.trackInfo.bestTime[LAST_POSITION].time.millisecondsDisplay = this.players[0].totalTime.millisecondsDisplay;
          this.track.trackInfo.bestTime[LAST_POSITION].time.secondsDisplay = this.players[0].totalTime.secondsDisplay;
          this.track.trackInfo.bestTime[LAST_POSITION].time.minutesDisplay = this.players[0].totalTime.minutesDisplay;
          break;
        }
      }

      this.track.trackInfo.bestTime = this.track.trackInfo.bestTime.sort(this.bestTimeSort);
      this._httpTrackService.postTrackOnServer(this.track).subscribe(() => {
      });
      this._alreadyEnteredName = true;
    }
  }

  public meritLeaveName(): boolean {
    if (this.playerWin() && this.amongBestTimes()) {
      return true;
    }

    return false;
  }

  private playerWin(): boolean {
    if (this.players[0].name === "Human Player") {
      return true;
    }

    return false;
  }

  private amongBestTimes(): boolean {
    for (const bestTime of this.track.trackInfo.bestTime) {
      if (this._timerService.compareTime(this.players[0].totalTime, bestTime.time) === -1 ) {
        return true;
      }
    }

    return false;
  }

}
