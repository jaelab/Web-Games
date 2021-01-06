import { Vector3 } from "three";

export class TrackSegment {

  public segmentLength: number;
  public isFinalSegment: boolean;

  public constructor(
    public startingPoint: Vector3,
    public endingPoint: Vector3,
    public directionVector: Vector3 = new Vector3,
    public isValid: boolean = true ) {
      this.calculateSegmentParameters();
  }

  private calculateDirectionVector(): void {
    this.directionVector.subVectors( this.endingPoint, this.startingPoint );
  }

  public modifySegmentData(startPoint: Vector3, endPoint: Vector3): void {
    this.startingPoint = startPoint;
    this.endingPoint = endPoint;
    this.calculateSegmentParameters();
  }

  private calculateSegmentParameters(): void {
    this.calculateDirectionVector();
    this.calculateSegmentLength();
  }

  private calculateSegmentLength(): void {
    // tslint:disable-next-line:no-magic-numbers ,justification: je ne vais pas declarer une constante pour pow2
    this.segmentLength = Math.sqrt(Math.pow(this.directionVector.x, 2) + Math.pow(this.directionVector.y, 2));
  }

}
