import { Injectable } from "@angular/core";
import {Car} from "./car";
import { AudioService } from "../audio.service";

const ACCELERATE_KEYCODE: number = 87;  // w
const LEFT_KEYCODE: number = 65;        // a
const BRAKE_KEYCODE: number = 83;       // s
const RIGHT_KEYCODE: number = 68;       // d

@Injectable()
export class CarHandlerService {
private _car: Car;

public constructor(private _audio: AudioService) {}
public set car(car: Car) {
      this._car = car;
    }

public handleKeyDown(event: KeyboardEvent): void {
    switch (event.keyCode) {
        case ACCELERATE_KEYCODE:
            this._car.isAcceleratorPressed = true;
            this._audio.createAccelerationSound();
            break;
        case LEFT_KEYCODE:
            this._car.steerLeft();
            this._audio.createTurningSound();
            break;
        case RIGHT_KEYCODE:
            this._car.steerRight();
            this._audio.createTurningSound();
            break;
        case BRAKE_KEYCODE:
            this._car.brake();
            this._audio.createBrakingSound();
            break;
        default:
            break;
    }
}
public handleKeyUp(event: KeyboardEvent): void {
        switch (event.keyCode) {
            case ACCELERATE_KEYCODE:
                this._car.isAcceleratorPressed = false;
                break;
            case LEFT_KEYCODE:
            case RIGHT_KEYCODE:
                this._car.releaseSteering();
                break;
            case BRAKE_KEYCODE:
                this._car.releaseBrakes();
                break;
            default:
                break;
        }
    }
}
