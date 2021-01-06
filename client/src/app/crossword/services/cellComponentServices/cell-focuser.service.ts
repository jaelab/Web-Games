import { Injectable, QueryList } from "@angular/core";

import { Word } from "../../../../../../common/communication/word";

import { CellComponent } from "../../components/cell/cell.component";

@Injectable()
export class CellFocuserService {

  private _cellComponents: QueryList<CellComponent>;

  public set cellComponents(cellComponents: QueryList<CellComponent>) {
    this._cellComponents = cellComponents;
  }

  private findCellToFocus(positionX: number, positionY: number): CellComponent {
    return this._cellComponents.find((cellComponent) => {
      return (cellComponent.cell._x === positionX) ? (cellComponent.cell._y === positionY) ? true : false : false;
    });
  }

  private findUnFoundCellToFocusRecursive(positionX: number, positionY: number, isHorizontal: boolean): CellComponent {
    const cell: CellComponent = this.findCellToFocus(positionX, positionY);
    if (!cell.isCorrectAnswer) {
      return cell;
    }

    return (isHorizontal) ? this.findUnFoundCellToFocusRecursive(positionX + 1, positionY, isHorizontal) :
     this.findUnFoundCellToFocusRecursive(positionX, positionY + 1, isHorizontal);
  }

  public findUnFoundCellToFocus(word: Word): CellComponent {
    return this.findUnFoundCellToFocusRecursive(word._x, word._y, word._isHorizontal);
  }
}
