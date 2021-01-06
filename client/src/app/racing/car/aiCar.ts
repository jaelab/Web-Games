import { Car } from "./car";
import { Euler, Matrix4 } from "three";
import { PI_OVER_2 } from "../constants/car-constants";

const INITIAL_MODEL_ROTATION: Euler = new Euler(0, PI_OVER_2, 0);
const MAX_SPEED: number = 80;
const MIN_SPEED: number = 20;
const MAX_ACCELERATION: number = 0.022;
const MIN_ACCELERATION: number = 0.01;
const MIN_OFFSET: number = -20;
const MAX_OFFSET: number = 20;

export class AiCar extends Car {

  private _maxSpeed: number;
  private _acceleration: number;
  private _offset: number;
  public isOffsetSet: boolean;
  public isEngineStart: boolean;

  public constructor() {
    super();
    this.isOffsetSet = false;
    this._offset = 0;
    this.isEngineStart = false;
    this.generateRandomMaxSpeed();
    this.generateRandomAcceleration();
  }

  public get offset(): number {
    return this._offset;
  }

  public set offset(offset: number) {
    this._offset = offset;
    this.generateRandomOffset();
  }

  public get acceleration(): number {
    return this._acceleration;
  }

  public get maxSpeed(): number {
    return this._maxSpeed;
  }

  public async init(positionMatrix: Matrix4): Promise<void> {
    this.mesh = await this.load();
    this.mesh.name = "aiCar";
    this.mesh.setRotationFromEuler(INITIAL_MODEL_ROTATION);
    this.adjustPosition(positionMatrix);

    this.createCollisionBox();
    this.add(this.mesh);
  }

  private generateRandomMaxSpeed(): void {
    this._maxSpeed = Math.floor(Math.random() * (MAX_SPEED - MIN_SPEED + 1) + MIN_SPEED);
  }

  private generateRandomAcceleration(): void {
    this._acceleration = Math.random() * (MAX_ACCELERATION - MIN_ACCELERATION) + MIN_ACCELERATION;
  }

  private generateRandomOffset(): void {
    this._offset += Math.floor(Math.random() * (MAX_OFFSET - MIN_OFFSET + 1) + MIN_OFFSET);
  }
}
