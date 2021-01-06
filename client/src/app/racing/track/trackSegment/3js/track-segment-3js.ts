import { Mesh , MeshBasicMaterial, PlaneGeometry, Vector3, Texture, TextureLoader } from "three";

const ROAD_WIDTH: number = 30;
const VALID_SEGMENT_COLOR: number = 0x551A8B;
const INVALID_SEGMENT_COLOR: number = 0xFF0000;

export class TrackSegment3js {

  public roadSegment: Mesh;
  public directionVector: Vector3;
  public segmentStartPosition: Vector3;
  public segmentCenterPosition: Vector3;
  public isValid: boolean;
  public roadTexture: Texture;

  public constructor( directionVector: Vector3, startPosition: Vector3, isValidSegment: boolean ) {
    this.directionVector = directionVector;
    this.segmentStartPosition = startPosition;
    this.calculateCenterPosition();
    this.isValid = isValidSegment;
    this.roadSegment = this.generateRoadSegment();
    this.roadTexture = new TextureLoader().load("../assets/track/asphalt.jpg");
  }

  private generateRoadSegment(): Mesh {
    const vectorToCaluate: Vector3 = new Vector3(this.directionVector.x, this.directionVector.y, this.directionVector.z);
    const segmentColor: number = this.isValid ? VALID_SEGMENT_COLOR : INVALID_SEGMENT_COLOR;
    this.roadSegment = new Mesh( new PlaneGeometry( ROAD_WIDTH, vectorToCaluate.length() ),
                                 new MeshBasicMaterial({color: segmentColor}) );
    this.roadSegment.position.set(this.segmentCenterPosition.x, this.segmentCenterPosition.y, 0);
    this.roadSegment.rotateOnAxis( new Vector3(0, 0, 1), this.calculateSegmentAngle() );

    return this.roadSegment;
  }

  public calculateCenterPosition(): void {
    // tslint:disable-next-line:no-magic-numbers
    this.segmentCenterPosition = new Vector3(this.directionVector.x / 2, this.directionVector.y / 2, 0 );
    this.segmentCenterPosition.add( this.segmentStartPosition );
  }

  public calculateSegmentAngle(): number {
    const vectorToCaluate: Vector3 = new Vector3(this.directionVector.x, this.directionVector.y, this.directionVector.z);

    return vectorToCaluate.x < 0 ? vectorToCaluate.angleTo( new Vector3(0, 1, 0)) :
      - vectorToCaluate.angleTo( new Vector3(0, 1, 0));
  }
}
