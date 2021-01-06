import { GridLexicalSerivce } from "./grid-lexical.service";
import { Word } from "../../../../../../common/communication/word";
import { injectable, inject } from "inversify";
import Types from "../../../../types";
import "reflect-metadata";

const MIN_WORD_LENGTH: number = 2;

@injectable()
export class WordDB {
  public dBwordCommon: string[][];
  public dBwordNotCommon: string[][];

  constructor(@inject(Types.GridLexicalService) public gridLexicalService: GridLexicalSerivce) {
    this.dBwordCommon = [[], [], [], [], [], [], [], [], []];
    this.dBwordNotCommon = [[], [], [], [], [], [], [], [], []];
    this.initialiseDataBase(async () => {
      await this.createDB();
    });
  }

  private initialiseDataBase(callback: Function): void {
    callback.bind(this)();
  }

  // https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
  private shuffleWordArray(wordArray: string[]): string[] {
    let currentIndex: number = wordArray.length, temporaryValue: string, randomIndex: number;

    // While there remain elements to shuffle
    while (currentIndex !== 0) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = wordArray[currentIndex];
      wordArray[currentIndex] = wordArray[randomIndex];
      wordArray[randomIndex] = temporaryValue;
    }

    return wordArray;
  }

  public shuffleAllWords(frequence: string): void {
    (frequence === "common") ? this.dBwordCommon.forEach(this.shuffleWordArray) : this.dBwordNotCommon.forEach(this.shuffleWordArray);
  }

  private arrangeDB(rawData: string[][], dbWords: string[][]): void {
    for (const listOfData of rawData) {
      dbWords[listOfData[0].length - MIN_WORD_LENGTH] = dbWords[listOfData[0].length - MIN_WORD_LENGTH].concat(listOfData);
    }
  }

  private async getWordsFromDB(frequence: string): Promise<void> {
    const wordsFromDB: string[][] = await this.gridLexicalService.requestWordsFromDB(frequence);
    (frequence === "common") ? this.arrangeDB(wordsFromDB, this.dBwordCommon) : this.arrangeDB(wordsFromDB, this.dBwordNotCommon);
    this.shuffleAllWords(frequence);
  }

  public async createDB(): Promise<void> {
    await this.getWordsFromDB("common");
    await this.getWordsFromDB("notCommon");
  }

  private arangeWordToFind(word: Word): RegExp {
    let theWord: string = word._word;
    theWord = theWord.replace(/\?/g , ".");

    return new RegExp(theWord, "g");
  }

  public getWordsByConstraint(word: Word, dbWords: string[][]): string[] {
    const wordToFind: RegExp = this.arangeWordToFind(word);

    const listOfWords: string[] = [];
    for (const wordInDB of dbWords[word._word.length - MIN_WORD_LENGTH]) {
      if (wordInDB.match(wordToFind) != null) {
        listOfWords.push(wordInDB);
      }
    }

    return listOfWords;
  }

  public getFrequenceFromDB(frequence: string, listOfWords: Word[]): void {
    for (const word of listOfWords) {
      if (word._numberOfWordInDB !== Number.MAX_SAFE_INTEGER) {
        (frequence === "common") ? word._numberOfWordInDB = this.getWordsByConstraint(word, this.dBwordCommon).length
                                  : word._numberOfWordInDB = this.getWordsByConstraint(word, this.dBwordNotCommon).length;
      }
    }
  }
}
