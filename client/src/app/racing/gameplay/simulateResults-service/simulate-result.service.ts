import { Injectable } from "@angular/core";
import { Player } from "../player";
import { Track } from "../../track/track";
import { RACE_COMPLETED, P } from "../../constants/race-constants";
import { AiCar } from "../../car/aiCar";
import { Vector3 } from "three";

const MAX_LAP: number = 3;
const RATIO: number = 3.6;
const SIXTY_SECONDS: number = 60;

@Injectable()
export class SimulateResultService {

  public simulateResults(players: Player[], track: Track): void {
    for (const player of players) {
      if (player.name !== "Human Player" && player.completedLap !== RACE_COMPLETED) {
        player.car.setSpeed(new Vector3 (0, 0, 0));
        player.totalTime.set(players[P.Human].totalTime);
        const aiCar: AiCar = player.car as AiCar;
        const extraSeconds: number = (this.getRemainingDistance(player, track) / aiCar.maxSpeed ) * RATIO;
        player.totalTime.secondsDisplay += Math.floor(extraSeconds);
        player.totalTime.minutesDisplay += Math.floor(player.totalTime.secondsDisplay / SIXTY_SECONDS);
        player.totalTime.secondsDisplay = player.totalTime.secondsDisplay % SIXTY_SECONDS;
      }
    }
  }

  private getRemainingDistance(player: Player, track: Track): number {
    let remainingDistance: number = 0;
    const passedSegment: number = player.passedCheckpoint;
    const totalSegment: number = track.segmentAmount();
    for (let i: number = passedSegment; i < totalSegment; i++) {
      remainingDistance += track.segments[i].segmentLength;
    }

    remainingDistance += (MAX_LAP - player.completedLap) * track.trackLength;

    return remainingDistance;
  }
}
