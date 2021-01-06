import { Component, OnInit, ViewChildren, QueryList, AfterViewInit, ViewChild } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

import { CrosswordMessage } from "../../../../../common/communication/crosswordMessage";
import { Crossword } from "../../../../../common/communication/crossword";
import { Cell } from "../../../../../common/communication/cell";
import { Word } from "../../../../../common/communication/word";

import { CellComponent } from "../components/cell/cell.component";
import { DefinitionComponent } from "../components/definition/definition.component";
import { GameInformationsComponent } from "../components/game-informations/game-informations.component";

import { GameMechanicsService } from "../services/game-mechanics.service";
import { GetCrosswordService } from "../services/get-crossword.service";

@Component({
  selector: "app-solo",
  templateUrl: "./solo.component.html",
  styleUrls: ["./solo.component.css"]
})
export class SoloComponent implements OnInit, AfterViewInit {

  public crossword: Crossword;
  protected _dificulty: string;

  @ViewChildren(CellComponent) public cellComponents: QueryList<CellComponent>;
  @ViewChildren(DefinitionComponent) public definitionComponent: QueryList<DefinitionComponent>;
  @ViewChild(GameInformationsComponent) public gameInformationsComponent: GameInformationsComponent;

  public constructor(
    protected _getCrosswordService: GetCrosswordService,
    protected _route: ActivatedRoute,
    protected _gameMechanicsService: GameMechanicsService) {
      this.crossword = new Crossword;
      this._gameMechanicsService.isSoloGame = true;
    }

  public async ngOnInit(): Promise<void> {
    await this.getCrossword();
    this.gameInformationsComponent.setupGameinformation(this._dificulty, "Solo", this.crossword.wordDefinitions.length);
    this._gameMechanicsService.wordFinderService.listOfWords = this.crossword.wordDefinitions;
  }

  public ngAfterViewInit(): void {
    this._gameMechanicsService.cellComponents = this.cellComponents;
    this._gameMechanicsService.definitionComponents = this.definitionComponent;
    this._gameMechanicsService.gameInformationsComponent = this.gameInformationsComponent;
  }

  public async getCrossword(): Promise<void> {
    this._dificulty = this._route.snapshot.paramMap.get("_difficulty");
    const crosswordMessage: CrosswordMessage = await this._getCrosswordService.getCrosswordFromServer(this._dificulty);
    this.crossword = crosswordMessage.crossword;
  }

  public indiceClicked(word: Word): void {
    this._gameMechanicsService.selectCellFromHint(word);
  }

  public otherClick(): void {
    this._gameMechanicsService.clickOutside();
  }

  public cellClicked(cell: Cell): void {
    this._gameMechanicsService.selectCellFromCell(cell);
  }

  public letterEntered(cellEvent: [Cell, KeyboardEvent]): void {
    this._gameMechanicsService.handleUserInput(cellEvent);
  }
}
