import { Injectable } from "@angular/core";
import { Object3D } from "three";
import { ROAD_WIDTH, START_WIDTH } from "../../constants/trackConstant";
import { Car } from "../../car/car";
import { Track3dService } from "../../track/track3d.service";
import { Player } from "../player";
import { TimerService } from "../timer-service/timer.service";

const CAR_RADIUS: number = 2;
const TIMEOUT: number = 50;
const TWO: number = 2;
const CHECKPOINT_RADIUS: number = 50;

@Injectable()
export class LapCountingService {

  public constructor(public track3D: Track3dService, public timerService: TimerService) {
  }

  public startLapCounting( player: Player): void {
    if (!player.onStartingLine) {
      setTimeout(() => {
        this.startLapCounting(player);
      },         TIMEOUT);

      return;
    } else {
      player.completedLap++;
      if (player.completedLap > 1 && player.name === "Human Player") {
        this.timerService.resetLapTimer(player.lapTime);
      }
    }
    this.countCheckpoints(player);
  }

  private countCheckpoints(player: Player): void {
    if ( player.passedCheckpoint < this.track3D.checkpoints.length) {
      if (player.onCheckPoint !== player.passedCheckpoint) {
        setTimeout(() => {
          this.countCheckpoints(player);
        },         TIMEOUT);

        return;
      } else {
        player.passedCheckpoint++;
      }
      this.countCheckpoints(player);
    } else if ( player.passedCheckpoint === this.track3D.checkpoints.length) {
      player.passedCheckpoint = 0;
      this.startLapCounting(player);
    }
  }

  public verifyCheckpointIntersect(player: Player): void {
    for (let i: number = 0; i < this.track3D.checkpoints.length; i++) {
      if (this.intersectCheckPoint(player.car, this.track3D.checkpoints[i])) {
          player.onCheckPoint = i;
      }
    }
    player.onStartingLine = false;
    if (this.intersectStartingLine(player.car, this.track3D.getObjectByName("start"))) {
      player.onStartingLine = true;
    }
  }

  // https://stackoverflow.com/questions/401847/circle-rectangle-collision-detection-intersection
  public intersectStartingLine(car: Car, startingLine: Object3D): boolean {
    const circleDistanceX: number = Math.abs (car.carPosition.x - startingLine.position.x);
    const circleDistanceZ: number = Math.abs (car.carPosition.z - startingLine.position.z);

    if (circleDistanceZ > ROAD_WIDTH / TWO + CAR_RADIUS) { return false; }
    if (circleDistanceX > START_WIDTH / TWO + CAR_RADIUS) { return false; }

    if (circleDistanceZ <= (ROAD_WIDTH / TWO)) { return true; }
    if (circleDistanceX <= (START_WIDTH / TWO)) { return true; }

    const cornerDistance: number = Math.pow ((circleDistanceZ - ROAD_WIDTH / TWO), TWO) +
                                    Math.pow ((circleDistanceX - START_WIDTH / TWO), TWO);

    return (cornerDistance <= (Math.pow (CAR_RADIUS, TWO)));
  }

  public intersectCheckPoint(car: Car, checkPoint: Object3D): boolean {
    const distance: number = Math.pow((car.carPosition.x - checkPoint.position.x), TWO)
                            + Math.pow((car.carPosition.z - checkPoint.position.z), TWO);
    const radiusSum: number = CAR_RADIUS + CHECKPOINT_RADIUS;
    if (Math.sqrt(distance) <= radiusSum) {
      return true;
    }

    return false;
  }
}
