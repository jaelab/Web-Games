import { TrackSegment } from "./trackSegment/track-segment";
import { Point } from "./point";
import { Vector3 } from "three";
import { TrackInfo } from "./track-info";

export class Track {

  public trackLength: number;
  public points: Point[];
  public segments: TrackSegment[];
  public isCompleteLoop: boolean;
  public isValid: boolean;
  public name: string;
  public trackInfo: TrackInfo;

  public constructor(track?: Track) {
    this.initialiseTrack(track);
  }

  private initialiseTrack(track?: Track): void {
    if (track !== undefined) {
      this.trackLength = track.trackLength;
      this.points = track.points;
      this.segments = new Array<TrackSegment>();
      this.isCompleteLoop = track.isCompleteLoop;
      this.isValid = track.isValid;
      this.name = track.name;
      this.trackInfo = track.trackInfo;

      for (const segment of track.segments) {
        this.addNextSegmentToTrackData( segment.startingPoint, segment.endingPoint );
      }

    } else {
      this.trackLength = 0;
      this.points = new Array<Point>();
      this.segments = new Array<TrackSegment>();
      this.isCompleteLoop = false;
      this.isValid = false;
      this.name = "no name";
      this.trackInfo = new TrackInfo();
    }
  }

  public segmentAmount(): number {
    return this.segments.length;
  }

  public lastPointInArray(): Point {
    if (this.points.length >= 1) {
      return this.points[ this.points.length - 1 ];
    }

    return undefined;
  }

  public updateName(newName: string): void {
    this.name = newName;
  }

  public updateDescription(newDescription: string): void {
    this.trackInfo.description = newDescription;
  }

  public isReadyToSave(): boolean {
    return (this.name.length !== 0) && this.isValid && this.isCompleteLoop;
  }

  public recalculateTrackLength(): void {
    this.trackLength = 0;
    for (const i of this.segments) {
      this.trackLength += Math.round(i.segmentLength);
    }
  }

  public removeLastPointInData(): void {
    this.points.pop();
  }

  public addNextPointToTrackData( nextPointPosition: Vector3 ): void {
    this.points.push(new Point( this.points.length === 0, nextPointPosition ));
    if (this.points.length > 1) {
      // tslint:disable-next-line:no-magic-numbers justification: index... rien de magique
      this.points[this.points.length - 2 ].isLast = false; }
  }

  public addNextSegmentToTrackData( segmentStartPos: Vector3, segmentEndPos: Vector3 ): void {
    const newSegment: TrackSegment = new TrackSegment( segmentStartPos, segmentEndPos );
    this.recalculateTrackLength();
    this.segments.push( newSegment );
  }

  public removeLastSegment(): void {
    this.segments.pop();
    this.lastPointInArray().isLast = true;
    this.recalculateTrackLength();
  }

}
