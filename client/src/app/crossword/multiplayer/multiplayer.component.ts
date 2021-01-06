import { Component, OnInit, AfterViewInit, ViewChildren, ViewChild, QueryList } from "@angular/core";
import { SocketService } from "../services/socket.service";
import { GetCrosswordService } from "../services/get-crossword.service";
import { ActivatedRoute } from "@angular/router";
import { GameMechanicsService } from "../services/game-mechanics.service";
import { Cell } from "../../../../../common/communication/cell";
import { CrosswordMessage } from "../../../../../common/communication/crosswordMessage";
import { Crossword } from "../../../../../common/communication/crossword";
import { DefinitionComponent } from "../components/definition/definition.component";
import { GameInformationsComponent } from "../components/game-informations/game-informations.component";
import { CellComponent } from "../components/cell/cell.component";
import { Word } from "../../../../../common/communication/word";

@Component({
  selector: "app-multiplayer",
  templateUrl: "./multiplayer.component.html",
  styleUrls: ["./multiplayer.component.css"]
})
export class MultiplayerComponent implements OnInit, AfterViewInit {
  private otherPlayerJoined: boolean;

  public crossword: Crossword;
  protected _dificulty: string;
  private _player: string;
  private _roomName: string;

  @ViewChildren(CellComponent) public cellComponents: QueryList<CellComponent>;
  @ViewChildren(DefinitionComponent) public definitionComponent: QueryList<DefinitionComponent>;
  @ViewChild(GameInformationsComponent) public gameInformationsComponent: GameInformationsComponent;

  public constructor(
    private _socketService: SocketService,
    protected _getCrosswordService: GetCrosswordService,
    protected _route: ActivatedRoute,
    protected _gameMechanicsService: GameMechanicsService) {
      this.otherPlayerJoined = false;
      this.crossword = new Crossword;
      this._roomName = this._route.snapshot.paramMap.get("_roomName");
      this._player = this._route.snapshot.paramMap.get("_playerName");
      this._dificulty = this._route.snapshot.paramMap.get("_difficulty");
      this._gameMechanicsService.isSoloGame = false;
  }

  private handleHost(): void {
    if (!this.otherPlayerJoined) {
      this._socketService.opponentJoined().subscribe(async (otherPlayerJoined: Boolean) => {

        if (otherPlayerJoined) {
          this.otherPlayerJoined = true;
          this._socketService.sendCrossword(this.crossword, this._roomName);
        }
      });
    }
  }

  private setupGameInformations(): void {
    this.gameInformationsComponent.setupGameinformation(this._dificulty, "multiplayer", this.crossword.wordDefinitions.length);
    this._gameMechanicsService.wordFinderService.listOfWords = this.crossword.wordDefinitions;
  }

  private async handleOtherUser(): Promise<void> {
    if (this._roomName !== this._player) {
      this._socketService.getCrossword().subscribe(async (crossword: Crossword) => {
        this.crossword = crossword;
        this.setupGameInformations();
      });
      this.otherPlayerJoined = true;

    } else {
      await this.getCrossword();
      this.setupGameInformations();
    }
  }

  public async ngOnInit(): Promise<void> {
    this.handleHost();
    await this.handleOtherUser();
  }

  public ngAfterViewInit(): void {
    this._gameMechanicsService.cellComponents = this.cellComponents;
    this._gameMechanicsService.definitionComponents = this.definitionComponent;
    this._gameMechanicsService.gameInformationsComponent = this.gameInformationsComponent;

    this._socketService.getCorrectWord().subscribe(async (word: Word) => {
      alert(word._word);
    });
  }

  public async getCrossword(): Promise<void> {
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
