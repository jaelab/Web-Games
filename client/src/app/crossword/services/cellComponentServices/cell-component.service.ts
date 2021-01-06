import { Injectable, QueryList } from "@angular/core";

import { CellComponent } from "../../components/cell/cell.component";

import { CellFocuserService } from "./cell-focuser.service";
import { CellHiglighterService } from "./cell-higlighter.service";
import { LetterPlacerService } from "./letter-placer.service";
import { CellValidatorService } from "./cell-validator.service";

@Injectable()
export class CellComponentService {

  public constructor(
    public cellFocuserService: CellFocuserService,
    public cellHiglighterService: CellHiglighterService,
    public letterPlacerService: LetterPlacerService,
    public cellValidatorService: CellValidatorService) { }

  public initialiseCellComponents(cellComponents: QueryList<CellComponent>): void {
    this.cellFocuserService.cellComponents = cellComponents;
    this.cellHiglighterService.cellComponents = cellComponents;
    this.letterPlacerService.cellComponents = cellComponents;
  }
}
