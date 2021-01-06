import * as THREE from "three";
import {
  COLOR, INTENSITY_DAY, INTENSITY_NIGHT, DIRECTIONAL_X, DIRECTIONAL_Y, DIRECTIONAL_Z, SPOTLIGHT_LEFT_X, SPOTLIGHT_RIGHT_X,
  COLOR_NIGHT, SPOTLIGHT_Y, SPOTLIGHT_Z, SPOTLIGHT_TARGET_X, SPOTLIGHT_TARGET_Y, SPOTLIGHT_ANGLE, SPOTLIGHT_DISTANCE,
  SPOTLIGHT_TARGET_Z, SPOTLIGHT_INTENSITY, SPOTLIGHT_PENUMBRA
} from "../constants/light-constants";
import { Car } from "../car/car";

export class Light {
  public directionalLight: THREE.DirectionalLight;
  private _rightSpotLight: THREE.SpotLight;
  private _leftSpotLight: THREE.SpotLight;
  private _isDayMode: Boolean = true;

  public initializeDayDirectionalLight(): void {
    this.directionalLight = new THREE.DirectionalLight(COLOR, INTENSITY_DAY);
    this.directionalLight.position.set(DIRECTIONAL_X, DIRECTIONAL_Y, DIRECTIONAL_Z);
    this._isDayMode = true;
  }

  public initializeNightDirectionalLight(): void {
    this.directionalLight = new THREE.DirectionalLight(COLOR_NIGHT, INTENSITY_NIGHT);
    this._isDayMode = false;
  }

  public switchDayNightDirectionalLights(): void {
    if (this._isDayMode) {
      this.initializeNightDirectionalLight();
    } else {
      this.initializeDayDirectionalLight();
    }
  }

  public initializeSpotLights(): void {
    this._rightSpotLight = new THREE.SpotLight(COLOR, SPOTLIGHT_INTENSITY, SPOTLIGHT_DISTANCE, SPOTLIGHT_ANGLE, SPOTLIGHT_PENUMBRA);
    this._leftSpotLight = new THREE.SpotLight(COLOR, SPOTLIGHT_INTENSITY, SPOTLIGHT_DISTANCE, SPOTLIGHT_ANGLE, SPOTLIGHT_PENUMBRA);
  }
  public turnOffSpotLights(): void {
    this._leftSpotLight.power = 0;
    this._rightSpotLight.power = 0;
  }

  public attachSpotlightToVehicle(car: Car): void {
    this.initializeSpotLights();

    const lightTarget: THREE.Object3D = new THREE.Object3D();
    car.mesh.add(lightTarget);
    lightTarget.position.set(SPOTLIGHT_TARGET_X, SPOTLIGHT_TARGET_Y, SPOTLIGHT_TARGET_Z);
    car.mesh.add(this._leftSpotLight);
    car.mesh.add(this._rightSpotLight);

    this._leftSpotLight.position.set(SPOTLIGHT_LEFT_X, SPOTLIGHT_Y, SPOTLIGHT_Z);
    this._rightSpotLight.position.set(SPOTLIGHT_RIGHT_X, SPOTLIGHT_Y, SPOTLIGHT_Z);
    this._leftSpotLight.target = lightTarget;
    this._rightSpotLight.target = lightTarget;
  }

  public switchDayNightSpotLights(): void {
    if (this._isDayMode) {
      this.turnOffSpotLights();

    } else {
      this._leftSpotLight.intensity = SPOTLIGHT_INTENSITY;
      this._rightSpotLight.intensity = SPOTLIGHT_INTENSITY;
    }
  }
}
