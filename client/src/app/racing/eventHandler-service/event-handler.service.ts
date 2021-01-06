import { Injectable } from "@angular/core";
import { CamerasService } from "../render-service/cameras.service";
import { DayNightService } from "../render-service/day-night.service";
const VIEW_KEYCODE: number = 86;        // v
const ZOOMIN_KEYCODE: number = 73;      // i
const ZOOMOUT_KEYCODE: number = 79;     // o
const DAY_NIGHT_KEYCODE: number = 88;   // x

@Injectable()
export class EventHandlerService {

  public constructor( private _camerasService: CamerasService, private _dayNightService: DayNightService) {
  }

  public handleKeyDown(event: KeyboardEvent): void {
    switch (event.keyCode) {

      case VIEW_KEYCODE:
        this._camerasService.viewSwitch();
        break;

        case DAY_NIGHT_KEYCODE:
        this._dayNightService.switchDayNight();
        break;

      case ZOOMIN_KEYCODE:
        this._camerasService.zoomIn();
        break;

      case ZOOMOUT_KEYCODE:
        this._camerasService.zoomOut();
        break;

      default:
        break;
    }
  }
}
