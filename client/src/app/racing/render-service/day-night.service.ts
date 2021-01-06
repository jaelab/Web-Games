import { Injectable } from "@angular/core";
import { RenderService } from "./render.service";

@Injectable()
export class DayNightService {

  public constructor(private _renderer: RenderService) { }

  public switchDayNight(): void {
    this._renderer.skybox.isNight = !this._renderer.skybox.isNight;
    this._renderer.lights[0].directionalLight.intensity = 0;

    for (const light of this._renderer.lights) {
      light.switchDayNightDirectionalLights();
      light.switchDayNightSpotLights();
    }

    this._renderer.scene.add(this._renderer.lights[0].directionalLight);
    this._renderer.scene.background = this._renderer.skybox.load();
  }
}
