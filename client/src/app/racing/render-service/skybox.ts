import { CubeTextureLoader, CubeTexture } from "three";
import { FORMAT, DAY_PATH, NIGHT_PATH } from "../constants/skybox-constants";

export class Skybox {

  public isNight: Boolean = false;

  public modeSwitch(): String {
    if (this.isNight) {
      return NIGHT_PATH;
    } else {
      return DAY_PATH;
    }
  }

  public load(): CubeTexture {
    const path: String = this.modeSwitch();

    const urls: string[] = [
      path + "posx" + FORMAT, path + "negx" + FORMAT,
      path + "posy" + FORMAT, path + "negy" + FORMAT,
      path + "posz" + FORMAT, path + "negz" + FORMAT
    ];

    return new CubeTextureLoader().load(urls);
  }
}
