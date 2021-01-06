
export class Time {

    public minutesDisplay: number;
    public secondsDisplay: number;
    public millisecondsDisplay: number;

    public constructor() {
        this.minutesDisplay = 0;
        this.secondsDisplay = 0;
        this.millisecondsDisplay = 0;
    }

    public set(time: Time): void {
        this.millisecondsDisplay = time.millisecondsDisplay;
        this.secondsDisplay = time.secondsDisplay;
        this.minutesDisplay = time.minutesDisplay;
    }
}
