import { Injectable, QueryList } from "@angular/core";

import { Word } from "../../../../../../common/communication/word";

import { CellComponent } from "../../components/cell/cell.component";

@Injectable()
export class CellHiglighterService {

  private _cellComponents: QueryList<CellComponent>;

  public set cellComponents(cellComponents: QueryList<CellComponent>) {
    this._cellComponents = cellComponents;
  }

  public unHiglightAllCells(): void {
    this._cellComponents.forEach((cell) => {
      cell.unHighlightCell();
    });
  }

  public findCellsFromWord(word: Word): CellComponent[] {
    if (word._isHorizontal) {
        return this._cellComponents.filter((component) => {
          return component.cell._y === word._y && component.cell._x >= word._x && component.cell._x < word._x + word._word.length;
        });
    } else {
      return this._cellComponents.filter((component) => {
        return component.cell._x === word._x && component.cell._y >= word._y && component.cell._y < word._y + word._word.length;
      });
    }
  }

  public HiglightCells(word: Word, color: string): void {
    this.unHiglightAllCells();
    const componentToHiglight: CellComponent[] = this.findCellsFromWord(word);
    componentToHiglight.forEach((component) => {
      component.highlightCell(color);
    });
  }
}
