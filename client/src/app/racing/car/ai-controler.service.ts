import { Injectable } from "@angular/core";
import { Vector3 } from "three";
import { AiCar } from "./aiCar";

// tslint:disable-next-line:no-magic-numbers
const MAX_ROTATION: number = Math.PI / 50;
const MIN_SPEED: number = 5;
const ACCELERATION: number = 60;
const KP: number = 0.002;

@Injectable()
export class AiControlerService {

  private _lastSpeed: number;

  public constructor() {
    this._lastSpeed = 0;
  }

  private adjustCarSpeed(aiCar: AiCar, fowardDistance: number): void {
    let newSpeed: number = Math.sqrt(ACCELERATION * fowardDistance);

    (newSpeed < MIN_SPEED) ? newSpeed = MIN_SPEED : newSpeed = newSpeed;
    (newSpeed > aiCar.maxSpeed) ? newSpeed = aiCar.maxSpeed : newSpeed = newSpeed;

    const finalSpeed: number = Math.min(newSpeed - this._lastSpeed, aiCar.acceleration) + this._lastSpeed;
    aiCar.setSpeed(new Vector3(0, 0, -finalSpeed));
    this._lastSpeed = finalSpeed;
  }

  private adjustCarAngle(aiCar: AiCar, outPut: number): void {
    (outPut > MAX_ROTATION) ? outPut = MAX_ROTATION : outPut = outPut;
    (outPut < -MAX_ROTATION) ? outPut = -MAX_ROTATION : outPut = outPut;
    aiCar.mesh.rotateY(outPut);
  }

  private carPID(aiCar: AiCar, leftDistance: number, rightDistance: number): number {
    const error: number = leftDistance - rightDistance + aiCar.offset;

    return  KP * error;
  }

  public analysePosition(aiCar: AiCar, leftDistance: number, rightDistance: number, fowardDistance: number): void {
    if (aiCar.isEngineStart) {
      this.adjustCarSpeed(aiCar, fowardDistance);
      const outPut: number = this.carPID(aiCar, leftDistance, rightDistance);
      this.adjustCarAngle(aiCar, outPut);
    }
  }

}
