import { Injectable, QueryList } from "@angular/core";

import { Word } from "../../../../../../common/communication/word";
import { Cell } from "../../../../../../common/communication/cell";

import { CellComponent } from "../../components/cell/cell.component";

const BACKSPACECODE: number = 8;

@Injectable()
export class LetterPlacerService {

  private _cellComponents: QueryList<CellComponent>;
  public wordToPlace: Word;
  private _savedCellComponent: CellComponent;

  public set cellComponents(cellComponents: QueryList<CellComponent>) {
    this._cellComponents = cellComponents;
  }

  private isTheFirstCell(positionX: number, positionY: number): boolean {
    return this.wordToPlace._x === positionX && this.wordToPlace._y === positionY;
  }

  private isTheLastCell(positionX: number, positionY: number): boolean {
    if (this.wordToPlace._isHorizontal) {
      return positionX === this.wordToPlace._x + this.wordToPlace._word.length - 1 && positionY === this.wordToPlace._y;
    } else  {
      return positionY === this.wordToPlace._y + this.wordToPlace._word.length - 1 && positionX === this.wordToPlace._x;
    }
  }

  private findComponent(positionX: number, positionY: number): CellComponent {
    return this._cellComponents.find((component) => {
      return component.cell._x === positionX && component.cell._y === positionY;
    });
  }

  private findComponentsFromWordToPlace(): CellComponent[] {
    const componentsFromWord: CellComponent[] = [];
    for (let i: number = 0; i < this.wordToPlace._word.length; i++) {
      (this.wordToPlace._isHorizontal) ?
        componentsFromWord.push(this.findComponent(this.wordToPlace._x + i, this.wordToPlace._y)) :
        componentsFromWord.push(this.findComponent(this.wordToPlace._x, this.wordToPlace._y + i));
    }

    return componentsFromWord;
  }

  private findNextCellComponent(positionX: number, positionY: number, goFoward: boolean): CellComponent {
    let position: number;
    (goFoward) ? position = 1 : position = -1;

    if (this.isTheLastCell(positionX, positionY) && goFoward) {
      return null;
    }

    // Return the next/prev cellComponent
    let component: CellComponent;
    if (!this.isTheFirstCell(positionX, positionY) || goFoward) {
      if (this.wordToPlace._isHorizontal) {
        component = this.findComponent(positionX + position, positionY);

        return (!component.isCorrectAnswer) ? component : this.findNextCellComponent(positionX + position, positionY, goFoward);
      } else {
        component = this.findComponent(positionX, positionY + position);

        return (!component.isCorrectAnswer) ? component : this.findNextCellComponent(positionX, positionY + position, goFoward);
      }
    }

    // Return the same component if it's the first cell
    component = this.findComponent(positionX, positionY);

    return (!component.isCorrectAnswer) ? component : this._savedCellComponent;
  }

  public analysePressedKey(cellEvent: [Cell, KeyboardEvent]): CellComponent[] {
    if (cellEvent[1].keyCode >= "A".charCodeAt(0) && cellEvent[1].keyCode <= "Z".charCodeAt(0)) {
      const resultComponent: CellComponent = this.findNextCellComponent(cellEvent[0]._x, cellEvent[0]._y, true);

      return (resultComponent == null) ? this.findComponentsFromWordToPlace() : Array(resultComponent);

    } else if (cellEvent[1].keyCode === BACKSPACECODE) {
      this._savedCellComponent = this.findComponent(cellEvent[0]._x, cellEvent[0]._y);

      return Array(this.findNextCellComponent(cellEvent[0]._x, cellEvent[0]._y, false));

    } else {
      return Array(this.findComponent(cellEvent[0]._x, cellEvent[0]._y));
    }
  }
}
