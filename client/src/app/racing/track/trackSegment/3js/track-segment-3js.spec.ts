import { TrackSegment3js } from "./track-segment-3js";
import { Vector3 } from "three";

let testSegment: TrackSegment3js;
// tslint:disable:no-magic-numbers
describe( "TrackSegment3js", () => {
  it("should create an instance", () => {
    const startPosition: Vector3 = new Vector3( 100, 0, 0 );
    const directionVector: Vector3 = new Vector3( 75, 75, 0);
    testSegment = new TrackSegment3js( directionVector, startPosition, true);
    expect( testSegment ).toBeTruthy();
  });

  it("should create return the correct road place center position", () => {
    testSegment.calculateCenterPosition();
    const expectedPos: Vector3 =  new Vector3( (75 / 2 + 100 ), (75 / 2), 0 );
    expect( testSegment.segmentCenterPosition.equals( expectedPos)).toBe( true );
  });
});
