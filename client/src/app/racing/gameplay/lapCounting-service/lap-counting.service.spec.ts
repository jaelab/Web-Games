import { TestBed, inject } from "@angular/core/testing";

import { LapCountingService } from "./lap-counting.service";
import { AppModule } from "../../../app.module";
import { PlayerCar } from "../../car/playerCar";
import { Vector3, Object3D, Mesh } from "three";

describe("LapCountingService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppModule]
    });
  });

  it("should be created", inject([LapCountingService], (service: LapCountingService) => {
    expect(service).toBeTruthy();
  }));
});

describe("intersectCheckPoint", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppModule]
    });
  });

  it("should verify if car intersect with checkpoint", inject([LapCountingService], (service: LapCountingService) => {
    const coordonne: number = 10;
    const positionOnTrack: Vector3 = new Vector3(coordonne, coordonne, coordonne);

    const car: PlayerCar = new PlayerCar();
    car.mesh = new Mesh();
    car.mesh.position.x = positionOnTrack.x;
    car.mesh.position.z = positionOnTrack.z;

    const checkPoint: Object3D = new Object3D();
    checkPoint.position.x = positionOnTrack.x;
    checkPoint.position.z = positionOnTrack.z;

    expect(service.intersectCheckPoint(car, checkPoint)).toBeTruthy();
  }));
});
