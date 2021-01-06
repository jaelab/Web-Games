import { Injectable } from "@angular/core";
import { Intersection } from "three";
import { Car } from "./car";

// tslint:disable-next-line:no-magic-numbers
const CAR_DISTANCES: number[] = [1.5, 1.2, 0.8, 1.2, 1.5, 1.2, 0.8, 1.2];

@Injectable()
export class DetectorIntersectionService {

  private isIntersectionWithWall(casterIntersection: Intersection[], distance: number): boolean {
    if (casterIntersection.length !== 0) {
      if (casterIntersection[0].distance <= distance) {
        return true;
      }
    }

    return false;
  }

  private isIntersectionWithCar(casterIntersection: Intersection[], distance: number): Car {
    if (casterIntersection.length !== 0) {
      if (casterIntersection[0].distance <= distance) {
        return casterIntersection[0].object.parent.parent as Car;
      }
    }

    return undefined;
  }

  public collisionWithCars(intersections: Intersection[][]): Car[] {
    let collisionWithCars: Car[] = [];
    intersections.forEach((intersection: Intersection[], index: number) => {
      collisionWithCars.push(this.isIntersectionWithCar(intersection, CAR_DISTANCES[index]));
    });

    collisionWithCars = collisionWithCars.filter((car: Car) => car !== undefined);

    return collisionWithCars;
  }

  public isCollisionWithWall(intersections: Intersection[][]): boolean {
    let isCollisionWithWall: boolean = false;
    intersections.forEach((intersection: Intersection[], index: number) => {
      isCollisionWithWall = isCollisionWithWall || this.isIntersectionWithWall(intersection, CAR_DISTANCES[index]);
    });

    return isCollisionWithWall;
  }

}
