import { Injectable, QueryList } from "@angular/core";

import { DefinitionComponent } from "../components/definition/definition.component";
import { CellComponent } from "../components/cell/cell.component";
import { GameInformationsComponent } from "../components/game-informations/game-informations.component";

import { DefinitionComponentService } from "./definitionComponentServices/definition-component.service";
import { CellComponentService } from "./cellComponentServices/cell-component.service";
import { WordFinderService } from "./word-finder.service";
import { Word } from "../../../../../common/communication/word";
import { Cell } from "../../../../../common/communication/cell";
import { SocketService } from "./socket.service";

const BLUE_COLOR: string = "blue";
const RED_COLOR: string = "red";

@Injectable()
export class GameMechanicsService {

  private _isSoloGame: boolean;
  private _definitionComponents: QueryList<DefinitionComponent>;
  private _cellComponents: QueryList<CellComponent>;
  private _gameInformationsComponent: GameInformationsComponent;

  public constructor(public definitionComponentService: DefinitionComponentService,
                     public cellComponentService: CellComponentService,
                     public wordFinderService: WordFinderService,
                     private _socketService: SocketService) { }

  public set isSoloGame(isSoloGame: boolean) {
    this._isSoloGame = isSoloGame;
  }

  public set definitionComponents(definitionComponents: QueryList<DefinitionComponent>) {
    this._definitionComponents = definitionComponents;
    this.definitionComponentService.initialiseDefinitionComponents(definitionComponents);
  }

  public set cellComponents(cellComponents: QueryList<CellComponent>) {
    this._cellComponents = cellComponents;
    this.cellComponentService.initialiseCellComponents(cellComponents);
  }

  public set gameInformationsComponent(gameInformationsComponent: GameInformationsComponent) {
    this._gameInformationsComponent = gameInformationsComponent;
  }

  private findIndexToDisable(listOfComponents: CellComponent[][]): number[] {
    const indiceToDisable: number[] = [];
    listOfComponents.forEach((components: CellComponent[], indice: number) => {
      this.cellComponentService.cellValidatorService.cellsToValidate = components;

      if (this.cellComponentService.cellValidatorService.isWordValid()) {
        indiceToDisable.push(indice);
      }
    });

    return indiceToDisable;
  }

  private findWordToDisable(): Word[] {
    const listOfComponents: CellComponent[][] = [];
    this.wordFinderService._listOfWords.forEach((word) => {
      listOfComponents.push(this.cellComponentService.cellHiglighterService.findCellsFromWord(word));
    });

    const indiceToDisable: number[] = this.findIndexToDisable(listOfComponents);

    return this.wordFinderService.filterWordsFromIndex(indiceToDisable);
  }

  public disableAllFoundDefinitions(): void {
    const wordToDisable: Word[] = this.findWordToDisable();
    for (const word of wordToDisable) {
      this.definitionComponentService.definitionDisableService.disableDefinition(word);
    }
  }

  public selectCellFromHint(word: Word): void {
    this.cellComponentService.cellHiglighterService.HiglightCells(word, BLUE_COLOR);
    this.cellComponentService.cellFocuserService.findUnFoundCellToFocus(word).focusInput();
    this.cellComponentService.letterPlacerService.wordToPlace = word;
  }

  public clickOutside(): void {
    this.cellComponentService.cellHiglighterService.unHiglightAllCells();
  }

  public selectCellFromCell(cell: Cell): void {
    const correctWord: Word = this.wordFinderService.findCorrectWord(cell);
    this.cellComponentService.cellFocuserService.findUnFoundCellToFocus(correctWord).focusInput();
    this.cellComponentService.cellHiglighterService.HiglightCells(correctWord, BLUE_COLOR);
    this.cellComponentService.letterPlacerService.wordToPlace = correctWord;
  }

  private handleCorrectWord(): void {
    this.cellComponentService.cellValidatorService.disableCell();
    this.disableAllFoundDefinitions();
    this._gameInformationsComponent.updateProgressBar(this.definitionComponentService.definitionDisableService
      .findNumberOfDefinitionFound());
  }

  private handleInvalidWord(): void {
    const cellsNotValid: CellComponent[] = this.cellComponentService.cellValidatorService.findCellToDisable();
    cellsNotValid.forEach((component: CellComponent) => { component.value = ""; });
    this.cellComponentService.cellHiglighterService.HiglightCells(this.cellComponentService.letterPlacerService.wordToPlace, RED_COLOR);
    cellsNotValid[0].focusInput();
  }

  public handleUserInput(cellEvent: [Cell, KeyboardEvent]): void {
    const resultEvent: CellComponent[] = this.cellComponentService.letterPlacerService.analysePressedKey(cellEvent);
    // Last cell -> check if the entered word is valid
    if (resultEvent.length > 1) {
      this.cellComponentService.cellValidatorService.cellsToValidate = resultEvent;

      // This is the correct word!
      if (this.cellComponentService.cellValidatorService.isWordValid()) {
        this.handleCorrectWord();
        if (!this._isSoloGame) {
          this._socketService.sendCorrectWord(this.cellComponentService.letterPlacerService.wordToPlace);
        }
      } else {
        this.handleInvalidWord();
      }

    // Not last cell -> focus the next cell
    } else {
      resultEvent[0].focusInput();
    }
  }
}
