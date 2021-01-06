import { Component } from "@angular/core";
import { CheatModeService } from "./cheat-mode.service";

@Component({
  selector: "app-cheat-mode",
  templateUrl: "./cheat-mode.component.html",
  styleUrls: ["./cheat-mode.component.css"]
})
export class CheatModeComponent {

  public constructor(public cheatModeService: CheatModeService) { }
}
