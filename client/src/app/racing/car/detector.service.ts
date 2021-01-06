import { Injectable } from "@angular/core";
import { Raycaster, Vector3, Object3D, Intersection } from "three";
import { Car } from "./car";
import { CarCollisionService } from "./car-collision.service";
import { AiControlerService } from "./ai-controler.service";
import { DetectorIntersectionService } from "./detector-intersection.service";
import { AiCar } from "./aiCar";

// tslint:disable:no-magic-numbers
const ROTATION: number = Math.PI / 4;
enum rPosition {foward = 0, fDiagLeft = 1, left = 2, right = 6, fDiagRight = 7}
// tslint:enable:no-magic-numbers

@Injectable()
export class DetectorService {

  private _casters: Raycaster[];
  private _walls: Object3D;
  private _cars: Car[];

  public constructor(private _carCollisionService: CarCollisionService,
                     private _aiControllerService: AiControlerService,
                     private _detectorIntersectionService: DetectorIntersectionService) {
    this._casters = [];
    this._casters.push(
      new Raycaster(new Vector3, new Vector3(0, 1, 0)), new Raycaster(new Vector3, new Vector3(-1, 1, 0)),
      new Raycaster(new Vector3, new Vector3(-1, 0, 0)), new Raycaster(new Vector3, new Vector3(-1, -1, 0)),
      new Raycaster(new Vector3, new Vector3(0, -1, 0)), new Raycaster(new Vector3, new Vector3(1, -1, 0)),
      new Raycaster(new Vector3, new Vector3(1, 0, 0)), new Raycaster(new Vector3, new Vector3(1, 1, 0))
    );
  }

  public setObjectsToIntersect(walls: Object3D, cars: Car[]): void {
    this._walls = walls;
    this._cars = cars;
  }

  private updateDetectorsPosition(car: Car): void {
    let rotation: number = 0;
    this._casters.forEach((caster: Raycaster) => {
      caster.set(car.carPosition, car.getCarDirection().clone().applyAxisAngle(new Vector3(0, 1, 0), rotation));
      rotation += ROTATION;
    });
  }

  private intersections(objectToIntersect: Object3D[]): Intersection[][] {
    const intersections: Intersection[][] = [];
    this._casters.forEach((caster: Raycaster) => {
      intersections.push(caster.intersectObjects(objectToIntersect, true));
    });

    return intersections;
  }

  private handleAi(car: AiCar, wallIntersections: Intersection[][]): void {
    const rightDistance: number = wallIntersections[rPosition.right][0].distance + wallIntersections[rPosition.fDiagRight][0].distance;
    const leftDistance: number = wallIntersections[rPosition.left][0].distance + wallIntersections[rPosition.fDiagLeft][0].distance;
    const fowardDistance: number = wallIntersections[rPosition.foward][0].distance;

    if (!car.isOffsetSet) {
      car.offset = rightDistance - leftDistance;
      car.isOffsetSet = true;
    }
    this._aiControllerService.analysePosition(car, leftDistance, rightDistance, fowardDistance);
  }

  private checkWallsDistance(car: Car): boolean {
    const wallIntersections: Intersection[][] = this.intersections([this._walls]);
    const isCollisionWithWall: boolean = this._detectorIntersectionService.isCollisionWithWall(wallIntersections);

    if (car.mesh.name === "aiCar") {
      this.handleAi(car as AiCar, wallIntersections);
    }

    return isCollisionWithWall;
  }

  private checkCarsDistance(car: Car): Car[] {
    const carToCheck: Car[] = this._cars.filter((carT: Car) => carT.id !== car.id);
    const carIntersections: Intersection[][] = this.intersections(carToCheck);
    const carsToCollide: Car[] = this._detectorIntersectionService.collisionWithCars(carIntersections);
    carsToCollide.push(car);

    return carsToCollide;
  }

  private carCollision(cars: Car[]): void {
    const firstCar: Car = this._cars.find((car: Car) => car.id === cars[cars.length - 1].id);
    cars.pop();

    let otherCar: Car;
    cars.forEach((car: Car) => {
      otherCar = this._cars.find((carToFind: Car) => carToFind.id === car.id);
      this._carCollisionService.collideCars(firstCar, otherCar);
    });
  }

  private wallCollision(car: Car): void {
    this._carCollisionService.collideWithWall(car);
  }

  public analyseDetection(): void {
    this._cars.forEach((car: Car) => {

      this.updateDetectorsPosition(car);
      if (this.checkWallsDistance(car)) {
        this.wallCollision(car);
      }

      const carToCollide: Car[] = this.checkCarsDistance(car);
      if (carToCollide.length > 1) {
        this.carCollision(carToCollide);
      }
    });
  }
}
