import { Injectable } from "@angular/core";
import { Mesh, FontLoader, TextGeometry, Font, MeshPhongMaterial, Scene, Matrix4} from "three";
import { ROTATION } from "../../constants/car-constants";

const COUNT_DOWN_SECOND: number = 3;
export const TIMEOUT: number = 4000;
const ONE_SECOND: number = 1000;
const COUNTDOWN_POSITION_Y: number = 4;
const FONT_URL: string = "../../../../assets/font/helvetiker_regular.typeface.json";

@Injectable()
export class CountdownService {

  public isCountingDown: boolean;
  public scene: Scene;
  public countdownMeshPosition: Matrix4;

  private countdownFont: Font;
  public countdownMesh: Mesh;
  private countdown: number;

  public constructor() {
    this.isCountingDown = false;
    this.countdown = COUNT_DOWN_SECOND;
  }

  public startCountdown(): void {
    this.isCountingDown = true;
    this.initializeCountdownMesh(this.countdown);
    this.setTimeOut();
    this.countingDown();
  }

  private initializeCountdownMesh(countdown: number): void {
    let countdownGeometry: TextGeometry;

    const loader: FontLoader = new FontLoader();

    loader.load( FONT_URL , ( font: Font ) => {
      this.countdownFont = font;
      countdownGeometry = new TextGeometry( countdown.toString(), {
        font: font,
        size: 1.5,
        height: 1,
      } );
      this.countdownMesh = new Mesh(countdownGeometry, new MeshPhongMaterial());
      this.countdownMesh.applyMatrix(this.countdownMeshPosition);
      this.countdownMesh.position.y += COUNTDOWN_POSITION_Y;
      this.countdownMesh.geometry.rotateX(ROTATION);
      this.scene.add(this.countdownMesh);
    } );
  }

  public removeCountdownMesh(): void {
    this.scene.remove(this.countdownMesh);
  }

  private setTimeOut(): void {
    setTimeout(() => {
      this.isCountingDown = false;
    },         TIMEOUT);
  }

  private countingDown(): void {
    setTimeout(() => {
      this.countdown --;
      this.updateCountdownMesh(this.countdown);
      if (this.countdown > 0) {
        this.countingDown();
      }
    },         ONE_SECOND);
  }

  private updateCountdownMesh(countdown: number): void {
    let countdownMessage: string = countdown.toString();

    if (countdown === 0) {
      countdownMessage = "GO";
    }

    this.countdownMesh.geometry = new TextGeometry (countdownMessage, {
      font: this.countdownFont,
      size: 1.5,
      height: 1,
    });
    this.countdownMesh.geometry.rotateX(ROTATION);
  }
}
