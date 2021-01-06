import { injectable, inject } from "inversify";
import Types from "../../../../types";
import { GridMakerService } from "../gridMakerService/grid-maker.service";
import { Word } from "../../../../../../common/communication/word";
import { WordDB } from "../gridLexicalService/wordDB";
import { GridFillerManipulatorService } from "./grid-filler-manipulator.service";

const MAX_NUMBER_BACKTRACK: number = 1000;

@injectable()
export class GridFillerService {

  public words: Array<Word>;
  private _numberOfBackTrack: number;

  constructor(@inject(Types.GridMakerService) public gridMakerService: GridMakerService,
              @inject(Types.GridFillerManipulatorService) private _gridFillerManipulatorService: GridFillerManipulatorService,
              @inject(Types.WordDB) private _wordDB: WordDB) {
    this.words = Array<Word>(0);
    this._numberOfBackTrack = 0;
  }

  private compareWords(word1: Word, word2: Word): number {
    if (word1._numberOfWordInDB !== word2._numberOfWordInDB) {
      return word1._numberOfWordInDB - word2._numberOfWordInDB;
    }

    return word2._word.length - word1._word.length;
  }

  private createListOfWords(frequence: string): void {
    this.words = this.gridMakerService.findAllWordsInGrid();
    this._wordDB.getFrequenceFromDB(frequence, this.words);
    this.words.sort(this.compareWords);
  }

  private placeWordInList(arrayWord: Word[]): void {
    for (const word of this.words) {
      for (const wordToPlace of arrayWord) {
        const isHorizontal: boolean = wordToPlace._isHorizontal === word._isHorizontal;
        const isSamePosition: boolean = wordToPlace._x === word._x && wordToPlace._y === word._y;

        if (isSamePosition && isHorizontal) {
          word._word = wordToPlace._word;
          word._numberOfWordInDB = wordToPlace._numberOfWordInDB;
        }
      }
    }
  }

  private placeWord(frequence: string, wordToPlace: Word): void {
    this.gridMakerService.placeWordInGrid(wordToPlace);
    const crossWords: Word[] = this._gridFillerManipulatorService.placeLettersInCrossedWords(wordToPlace, this.words);

    (frequence === "common") ?
      this._wordDB.getFrequenceFromDB("common", crossWords) : this._wordDB.getFrequenceFromDB("notCommon", crossWords);

    crossWords.push(wordToPlace);
    this.placeWordInList(crossWords);
    this.words.sort(this.compareWords);
  }

  private isUniqueWord(wordToAdd: string): boolean {
    for (const wordInlist of this.words) {
      if (wordInlist._word === wordToAdd && wordInlist._numberOfWordInDB === Number.MAX_SAFE_INTEGER) {
        return false;
      }
    }

    return true;
  }

  private canBePlaced(word: Word, frequence: string): boolean {
    if (!this.isUniqueWord(word._word)) {
      return false;
    }

    const savedGrid: string = JSON.stringify(this.gridMakerService.grid);
    const savedWords: string = JSON.stringify(this.words);

    this.placeWord("common", word);
    const wordsToCheck: Word[] = this._gridFillerManipulatorService.searchCrossedWords(word, this.words);
    const index: number = wordsToCheck.findIndex((wordToFind: Word) => wordToFind._numberOfWordInDB === 0);

    this.gridMakerService.grid = JSON.parse(savedGrid);
    this.words = JSON.parse(savedWords);

    return index === -1;
  }

  private isAllWordsPlaced(): boolean {
    for (const word of this.words) {
      for (const letter of word._word) {
        if (letter === "?") {
          return false;
        }
      }
    }

    return true;
  }

  public initializeListOfWords(frequence: string): boolean {
    this.createListOfWords(frequence);
    const savedGrid: string = JSON.stringify(this.gridMakerService.grid); // To make a Deep copy of the grid
    const savedWords: string = JSON.stringify(this.words);  // To make a Deep copy of the list of words

    let listOfWords: string[];
    (frequence === "common") ? listOfWords = this._wordDB.getWordsByConstraint(this.words[0], this._wordDB.dBwordCommon)
    : listOfWords = this._wordDB.getWordsByConstraint(this.words[0], this._wordDB.dBwordNotCommon);

    let initialWord: Word;
    for (const word of listOfWords) {
      initialWord = new Word(this.words[0]._x, this.words[0]._y, this.words[0]._isHorizontal, word, Number.MAX_SAFE_INTEGER);
      if (this.fillListOfWords(frequence, initialWord)) {
        return true;
      }

      this.gridMakerService.grid = JSON.parse(savedGrid);
      this.words = JSON.parse(savedWords);
    }

    return false;
  }

  private checkNumberBackTracks(frequence: string): void {
    if (this._numberOfBackTrack > MAX_NUMBER_BACKTRACK) {
      this.gridMakerService.createValidGrid();
      this._wordDB.shuffleAllWords(frequence);

      this._numberOfBackTrack = 0;
      this.initializeListOfWords(frequence);
    }
  }

  private fillListOfWords(frequence: string, wordToPlace: Word): boolean {
    this.placeWord(frequence, wordToPlace);
    const savedGrid: string = JSON.stringify(this.gridMakerService.grid); // To make a Deep copy of the grid
    const savedWords: string = JSON.stringify(this.words); // To make a Deep copy of the list of words

    this.checkNumberBackTracks(frequence);
    if (this.isAllWordsPlaced()) {
      return true;
    }

    let listOfWords: string[];
    (frequence === "common") ? listOfWords = this._wordDB.getWordsByConstraint(this.words[0], this._wordDB.dBwordCommon)
    : listOfWords = this._wordDB.getWordsByConstraint(this.words[0], this._wordDB.dBwordNotCommon);

    let wordToCheck: Word;
    for (const word of listOfWords) {
      wordToCheck = new Word(this.words[0]._x, this.words[0]._y, this.words[0]._isHorizontal, word, Number.MAX_SAFE_INTEGER);
      if (this.canBePlaced(wordToCheck, frequence)) {
        if (this.fillListOfWords(frequence, wordToCheck)) {
          return true;
        }

        this.gridMakerService.grid = JSON.parse(savedGrid);
        this.words = JSON.parse(savedWords);
      }
    }
    this._numberOfBackTrack++;

    return false;
  }
}
