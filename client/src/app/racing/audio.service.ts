import { Injectable } from "@angular/core";
import * as THREE from "three";
import { RACE_START, MASTER, ENGINE, PATH, ACCELERATION, BRAKE, TURNING_SOUND, WALL_HIT, CAR_HIT } from "./constants/audio-constants";

const enum Volumes {
  raceStart = 0.4,
  master = 0.1,
  engine = 0.85,
  acceleration = 1.5,
  brake = 0.15,
  turning = 0.1,
  wallHit = 0.5,
  carHit = 0.1
}

@Injectable()
export class AudioService {

  private _listener: THREE.AudioListener;
  private _masterSound: THREE.Audio;
  private _engineSound: THREE.Audio;
  private _accelerationSound: THREE.Audio;
  private _raceStart: THREE.Audio;
  private _brakeSound: THREE.Audio;
  private _turningSound: THREE.Audio;
  private _wallHit: THREE.Audio;
  private _carHit: THREE.Audio;
  private _isLooping: boolean;

  public constructor() {

    this._listener = new THREE.AudioListener();
    this._masterSound = new THREE.Audio(this._listener);
    this._accelerationSound = new THREE.Audio(this._listener);
    this._engineSound = new THREE.Audio(this._listener);
    this._raceStart = new THREE.Audio(this._listener);
    this._brakeSound = new THREE.Audio(this._listener);
    this._turningSound = new THREE.Audio(this._listener);
    this._wallHit = new THREE.Audio(this._listener);
    this._carHit = new THREE.Audio(this._listener);
    this._isLooping = true;

    this.soundsLoader(PATH + RACE_START, !this._isLooping, Volumes.raceStart, this._raceStart);
    this.soundsLoader(PATH + MASTER, this._isLooping, Volumes.master, this._masterSound);
    this.soundsLoader(PATH + ENGINE, this._isLooping, Volumes.engine, this._engineSound);
  }

  private soundsLoader(path: string, isLoop: boolean, volume: number, sound: THREE.Audio): void {
    const audioLoader: THREE.AudioLoader = new THREE.AudioLoader();

    audioLoader.load(path, (buffer: THREE.AudioBuffer) => {
      sound.setBuffer(buffer);
      sound.setLoop(isLoop);
      sound.setVolume(volume);
      sound.play();

    },               (xhr: {}) => { },
                     (err: {}) => { }
    );
  }

  public createAccelerationSound(): void {
    this.soundsLoader(PATH + ACCELERATION, !this._isLooping, Volumes.acceleration, this._accelerationSound);
  }

  public createBrakingSound(): void {
    this.soundsLoader(PATH + BRAKE, !this._isLooping, Volumes.brake, this._brakeSound);
  }

  public createTurningSound(): void {
    this.soundsLoader(PATH + TURNING_SOUND, !this._isLooping, Volumes.turning, this._turningSound);
  }

  public createWallHitSound(): void {
    this.soundsLoader(PATH + WALL_HIT, !this._isLooping, Volumes.wallHit, this._wallHit);
  }

  public createCarHitSound(): void {
    this.soundsLoader(PATH + CAR_HIT, !this._isLooping, Volumes.carHit, this._carHit);
  }

  public deactivateMasterSound(): void {
    this._masterSound.stop();
  }
}
