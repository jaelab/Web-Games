import { Injectable } from "@angular/core";
import { Mesh, Vector3 } from "three";
import { TrackSegment } from "./trackSegment/track-segment";
import { Point } from "./point";

// tslint:disable-next-line:no-magic-numbers
const ROTATION_90_DEGREE: number = Math.PI / 2;

@Injectable()
export class Track3dLogicService {

  public constructor() { }

  // tslint:disable:no-magic-numbers  division par 2
  public adjustPlanePosition(plane3D: Mesh, trackSegment: TrackSegment): void {
    plane3D.position.x =  Math.abs(trackSegment.endingPoint.x - trackSegment.startingPoint.x) / 2;
    plane3D.position.x +=  Math.min(trackSegment.startingPoint.x, trackSegment.endingPoint.x);
    plane3D.position.z = Math.abs(trackSegment.endingPoint.y - trackSegment.startingPoint.y) / 2;
    plane3D.position.z +=  Math.min(trackSegment.startingPoint.y, trackSegment.endingPoint.y);
  }
  // tslint:enable:no-magic-numbers

  public adjustPlaneAngle(plane3D: Mesh, trackSegment: TrackSegment): void {
    plane3D.rotateX(ROTATION_90_DEGREE);

    let angle: number = trackSegment.directionVector.angleTo(new Vector3(0, 1, 0));
    if (trackSegment.directionVector.x >= 0) {
      angle *= -1;
    }
    plane3D.rotateZ(angle);
  }

  public adjustCirclePosition(circle3D: Mesh, point: Point): void {
    circle3D.rotateX(ROTATION_90_DEGREE);
    circle3D.position.x = point.pointCoordinates.x;
    circle3D.position.z = point.pointCoordinates.y;
  }

}
