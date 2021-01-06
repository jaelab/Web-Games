import { Injectable } from "@angular/core";
import { Matrix4, Object3D, Mesh, Vector3 } from "three";

const CAR_DISPLACEMENT: number = 5;
const CAR_DISPLACEMENT_BACK: number = 15;

@Injectable()
export class StartingPositionCarService {

  private _carPositionsMatrix: Matrix4[];
  private _direction: Vector3;

  public constructor() {
    this._carPositionsMatrix = [];
  }

  // https://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array
  private shufflePosition(): void {
    let counter: number = this._carPositionsMatrix.length;

    // While there are elements in the array
    while (counter > 0) {
        const index: number = Math.floor(Math.random() * counter);
        counter--;

        const temp: Matrix4 = this._carPositionsMatrix[counter];
        this._carPositionsMatrix[counter] = this._carPositionsMatrix[index];
        this._carPositionsMatrix[index] = temp;
    }
  }

  private createPositionMatrix(startingPositionMatrix: Matrix4): void {
    const perpDirection: Vector3 = new Vector3().crossVectors(this._direction, new Vector3(0, 1, 0)).normalize();
    const sideTranslation: Matrix4 = new Matrix4()
    .makeTranslation(CAR_DISPLACEMENT * perpDirection.x, 0, CAR_DISPLACEMENT * perpDirection.z);
    const fowardTranslation: Matrix4 = new Matrix4()
    .makeTranslation(-CAR_DISPLACEMENT * this._direction.x, 0, -CAR_DISPLACEMENT * this._direction.z);
    const backTranslation: Matrix4 = new Matrix4()
    .makeTranslation(-CAR_DISPLACEMENT_BACK * this._direction.x, 0, -CAR_DISPLACEMENT_BACK * this._direction.z);

    const firstPosition: Matrix4 = new Matrix4().multiply(new Matrix4().getInverse(sideTranslation))
    .multiply(fowardTranslation).multiply(startingPositionMatrix.clone());

    const secondPosition: Matrix4 = new Matrix4().multiply(sideTranslation)
    .multiply(fowardTranslation).multiply(startingPositionMatrix.clone());

    const thirdPosition: Matrix4 = new Matrix4().multiply(sideTranslation)
    .multiply(backTranslation).multiply(startingPositionMatrix.clone());

    const fourthPosition: Matrix4 = new Matrix4().multiply(new Matrix4()
    .getInverse(sideTranslation)).multiply(backTranslation).multiply(startingPositionMatrix.clone());

    this._carPositionsMatrix.push(firstPosition, secondPosition, thirdPosition, fourthPosition);
  }

  private setStartingPosition(startingPositionMatrix: Matrix4): void {
    this.createPositionMatrix(startingPositionMatrix);
    this.shufflePosition();
  }

  private findDirection(children: Object3D[]): void {
    const curveMesh: Object3D[] = children.filter((mesh: Mesh) => {
      return mesh.geometry.type === "CircleGeometry";
    });

    this._direction = new Vector3().subVectors(curveMesh[0].position, curveMesh[1].position).normalize();
  }

  public placeCarStartingPosition(children: Object3D[]): Matrix4[] {
    this.findDirection(children);
    const startingPosition: Matrix4 = children.find((mesh: Mesh) => mesh.name === "start").matrix;
    this.setStartingPosition(startingPosition);

    return this._carPositionsMatrix;
  }
}
