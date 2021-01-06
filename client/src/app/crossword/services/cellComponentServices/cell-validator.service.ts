import { Injectable } from "@angular/core";

import { CellComponent } from "../../components/cell/cell.component";

@Injectable()
export class CellValidatorService {

  private _cellsToValidate: CellComponent[];

  public set cellsToValidate(cellsToValidate: CellComponent[]) {
    this._cellsToValidate = cellsToValidate;
  }

  public isWordValid(): boolean {
    for (const cellComponent of this._cellsToValidate) {
      if (cellComponent.value !== cellComponent.cell._value) {
        return false;
      }
    }

    return true;
  }

  public findCellToDisable(): CellComponent[] {
    return this._cellsToValidate.filter((cell) => {
      if (cell.isCorrectAnswer) {
        return false;
      }

      return true;
    });
  }

  public disableCell(): void {
    this.findCellToDisable().forEach((cell) => { cell.isCorrectAnswer = true; });
  }

}
