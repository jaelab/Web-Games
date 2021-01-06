import { Injectable } from "@angular/core";
import { Object3D, Mesh, PlaneGeometry, DoubleSide, TextureLoader, Texture, CircleGeometry, Matrix4,
         RepeatWrapping, MeshPhongMaterial } from "three";
import { HttpTracksService } from "../httpTrackService/http-tracks.service";

// tslint:disable-next-line:max-line-length
import { ROAD_WIDTH, START_WIDTH, MESH_NUMBER_LINE, PLANE_Y_POSITION, GAME_DIMENTION, TEXTURE_CLONE, GRASS_URL, ROTATION_90_DEGREE } from "../constants/trackConstant";
import { Track } from "./track";
import { Point } from "./point";
import { TrackSegment } from "./trackSegment/track-segment";
import { Wall3dService } from "./wall3d.service";
import { StartingPositionCarService } from "../render-service/starting-position-car.service";
import { Track3dLogicService } from "./track3d-logic.service";

@Injectable()
export class Track3dService extends Object3D {

  private _trackVector3: Track;
  public startingPositions: Matrix4[];
  public trackName: string;
  private _walls: Object3D;
  private _checkpoints: Object3D[];

  public constructor(private _httpTracksService: HttpTracksService,
                     private _track3DLogicService: Track3dLogicService,
                     private _wall3D: Wall3dService,
                     private _startingPositionService: StartingPositionCarService) {
    super();
    this._trackVector3 = new Track;
    this.trackName = "";
    this._checkpoints = [];
  }

  public get walls(): Object3D {
    return this._walls;
  }

  public get checkpoints(): Object3D[] {
    return this._checkpoints;
  }

  public get track(): Track {
    return this._trackVector3;
  }

  public async init(): Promise<void> {
    this._trackVector3 = await this._httpTracksService.getCurrentTrack(this.trackName);
    this.generateAllMesh();
    this.generateWalls();
    this.initializeStartingPosition();
    this.initializeCheckpoints();
  }

  private generateAllMesh(): void {
    this.generateGrass();
    this.generateRoad();
    this.generateCurve();
    this.updateMatrixWorld(true);
    this.placeStartingLine();
  }

  private generateWalls(): void {
    this._walls = this._wall3D.generateWalls(this.clone());
    this.add(this._walls);
  }

  private initializeCheckpoints(): void {
    const curves: Object3D[] = this.children.filter((mesh: Mesh) => {
      return mesh.geometry.type === "CircleGeometry";
    });
    let arrayToReverse: Object3D[] = curves.slice(1, curves.length);
    arrayToReverse = arrayToReverse.reverse();
    const newOrder: Object3D[] = [curves[0]];
    this._checkpoints = newOrder.concat(arrayToReverse);
  }

  private initializeStartingPosition(): void {
    this.startingPositions = this._startingPositionService.placeCarStartingPosition(this.children);
  }

  private placeStartingLine(): void {
    const geometry: PlaneGeometry = new PlaneGeometry(ROAD_WIDTH, START_WIDTH, MESH_NUMBER_LINE);
    const material: MeshPhongMaterial = new MeshPhongMaterial( {color: 0xFFFFFF, side: DoubleSide} );
    const startingLine3D: Mesh = new Mesh( geometry, material );

    startingLine3D.applyMatrix(this.children[1].matrix);
    startingLine3D.position.y += PLANE_Y_POSITION;

    startingLine3D.name = "start";
    this.add(startingLine3D);
  }

  private loadTexture(textureUrl: string, repeatX: number, repeatY: number): Texture {
    return new TextureLoader().load(textureUrl, ( textureT: Texture ) => {
      textureT.wrapS = textureT.wrapT = RepeatWrapping;
      textureT.offset.set(0, 0);
      textureT.repeat.set(repeatX, repeatY);
    });
  }

  private generateGrass(): void {
    const geometry: PlaneGeometry = new PlaneGeometry(GAME_DIMENTION, GAME_DIMENTION, MESH_NUMBER_LINE );
    const texture: Texture = this.loadTexture(GRASS_URL, TEXTURE_CLONE, TEXTURE_CLONE);
    const material: MeshPhongMaterial = new MeshPhongMaterial( {map: texture, side: DoubleSide} );
    const plane3D: Mesh = new Mesh( geometry, material );

    plane3D.position.y -= PLANE_Y_POSITION;
    plane3D.rotateX(ROTATION_90_DEGREE);

    plane3D.name = "grass";
    this.add(plane3D);
  }

  private createPlane(trackSegment: TrackSegment): void {
    const geometry: PlaneGeometry = new PlaneGeometry(ROAD_WIDTH, trackSegment.segmentLength, MESH_NUMBER_LINE );
    const material: MeshPhongMaterial = new MeshPhongMaterial( {color: 0x615F5F, side: DoubleSide} );

    const plane3D: Mesh = new Mesh( geometry, material );

    this._track3DLogicService.adjustPlanePosition(plane3D, trackSegment);
    this._track3DLogicService.adjustPlaneAngle(plane3D, trackSegment);

    plane3D.name = "road";
    this.add(plane3D);
  }

  private createCircle(point: Point, index: number): void {
    // tslint:disable-next-line:no-magic-numbers diametre diviser par 2 = rayon..
    const geometry: CircleGeometry = new CircleGeometry(ROAD_WIDTH / 2, MESH_NUMBER_LINE);
    const material: MeshPhongMaterial = new MeshPhongMaterial( {color: 0x615F5F, side: DoubleSide} );

    const circle3D: Mesh = new Mesh( geometry, material );
    this._track3DLogicService.adjustCirclePosition(circle3D, point);

    circle3D.name = "curve" + index.toString();
    this.add(circle3D);
  }

  private generateCurve(): void {
   this._trackVector3.points.forEach( (point: Point, index: number) => {
      this.createCircle(point, index);
    });
  }

  private generateRoad(): void {
    this._trackVector3.segments.forEach( (segment: TrackSegment) => {
      this.createPlane(segment);
    });
  }
}
