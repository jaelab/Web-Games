import { injectable, inject } from "inversify";
import Types from "../../../../types";
import { Word } from "../../../../../../common/communication/word";
import { Crossword } from "../../../../../../common/communication/crossword";
import { WordDB } from "../gridLexicalService/wordDB";
import { GridFillerService } from "../gridFillerService/grid-filler.service";

enum Difficulty {easy = "easy", normal = "normal", hard = "hard"}

@injectable()
export class GridCreatorService {

  private _crossword: Crossword;

  public constructor(@inject(Types.WordDB) public _wordDB: WordDB,
                     @inject(Types.GridFillerService) private _gridFillerService: GridFillerService) {
    this._crossword = new Crossword;
    this._crossword.wordDefinitions = [];
  }

  private async getAllDefinition(frequence: string, listOfWords: Word[]): Promise<void> {
    await Promise.all(listOfWords.map(async (word: Word) => {
      this._crossword.wordDefinitions.push([word, await this._wordDB.gridLexicalService.requestDefinitionFromAPI(word, frequence)]);
    }));
  }

  private async createCrossWords(difficulty: string): Promise<void> {
    this._crossword.wordDefinitions = [];
    this._gridFillerService.gridMakerService.createValidGrid();
    switch (difficulty) {
      default:
        break;

      case Difficulty.easy:
        this._gridFillerService.initializeListOfWords("common");
        await this.getAllDefinition("common", this._gridFillerService.words);
        break;

      case Difficulty.normal:
        this._gridFillerService.initializeListOfWords("common");
        await this.getAllDefinition("notCommon", this._gridFillerService.words);
        break;

      case Difficulty.hard:
        this._gridFillerService.initializeListOfWords("notCommon");
        await this.getAllDefinition("notCommon", this._gridFillerService.words);
        break;
    }
  }

  public async postCrossWords(difficulty: string): Promise<Crossword> {
    await this.createCrossWords(difficulty);
    this._crossword.grid = this._gridFillerService.gridMakerService.grid;

    return this._crossword;
  }
}
