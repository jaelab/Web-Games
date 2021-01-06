import { Component, Output, EventEmitter, Input } from "@angular/core";

import { Cell } from "../../../../../../common/communication/cell";

const INPUT_WAITING_TIME: number = 50;
const COLOR_WAITING_TIME: number = 150;
enum HighlightedColor {
  None = "white", Red = "red", Blue = "blue", Green = "green"
}

@Component({
  selector: "app-cell",
  templateUrl: "./cell.component.html",
  styleUrls: ["./cell.component.css"]
})
export class CellComponent  {

  private _inputFocused: boolean;
  private _isHighlighted: boolean;
  @Input() public cell: Cell;
  public value: string;
  public isCorrectAnswer: boolean;
  public colorToHighlight: string;

  @Output() public oCellClicked: EventEmitter<Cell> = new EventEmitter<Cell>();
  @Output() public oInput: EventEmitter<[Cell, KeyboardEvent]> = new EventEmitter<[Cell, KeyboardEvent]>();

  public constructor() {
    this._inputFocused = false;
    this._isHighlighted = false;
    this.isCorrectAnswer = false;
    this.colorToHighlight = HighlightedColor.None;
    this.value = "";
  }

  public focusInput(): void {
    this._inputFocused = true;
    setTimeout(() => {this._inputFocused = false; });
    this.value = "";
  }

  public unHighlightCell(): void {
    this.colorToHighlight = HighlightedColor.None;
  }

  public highlightCell(color: string): void {
    this.colorToHighlight = color;
    if (color === HighlightedColor.Red) {
      setTimeout(() => {this.colorToHighlight = HighlightedColor.Blue; }, COLOR_WAITING_TIME);
    }
  }

  public inputClicked(event: Event): void {
    this.oCellClicked.emit(this.cell);
    event.stopPropagation();
  }

  public letterEntered(keyboardEvent: KeyboardEvent): void {
    setTimeout(() => this.oInput.emit([this.cell, keyboardEvent]), INPUT_WAITING_TIME);
  }
}
