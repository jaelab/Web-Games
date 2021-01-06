import { Component, Input, Output, EventEmitter } from "@angular/core";
import { Word } from "../../../../../../common/communication/word";
import { CheatModeService } from "../cheat-mode/cheat-mode.service";

@Component({
  selector: "app-definition",
  templateUrl: "./definition.component.html",
  styleUrls: ["./definition.component.css"]
})
export class DefinitionComponent {

  public _definition: [Word, string];
  @Output() public definitionClickedEvent: EventEmitter<Word> = new EventEmitter<Word>();
  @Input() public wordFound: boolean = false;

  public constructor(public cheatModeService: CheatModeService) { }

  @Input()
  public set definition(definition: [Word, string]) {
    this._definition = definition;
  }

  public definitionClicked(event: Event): void {
    this.definitionClickedEvent.emit(this._definition[0]);
    event.stopPropagation();
  }

}
