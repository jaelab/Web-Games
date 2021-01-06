import { Injectable } from "@angular/core";
import Stats = require("stats.js");
import { WebGLRenderer, Scene, Vector3 } from "three";
import { Car } from "../car/car";
import { AiCar } from "../car/aiCar";
import { Skybox } from "./skybox";
import { CamerasService } from "./cameras.service";
import { CarHandlerService } from "../car/car-handler.service";
import { Light } from "./light";
import { Track3dService } from "../track/track3d.service";
import { AudioService } from "../audio.service";
import { PlayerCar } from "../car/playerCar";
import { DetectorService } from "../car/detector.service";
import { PlayerService } from "../gameplay/player-service/player.service";
import { RACE_COMPLETED, MAX_LAP } from "../constants/race-constants";

@Injectable()
export class RenderService {

    private _container: HTMLDivElement;
    private _cars: Car[];
    private _skybox: Skybox;
    private _renderer: WebGLRenderer;
    private _scene: THREE.Scene;
    private _stats: Stats;
    private _lastDate: number;
    public lights: Light[];

    public get car(): Car {
        return this._cars[0];
    }

    public get cars(): Car[] {
        return this._cars;
    }

    public get scene(): Scene {
        return this._scene;
    }

    public get skybox(): Skybox {
        return this._skybox;
    }

    public constructor(private camera: CamerasService, public carHandlerService: CarHandlerService,
                       public track3D: Track3dService, public audio: AudioService,
                       private _detectorService: DetectorService, private playerService: PlayerService) {
        this._cars = [];
        this._cars.push(new PlayerCar(), new AiCar(), new AiCar(), new AiCar());

        this.lights = [];
        this.lights.push(new Light(), new Light(), new Light(), new Light());

        this._skybox = new Skybox();
        this.carHandlerService.car = this._cars[0];
    }

    public async initialize(_container: HTMLDivElement): Promise<void> {
        if (_container) {
            this._container = _container;
        }
        await this.create_Scene();
        this.init_Stats();
        this.startRenderingLoop();

        this.playerService.countdownService.scene = this._scene;
        this.playerService.countdownService.countdownMeshPosition = this.track3D.startingPositions[0];
    }

    private init_Stats(): void {
        this._stats = new Stats();
        this._stats.dom.style.position = "absolute";
        this._container.appendChild(this._stats.dom);
    }

    private update(): void {
        const timeSinceLastFrame: number = Date.now() - this._lastDate;
        for (const car of this._cars) {
            car.update(timeSinceLastFrame);
        }
        this._lastDate = Date.now();
        this.camera.adaptOrthographicCamera(this._cars[0].carPosition);

        this._detectorService.analyseDetection();
        this.updatePlayersStatus();
    }

    private async addTrack(): Promise<void> {
        await this.track3D.init();
        this._scene.add(this.track3D);
    }

    private async addCars(): Promise<void> {
        for (let i: number = 0; i < this._cars.length; i++) {
            await this._cars[i].init(this.track3D.startingPositions[i]);
            this._scene.add(this._cars[i]);
        }
    }

    private addLights(): void {
        this._scene.updateMatrixWorld(true);
        this.lights[0].initializeDayDirectionalLight();
        this._scene.add(this.lights[0].directionalLight);

        for (let i: number = 0; i < this.lights.length ; i++) {
            this.lights[i].attachSpotlightToVehicle(this._cars[i]);
            this.lights[i].turnOffSpotLights();
        }
    }

    private setupCameras(): void {
        this.camera.initializePerspectiveCamera(this.getAspectRatio(), this._cars[0].position, this._scene);
        this.camera.initalizeOrthographicCamera(this._cars[0].position, this._scene);
        this._scene.background = this._skybox.load();
    }

    private async create_Scene(): Promise<void> {
        this._scene = new Scene();

        await this.addTrack();
        await this.addCars();
        this.addLights();
        this.setupCameras();

        this._detectorService.setObjectsToIntersect(this.track3D.walls, this._cars);
    }

    private getAspectRatio(): number {
        return this._container.clientWidth / this._container.clientHeight;
    }

    private startRenderingLoop(): void {
        this._renderer = new WebGLRenderer();
        this._renderer.setPixelRatio(devicePixelRatio);
        this._renderer.setSize(this._container.clientWidth, this._container.clientHeight);

        this._lastDate = Date.now();
        this._container.appendChild(this._renderer.domElement);
        this.render();
    }

    private render(): void {
        requestAnimationFrame(() => this.render());
        this.update();
        this.camera.cameraRendering(this._cars[0], this._renderer, this._scene);
        this._stats.update();
    }

    public onResize(): void {
        this._renderer.setSize(this._container.clientWidth, this._container.clientHeight);
    }

    private updatePlayersStatus(): void {
        for (const player of this.playerService.players) {
            this.playerService.lapCountingService.verifyCheckpointIntersect(player);
            if (player.completedLap === MAX_LAP) {
                this.playerService.stopPlay(player, this.track3D.track);
            }
            if (player.completedLap === RACE_COMPLETED) {
                player.car.setSpeed(new Vector3 (0, 0, 0));
            }
        }
    }
}
