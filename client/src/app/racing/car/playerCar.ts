import { Car } from "./car";
import { Euler, Matrix4 } from "three";
import { PI_OVER_2 } from "../constants/car-constants";

const INITIAL_MODEL_ROTATION: Euler = new Euler(0, PI_OVER_2, 0);

export class PlayerCar extends Car {

  public constructor() {
    super();
  }

  public async init(positionMatrix: Matrix4): Promise<void> {
    this.mesh = await this.load();
    this.mesh.name = "playerCar";
    this.mesh.setRotationFromEuler(INITIAL_MODEL_ROTATION);
    this.adjustPosition(positionMatrix);

    this.createCollisionBox();
    this.add(this.mesh);
  }
}
