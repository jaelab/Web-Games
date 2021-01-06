import { Car } from "../car/car";
import { Time } from "./time";

export class Player {

    public name: string;
    public car: Car;
    public lapTime: Time;
    public totalTime: Time;
    public completedLap: number;
    public onCheckPoint: number;
    public onStartingLine: boolean;
    public passedCheckpoint: number;

    public constructor (playerName: string) {
        this.name = playerName;
        this.car = null;
        this.lapTime = new Time;
        this.totalTime = new Time;
        this.completedLap = 0;
        this.onCheckPoint = -1;
        this.onStartingLine = false;
        this.passedCheckpoint = 0;
    }
}
