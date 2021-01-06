import { Injectable } from "@angular/core";
import { Object3D, PlaneGeometry, Mesh, Raycaster, Vector3, Quaternion, Intersection, DoubleSide,
       CylinderGeometry, TextureLoader, Texture, RepeatWrapping, MeshPhongMaterial } from "three";
import { Wall3dLogicService } from "./wall3d-logic.service";

// tslint:disable-next-line:no-magic-numbers division par 2
const ROTATION_90_DEGREE: number = Math.PI / 2;
const ROAD_WIDTH: number = 30;
const WALL_SCALE_FACTOR: number = 0.1;
const RADIUS_SEGMENT: number = 32;
const HEIGHT: number = 3;
const HEIGHT_SEGMENT: number = 32;
const SAFETY_URL: string =  "../../../assets/track/gardeFou.png";
const SAFETY_ROTATED_URL: string =  "../../../assets/track/gardeFouR.png";

@Injectable()
export class Wall3dService {

  private _track3D: Object3D;
  private _walls: Mesh;

  public constructor(private _wall3dLgociService: Wall3dLogicService) {
    this._walls = new Mesh;
  }

  private loadTexture(textureUrl: string, repeatX: number, repeatY: number): Texture {
    return new TextureLoader().load(textureUrl, ( textureT: Texture ) => {
      textureT.wrapS = textureT.wrapT = RepeatWrapping;
      textureT.offset.set(0, 0);
      textureT.repeat.set(repeatX, repeatY);
    });
  }

  // tslint:disable:no-magic-numbers  division par 2
  private createWall(mesh: Mesh, signe: number): void {
    const wall: Mesh = mesh.clone();
    wall.rotateY(ROTATION_90_DEGREE);
    wall.translateZ(signe * ROAD_WIDTH / 2);
    wall.scale.x = WALL_SCALE_FACTOR;

    const texture: Texture = this.loadTexture(SAFETY_URL, 1, 1);
    wall.material = new MeshPhongMaterial( {map: texture, side: DoubleSide, lightMap: texture,
                                            lightMapIntensity: 1, reflectivity: 0.1});  // a retirer pour le test
    wall.name = "wall";
    this._walls.add(wall);
  }
  // tslint:enable:no-magic-numbers

  private createPlaneWall(mesh: Mesh): void {
    this.createWall(mesh, -1);
    this.createWall(mesh, 1);
  }

  private generateInitialWall(): void {
    this._track3D.children.forEach((mesh: Mesh) => {
      if (mesh.name === "road") {
       this.createPlaneWall(mesh);
      }
    });
  }

  // tslint:disable:no-magic-numbers  division par 2
  private createCurvedWall(mesh: Mesh, index: number): void {
    const thetaLenght: number = this._wall3dLgociService.calculateThetaLenght(mesh.clone(), index);
    const thetaStart: number = this._wall3dLgociService.calculateThetaStart(mesh.clone(), index) - (thetaLenght / 2);

    const geometry: CylinderGeometry = new CylinderGeometry(
      ROAD_WIDTH / 2, ROAD_WIDTH / 2, HEIGHT, RADIUS_SEGMENT, HEIGHT_SEGMENT, true, thetaStart, thetaLenght);
    const texture: Texture = this.loadTexture(SAFETY_ROTATED_URL, 1, 1);
    const material: MeshPhongMaterial = new MeshPhongMaterial({map: texture, side: DoubleSide,
                                                               lightMap: texture, reflectivity: 1}); // a retirer pour le test
    const curvedWall: Mesh = new Mesh(geometry, material);
    curvedWall.position.set(mesh.position.x, mesh.position.y, mesh.position.z);

    curvedWall.name = "wall";
    this._walls.add(curvedWall);
  }
  // tslint:enable:no-magic-numbers

  private generateCurvedWalls(): void {
    let index: number = 0;
    this._track3D.children.forEach((mesh: Mesh) => {
      if (mesh.name === "curve" + index.toString()) {
       this.createCurvedWall(mesh, index);
       index++;
      }
    });
  }

  // tslint:disable:no-magic-numbers  division par 2
  private checkIntersection(wall: Mesh): void {
    const rotation: Quaternion = new Quaternion;
    const position: Vector3 = wall.position.clone();
    wall.matrix.decompose(new Vector3, rotation, new Vector3);

    const wallGeometry: PlaneGeometry = wall.geometry as PlaneGeometry;
    const direction: Vector3 = new Vector3(0, 1, 0).applyQuaternion(rotation);
    const rayCastFoward: Raycaster = new Raycaster(position, direction.clone(), 0, wallGeometry.parameters.height / 2);
    const rayCastBackward: Raycaster = new Raycaster(position, direction.clone().negate(), 0, wallGeometry.parameters.height / 2);

    const wallsToIntersect: Object3D[] = this._walls.children.filter((child: Object3D) => child.id !== wall.id);
    const fowardIntersections: Intersection[] = rayCastFoward.intersectObjects(wallsToIntersect, true);
    const backwardIntersections: Intersection[] = rayCastBackward.intersectObjects(wallsToIntersect, true);
    if (fowardIntersections.length > 0 || backwardIntersections.length > 0) {
      this._wall3dLgociService.adjustWallDimension(wall, fowardIntersections, backwardIntersections);
    }
  }
  // tslint:enable:no-magic-numbers

  private checkAllIntersections(): void {
    this._walls.updateMatrixWorld(true);
    this._walls.children.forEach((wall: Mesh) => {
      this.checkIntersection(wall);
    });
  }

  public generateWalls(track3D: Object3D): Mesh {
    this._track3D = track3D;
    this._wall3dLgociService.track3D = track3D;

    this.generateInitialWall();
    this.checkAllIntersections();
    this.generateCurvedWalls();

    return this._walls;
  }
}
