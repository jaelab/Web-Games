import { Injectable } from "@angular/core";
import { OrthographicCamera, WebGLRenderer, Scene, Mesh , MeshBasicMaterial, PlaneGeometry,
  CircleGeometry, Vector2, Raycaster, Vector3, Object3D, Intersection } from "three";
import { TrackSegment3js } from "../../track/trackSegment/3js/track-segment-3js";

const FIELD_OF_VIEW: number = 30;
const NEAR_CLIPPING_PANE: number = 0;
const FAR_CLIPPING_PANE: number = 256;
const SCENE_SCALE_VALUE: number = 25;
const TRACK_PLANE_SIDE_SIZE: number = 1000;

const POINT_RADIUS: number = 15;
const CIRCLE_SIDE_AMOUNT: number = 32;
const DEFAULT_CAMERA_Z_POSITION: number = 5;
const TWO: number = 2;
const DEFAULT_TRACK_PLANE_Z_POSITION: number  = 0;
const DEFAULT_TRACK_PLANE_POSITIF_POSITION: number = 0;
const FOREST_GREEN_COLOR: number = 0x228B22;
const BLACK: number = 0x000000;

@Injectable()
export class EditorRenderingService {

  private _camera: OrthographicCamera;
  private _scene: Scene;
  public renderer: WebGLRenderer;
  private _mapPlane: Mesh;
  private _ray: Raycaster;
  private _thePointsToDisplay: Object3D[];
  private _theSegmentsToDisplay: TrackSegment3js[];
  private _container: HTMLDivElement;

  public constructor() {
    this._scene = new Scene();
    this._ray = new Raycaster();
    this._thePointsToDisplay = new Array<Mesh>();
    this._theSegmentsToDisplay = new Array<TrackSegment3js>();
  }

  private generateEditorPlane(): void {
    this._mapPlane = new Mesh(new PlaneGeometry( TRACK_PLANE_SIDE_SIZE, TRACK_PLANE_SIDE_SIZE ),
                              new MeshBasicMaterial({color: FOREST_GREEN_COLOR, depthWrite: false }));
    this._mapPlane.position.z = DEFAULT_TRACK_PLANE_Z_POSITION;
    this._scene.add( this._mapPlane );
  }

  public generatePointInDisplay( pointPosition: Vector3 ): void {
    const tempMaterial: MeshBasicMaterial = new MeshBasicMaterial({color: 0x0000FF });
    if ( this._thePointsToDisplay.length === 0 ) {
        tempMaterial.color.setHex(BLACK);
    }
    const onePoint: Mesh = new Mesh( new CircleGeometry ( POINT_RADIUS , CIRCLE_SIDE_AMOUNT ), tempMaterial ) ;
    onePoint.position.set( pointPosition.x, pointPosition.y, 1 );
    this._thePointsToDisplay.push( onePoint );
    this._scene.add(this._thePointsToDisplay[this._thePointsToDisplay.length - 1 ]);
  }

  public removeLastPointInDisplay(): void {
    this._scene.remove( this._thePointsToDisplay.pop() );
  }

  public generateSegmentInDisplay( segmentStartPosition: Vector3, segmentDirectionVector: Vector3,
                                   indexInDataArray: number, isValid: boolean  ): void {
    const tempSegment: TrackSegment3js = new TrackSegment3js( segmentDirectionVector,  segmentStartPosition, isValid );
    if (indexInDataArray === this._theSegmentsToDisplay.length) { this._theSegmentsToDisplay.push( tempSegment ); } else {
      this._scene.remove(this._theSegmentsToDisplay[indexInDataArray].roadSegment);
      this._theSegmentsToDisplay[indexInDataArray] = tempSegment;
    }
    this._scene.add( this._theSegmentsToDisplay[ indexInDataArray ].roadSegment);
  }

  public removeLastSegmentInDisplay(): void {
    this._scene.remove( this._theSegmentsToDisplay.pop().roadSegment );
  }

  public removeTrackInDisplay(): void {
    while (this._thePointsToDisplay.length !== 0) {
      this.removeLastPointInDisplay();
    }
    while (this._theSegmentsToDisplay.length !== 0) {
      this.removeLastSegmentInDisplay();
    }
  }

  public initialize(container: HTMLDivElement): void {
    if (container) { this._container = container; }
    this.generateEditorPlane();
    this.renderer = new WebGLRenderer();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this._container.appendChild(this.renderer.domElement);
    this._camera = this.generateOrthographicCamera( this.getAspectRatio() );
    this.renderer.render(this._scene, this._camera);
    this.render();
  }

  public generateOrthographicCamera(aspectRatio: number): OrthographicCamera {
    const orthographicCamera: OrthographicCamera = new OrthographicCamera(
      SCENE_SCALE_VALUE * FIELD_OF_VIEW / -TWO,
      SCENE_SCALE_VALUE * FIELD_OF_VIEW / TWO,
      SCENE_SCALE_VALUE * FIELD_OF_VIEW / aspectRatio / TWO,
      SCENE_SCALE_VALUE * FIELD_OF_VIEW / aspectRatio / -TWO,
      NEAR_CLIPPING_PANE * SCENE_SCALE_VALUE,
      FAR_CLIPPING_PANE * SCENE_SCALE_VALUE);
    orthographicCamera.position.set(DEFAULT_TRACK_PLANE_POSITIF_POSITION, DEFAULT_TRACK_PLANE_POSITIF_POSITION, DEFAULT_CAMERA_Z_POSITION);

    return orthographicCamera;
  }

  private render(): void {
    requestAnimationFrame(() => this.render());
    this.renderer.render(this._scene, this._camera);
  }

  private getAspectRatio(): number {
    return this._container.clientWidth / this._container.clientHeight;
  }

  private getMousePosition(event: MouseEvent): Vector2 {
    const rect: ClientRect = this._container.getBoundingClientRect();

    return  new Vector2(((event.clientX / window.innerWidth) * TWO - 1 ),
                        -(((event.clientY - rect.top) / rect.height) * TWO - 1  ));
  }

  public onResize(): void {
      this._camera.updateProjectionMatrix();
      this.renderer.setSize(this._container.clientWidth, this._container.clientHeight);
  }

  public onDrag(event: MouseEvent, pointIndex: number ): void {
    const pos: Vector3 = this.clickPositionOnPlan(event);
    pos.z = 1;
    this._thePointsToDisplay[ pointIndex ].position.copy(pos);
  }

  public getPointIndex(): number {
    const selectedPoint: Object3D = this._ray.intersectObjects( this._thePointsToDisplay ) [0].object;

    return this._thePointsToDisplay.indexOf(selectedPoint);
  }

  public clickPositionOnPlan(event: MouseEvent): Vector3 {
    const mouse: Vector2 = this.getMousePosition(event);
    this._ray.setFromCamera( mouse, this._camera);
    const tempVect: Vector3 = this._ray.intersectObject( this._mapPlane ) [0].point;
    tempVect.z = 0;

    return tempVect;
  }
  public clickPositionOnPoint(event: MouseEvent): Vector3 {
    const mouse: Vector2 = this.getMousePosition(event);
    this._ray.setFromCamera( mouse, this._camera);
    const intersection: Intersection = this._ray.intersectObjects( this._thePointsToDisplay ) [0];
    if (intersection) {
      return intersection.point;
    } else {
      return undefined;
    }
  }
}
