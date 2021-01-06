import { Injectable } from "@angular/core";
import { Car } from "./car";
import { Vector3 } from "three";
import { AudioService } from "../audio.service";

const KENITIC_ENERGY_RATIO: number = 0.1;
const FRAME_TO_UPDATE: number = 400;
const MIN_SPEED_LIMIT: number = 7;

@Injectable()
export class CarCollisionService {

  public constructor(private _audioService: AudioService) { }

  private calculateFinalSpeed(car1: Car, car2: Car): Vector3 {
    const speedDiff: Vector3 = new Vector3().subVectors(car1.speed.clone(), car2.speed.clone());
    const positionDiff: Vector3 = new Vector3().subVectors(car1.carPosition.clone(), car2.carPosition.clone());
    const scalar: number = (speedDiff.dot(positionDiff)) * (1 / positionDiff.lengthSq());

    return new Vector3().subVectors(car1.speed.clone(), positionDiff.multiplyScalar(scalar));
  }

  public collideCars(car1: Car, car2: Car): void {
    const finalSpeed1: Vector3 = this.calculateFinalSpeed(car1, car2).negate();
    const finalSpeed2: Vector3 = this.calculateFinalSpeed(car2, car1).negate();

    car1.setSpeed(finalSpeed1);
    car2.setSpeed(finalSpeed2);
    this._audioService.createCarHitSound();
  }

  private handleLowSpeed(car: Car): void {
    if (car.speed.length() < MIN_SPEED_LIMIT) {
      const newMinSpeed: Vector3 = car.speed.setLength(MIN_SPEED_LIMIT);
      car.setSpeed(newMinSpeed);
    }
  }

  private updateNewSpeed(car: Car): void {
    car.setSpeed(car.speed.negate());
    car.update(FRAME_TO_UPDATE);
    const newSpeed: Vector3 = car.speed.setLength(car.speed.length() * KENITIC_ENERGY_RATIO);
    car.setSpeed(newSpeed);
  }

  public collideWithWall(car: Car): void {
    this.handleLowSpeed(car);
    this.updateNewSpeed(car);
    this._audioService.createWallHitSound();
  }
}
