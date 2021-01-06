import * as THREE from "three";
import { Injectable } from "@angular/core";
import { Car } from "../car/car";
import { FOV, ZOOM_SPEED, MAX_ZOOM_ORTHO, MAX_ZOOM_PERSPEC, MIN_ZOOM_ORTHO, MIN_ZOOM_PERSPEC , FAR_PLANE,
NEAR_PLANE, PI_OVER_2, STARTING_ORTHOGRAPHIC_X, STARTING_ORTHOGRAPHIC_Y,
STARTING_ORTHOGRAPHIC_Z, STARTING_PERSPECTIVE_Y, STARTING_PERSPECTIVE_Z, LEFT, RIGHT, TOP, BOTTOM} from "../constants/camera-constants";

@Injectable()
export class CamerasService {

  public perspectiveCamera: THREE.PerspectiveCamera;
  public orthographicCamera: THREE.OrthographicCamera;
  public isPerspective: boolean = true;
  public zoomFactor: number = 1;

  public constructor() {
    this.orthographicCamera = new THREE.OrthographicCamera (LEFT, RIGHT, TOP, BOTTOM, NEAR_PLANE, FAR_PLANE);
    this.initializeOrthographicView();
  }

  private initializeOrthographicView(): void {
    this.orthographicCamera.rotation.order = "YXZ";
    this.orthographicCamera.rotateX(-PI_OVER_2);
  }

  public initializePerspectiveCamera(aspectRatio: number, vectorPosition: THREE.Vector3, scene: THREE.Scene ): void {
    this.perspectiveCamera = new THREE.PerspectiveCamera(FOV, aspectRatio, NEAR_PLANE, FAR_PLANE);
    this.perspectiveCamera.position.set(0, STARTING_PERSPECTIVE_Y, STARTING_PERSPECTIVE_Z);
    this.perspectiveCamera.lookAt(vectorPosition);
  }

  public initalizeOrthographicCamera(vectorPosition: THREE.Vector3, scene: THREE.Scene ): void {
    this.orthographicCamera.position.set(STARTING_ORTHOGRAPHIC_X, STARTING_ORTHOGRAPHIC_Y, STARTING_ORTHOGRAPHIC_Z);
    this.orthographicCamera.lookAt(vectorPosition);
    scene.add(this.orthographicCamera);
  }

  public adaptOrthographicCamera(carVector: THREE.Vector3): void {
      this.orthographicCamera.position.set(carVector.x, this.orthographicCamera.position.y, carVector.z);
      this.orthographicCamera.updateProjectionMatrix();
  }

  public cameraRendering(car: Car, webGLRenderer: THREE.WebGLRenderer, scene: THREE.Scene): void {
    if (this.isPerspective) {
      car.cameraLink(this.perspectiveCamera, true);
      webGLRenderer.render(scene, this.perspectiveCamera);
    } else {
      car.cameraLink(this.perspectiveCamera, false);
      webGLRenderer.render(scene, this.orthographicCamera);
    }
  }

  public viewSwitch(): void {
    this.isPerspective = !this.isPerspective;
  }

  public zoomIn(): void {
    if (this.isPerspective) {
      if (this.perspectiveCamera.fov > MIN_ZOOM_PERSPEC) {
        this.zoomFactor -= ZOOM_SPEED;
        this.perspectiveCamera.fov = FOV * this.zoomFactor;
        this.perspectiveCamera.updateProjectionMatrix();
      }
    } else {
      if (this.orthographicCamera.zoom < MAX_ZOOM_ORTHO) {
        this.orthographicCamera.zoom += ZOOM_SPEED;
      }
    }
  }

  public zoomOut(): void {
    if (this.isPerspective) {
      if (this.perspectiveCamera.fov < MAX_ZOOM_PERSPEC) {
        this.zoomFactor += ZOOM_SPEED;
        this.perspectiveCamera.fov = FOV * this.zoomFactor;
        this.perspectiveCamera.updateProjectionMatrix();
      }
    } else {
      if (this.orthographicCamera.zoom > MIN_ZOOM_ORTHO) {
        this.orthographicCamera.zoom -= ZOOM_SPEED;
      }
    }
  }
}
