import { TestBed, inject } from "@angular/core/testing";

import { CarCollisionService } from "./car-collision.service";
import { PlayerCar } from "./playerCar";
import { AiCar } from "./aiCar";
import { Vector3, Matrix4 } from "three";
import { AudioService } from "../audio.service";

// tslint:disable:no-magic-numbers
describe("CarCollisionService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CarCollisionService, AudioService]
    });
  });

  it("should be created", inject([CarCollisionService], (service: CarCollisionService) => {
    expect(service).toBeTruthy();
  }));

  describe("function collideCars", () => {
    it("update the speed of both cars", inject([CarCollisionService], async (service: CarCollisionService) => {
      const mockCar1: PlayerCar = new PlayerCar();
      await mockCar1.init(new Matrix4);
      const mockCar2: AiCar = new AiCar();
      await mockCar2.init(new Matrix4);
      mockCar1.setSpeed(new Vector3(1, 0, 0));
      mockCar2.setSpeed(new Vector3(-1, 0, 0));
      mockCar1.position.set(-1, 0, 0);
      mockCar2.position.set(1, 0, 0);

      service.collideCars(mockCar1, mockCar2);
      expect(mockCar2.speed).toEqual(mockCar1.speed);
    }));
  });

  describe("function collideWithWall", () => {
    it("update the speed of the car that has a collision", inject([CarCollisionService], async (service: CarCollisionService) => {
      const mockCar1: PlayerCar = new PlayerCar();
      await mockCar1.init(new Matrix4);
      mockCar1.setSpeed(new Vector3(1, 0, 0));
      mockCar1.position.set(-1, 0, 0);

      service.collideWithWall(mockCar1);
      expect(mockCar1.speed).not.toEqual(new Vector3(1, 0, 0));
    }));
  });
});
