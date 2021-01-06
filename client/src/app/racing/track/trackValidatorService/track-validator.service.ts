import { Vector3 } from "three";
import { Track } from "../track";
import { TrackSegment } from "../trackSegment/track-segment";

const MAX_DEGREE: number = 2.35619449; // 135 degre en radian
const MIN_SEGMENT_LENGTH: number = 90;

export class TrackValidatorService {

  private _theTrack: Track;

  public constructor () {
  }

  public attachTrackToValidate( trackToValidate: Track ): void {
    this._theTrack = trackToValidate;
  }

  public updateValidityParameters(): void {
    let isValidTrack: boolean = true;
    this.validateCurves();
    for (let i: number = 0 ; i < this._theTrack.segmentAmount() ; i++ ) {
      if (!this.validateSegment(i)) {
        isValidTrack = false;
      }
    }
    this._theTrack.isValid = isValidTrack;
  }

  // https://stackoverflow.com/questions/563198/how-do-you-detect-where-two-line-segments-intersect
  public verifySegmentIntersection( firstSegment: TrackSegment, secondSegment: TrackSegment ): boolean {
    const firstDirectorVector: Vector3 = firstSegment.directionVector;
    const secondDirectorVector: Vector3 = secondSegment.directionVector;
    const firstCrossSecond: number = firstDirectorVector.x * secondDirectorVector.y - firstDirectorVector.y * secondDirectorVector.x;

    if ( firstCrossSecond !== 0 ) {
      const secondSegStart: Vector3 = secondSegment.startingPoint;
      const firstSegStart: Vector3 = firstSegment.startingPoint;

      const secondMinusFirst: Vector3 = new Vector3(secondSegStart.x - firstSegStart.x, secondSegStart.y - firstSegStart.y, 0);

      // tslint:disable-next-line:max-line-length
      const scalarFirst: number = (secondMinusFirst.x * secondDirectorVector.y - secondMinusFirst.y * secondDirectorVector.x)  / firstCrossSecond;
      // tslint:disable-next-line:max-line-length
      const scalarSecond: number = (secondMinusFirst.x * firstDirectorVector.y - secondMinusFirst.y * firstDirectorVector.x) / firstCrossSecond;

      if (scalarSecond < 1 && scalarSecond > 0 && scalarFirst < 1 && scalarFirst > 0 ) {
        return true;
      }
    }

    return false;
  }

  public checkTrackForIntersection( index: number ): boolean {
    for (let i: number = 0; i < this._theTrack.segments.length ; i++) {
      if (i !== index && this.verifySegmentIntersection(this._theTrack.segments[index],
                                                        this._theTrack.segments[i])) {
        return true;
      }
    }

    return false;
  }

  public validateSegment( index: number ): boolean {
    this._theTrack.segments[ index ].isValid = (!this.checkTrackForIntersection( index ) &&
     (this._theTrack.points[index].isValid && this.validLength(this._theTrack.segments[index].segmentLength) &&
         this._theTrack.points[(index + 1) % this._theTrack.points.length].isValid) );

    return this._theTrack.segments[ index ].isValid;
  }

  public validateCurves(): void {
    if (this._theTrack.segmentAmount() > 0) {
      this._theTrack.points[this._theTrack.points.length - 1].isValid = true;
      for (let i: number = 1; i < this._theTrack.points.length - 1  ; i++ ) {
        this._theTrack.points[i].isValid =  this.validAngle( this._theTrack.segments[i - 1],
                                                             this._theTrack.segments[i]);
      }
      if (this._theTrack.isCompleteLoop) {
        for (let i: number = this._theTrack.points.length - 1; i < this._theTrack.points.length + 1; i++) {
          this._theTrack.points[ i % this._theTrack.points.length].isValid =
            this.validAngle(this._theTrack.segments[ i - 1 ],
                            this._theTrack.segments[ i % this._theTrack.segmentAmount()]);
        }
      }
    }
  }

  public validAngle(segment1: TrackSegment, segment2: TrackSegment): boolean {
    return segment2.directionVector.angleTo(segment1.directionVector) < MAX_DEGREE;
  }

  public validLength(segmentLength: number): boolean {
    return segmentLength > MIN_SEGMENT_LENGTH;
  }
}
