// tslint:disable:no-magic-numbers
import { Vector3 } from "three";
import { TrackSegment } from "./track-segment";

describe("get _segmentLength", () => {
  it("should return correct segments length", () => {

    const trackSegment1: TrackSegment = new TrackSegment(new Vector3(0, 0, 0), new Vector3(10, 0, 0));
    const trackSegment2: TrackSegment = new TrackSegment(new Vector3(0, 0, 0), new Vector3(2, 5, 0));
    const trackSegment3: TrackSegment = new TrackSegment(new Vector3(10, 0, 0), new Vector3(10, 10, 0));
    const result1: number = Math.sqrt(10 * 10 + 0);
    const result2: number = Math.sqrt(2 * 2 + 5 * 5);

    expect(trackSegment1.segmentLength === result1 &&
      trackSegment2.segmentLength === result2 &&
       trackSegment3.segmentLength === result1 ).toBe(true);
  });
});

describe("get _directionVector", () => {
  it("should return correct direction Vector", () => {

    const expectedDirVect: Vector3 = new Vector3(0, 10, 0);
    const trackSegment3: TrackSegment = new TrackSegment(new Vector3(10, 0, 0), new Vector3(10, 10, 0));
    expect(trackSegment3.directionVector.equals(expectedDirVect)).toBe(true);
  });
});

describe("modifySegmentData", () => {
  it("should change segment starting and ending points and call a method to recalculate parameters", () => {

    const newStart: Vector3 = new Vector3(0, 8, 0);
    const newEnd: Vector3 = new Vector3(0, 0, 0);
    const expectedDirVect: Vector3 = new Vector3(0, -8, 0);
    const expectedNewLength: number = 8;
    const trackSegment1: TrackSegment = new TrackSegment(new Vector3(0, 0, 0), new Vector3(10, 0, 0));

    trackSegment1.modifySegmentData(newStart, newEnd);
    expect(trackSegment1.directionVector.equals(expectedDirVect) &&
      trackSegment1.segmentLength === expectedNewLength).toBe(true);
  });
});
