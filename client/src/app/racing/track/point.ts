import {  Vector3 } from "three";

export class Point {

  public constructor(
    public isFirst: boolean,
    public pointCoordinates: Vector3,
    public isValid: boolean = true,
    public isLast: boolean = true
  ) {}

}
