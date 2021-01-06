import { Injectable } from "@angular/core";
import { Object3D, Vector3, Mesh, PlaneGeometry, Intersection } from "three";

const mod: Function = (n: number, m: number) => {
  return ((n % m) + m) % m;
};

@Injectable()
export class Wall3dLogicService {

  private _track3D: Object3D;

  public constructor() { }

  public set track3D(track3D: Object3D) {
    this._track3D = track3D;
  }

  private findCurvedChildPosition(index: number): Vector3 {
    return this._track3D.children.find((meshChildren: Mesh) => {
      return meshChildren.name === "curve" + index.toString();
    }).position;
  }

  // tslint:disable:no-magic-numbers  division par 2
  private calculateCurvePosition(index: number, isNextPosition: boolean): Vector3 {
    const numberOfCurve: number = (this._track3D.children.length - 2) / 2;
    const nextIndex: number = mod(index + 1, numberOfCurve);
    const prevIndex: number = mod(index - 1, numberOfCurve);

    return (isNextPosition) ? this.findCurvedChildPosition(nextIndex) : this.findCurvedChildPosition(prevIndex);
  }
  // tslint:enable:no-magic-numbers

  private angleBetween(vector1: Vector3, vector2: Vector3): number {
    return Math.atan2(vector2.z, vector2.x) - Math.atan2(vector1.z, vector1.x);
  }

  // tslint:disable:no-magic-numbers  division par 2
  public calculateThetaStart(curvedWall: Mesh, index: number): number {
    const prevCurvePosition: Vector3 = this.calculateCurvePosition(index, false);
    const nextCurvePosition: Vector3 = this.calculateCurvePosition(index, true);

    const directionPrev: Vector3 = new Vector3().subVectors(prevCurvePosition, curvedWall.position);
    const directionNext: Vector3 = new Vector3().subVectors(nextCurvePosition, curvedWall.position);

    const angle: number = this.angleBetween(directionPrev, directionNext) / 2;
    let directionHalfAngleSplit: Vector3 = directionNext.clone().applyAxisAngle(new Vector3(0, 1, 0), angle);
    if (directionHalfAngleSplit.angleTo(directionPrev) >= Math.PI / 2) {
      directionHalfAngleSplit = directionHalfAngleSplit.negate();
    }

    return this.angleBetween(directionHalfAngleSplit, new Vector3(0, 0, 1)) + Math.PI;
  }
  // tslint:enable:no-magic-numbers

  public calculateThetaLenght(curvedWall: Mesh, index: number): number {
    const prevCurvePosition: Vector3 = this.calculateCurvePosition(index, false);
    const nextCurvePosition: Vector3 = this.calculateCurvePosition(index, true);

    const directionPrev: Vector3 = new Vector3().subVectors(prevCurvePosition, curvedWall.position);
    const directionNext: Vector3 = new Vector3().subVectors(curvedWall.position, nextCurvePosition);

    return -directionPrev.angleTo(directionNext);
  }

  // tslint:disable:no-magic-numbers  division par 2
  public adjustWallDimension(wall: Mesh, fowardIntersections: Intersection[], backwardIntersections: Intersection[]): void {
    const wallGeometry: PlaneGeometry = wall.geometry as PlaneGeometry;
    const initialLenght: number = wallGeometry.parameters.height;

    let fowardLength: number;
    let backwardLength: number;
    (fowardIntersections.length === 0) ? fowardLength = initialLenght / 2 : fowardLength = fowardIntersections[0].distance;
    (backwardIntersections.length === 0) ? backwardLength = initialLenght / 2 : backwardLength = backwardIntersections[0].distance;

    const newLenght: number = fowardLength + backwardLength;
    const newMiddle: number = (fowardLength + backwardLength) / 2;
    wall.scale.setY(newLenght / initialLenght);
    wall.translateY(newMiddle - backwardLength);
  }
  // tslint:enable:no-magic-numbers
}
