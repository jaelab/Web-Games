import { TestBed, inject } from "@angular/core/testing";
import { CamerasService } from "./cameras.service";
import {STARTING_ORTHOGRAPHIC_X, STARTING_ORTHOGRAPHIC_Y, STARTING_ORTHOGRAPHIC_Z, STARTING_PERSPECTIVE_X,
  STARTING_PERSPECTIVE_Y, STARTING_PERSPECTIVE_Z} from "../constants/camera-constants";
import { Matrix4, Scene, Vector3 } from "three";
import { PlayerCar } from "../car/playerCar";
// tslint:disable:no-magic-numbers

describe("CamerasService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CamerasService]
    });
  });

  it("should be created", inject([CamerasService], (service: CamerasService) => {
    expect(service).toBeTruthy();
  }));

  describe("viewSwitch()", () => {
    it("should switch between the orthographic and perspective camera", inject([CamerasService], (service: CamerasService) => {
      service.isPerspective = true;
      service.viewSwitch();
      expect(service.isPerspective).toEqual(false);
    }));
  });

  describe("orthographicCamera()" , () => {
    it("should follow the car, and always stay in the middle of the sceen", inject([CamerasService],  async (service: CamerasService)  => {
      const mockScene: Scene = new Scene();
      const mockCar: PlayerCar = new PlayerCar();
      await mockCar.init(new Matrix4);
      mockCar.position = (new Vector3(0, 0, 0));
      mockScene.add(mockCar);
      service.initalizeOrthographicCamera(mockCar.carPosition, mockScene);
      mockCar.setSpeed(new Vector3(100, 10, 5));
      mockCar.update(5000);
      expect(service.orthographicCamera.position.x).toEqual(mockCar.carPosition.x + STARTING_ORTHOGRAPHIC_X);
      expect(service.orthographicCamera.position.y).toEqual(mockCar.carPosition.y + STARTING_ORTHOGRAPHIC_Y);
      expect(service.orthographicCamera.position.z).toEqual(mockCar.carPosition.z + STARTING_ORTHOGRAPHIC_Z);
    }));
  });
  describe("perspectiveCamera()", () => {
    it("should follow the car and stay on its floating stick behind it", inject([CamerasService], async (service: CamerasService) => {
      const mockScene: Scene = new Scene();
      const mockCar: PlayerCar = new PlayerCar();
      await mockCar.init(new Matrix4);
      mockCar.position = (new Vector3(0, 0, 0));
      mockScene.add(mockCar);
      service.initializePerspectiveCamera(1.5, mockCar.carPosition, mockScene);
      mockCar.setSpeed(new Vector3(100, 10, 25));
      mockCar.update(5000);
      mockCar.setSpeed(new Vector3(0, 0, 0));
      expect(service.perspectiveCamera.position.x).toEqual(mockCar.carPosition.x + STARTING_PERSPECTIVE_X);
      expect(service.perspectiveCamera.position.y).toEqual(mockCar.carPosition.y + STARTING_PERSPECTIVE_Y);
      expect(service.perspectiveCamera.position.z).toEqual(mockCar.carPosition.z + STARTING_PERSPECTIVE_Z);
    }));
  });
});
