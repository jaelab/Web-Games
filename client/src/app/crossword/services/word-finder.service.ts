import { Injectable } from "@angular/core";

import { Cell } from "../../../../../common/communication/cell";
import { Word } from "../../../../../common/communication/word";

enum WordsNumber {
  zero = 0,
  one = 1,
  two = 2
}

@Injectable()
export class WordFinderService {

  public _listOfWords: Word[];

  public set listOfWords(listOfWords: Array<[Word, string]>) {
    let words: Word[];
    words = listOfWords.map((tuple) => {
      return tuple[0];
    });

    this._listOfWords = words;
  }

  private findAssociatedWord(cell: Cell ): Word[] {
    return this._listOfWords.filter((word) => {
      if (word._isHorizontal) {
        return (cell._x >= word._x && cell._x < word._x + word._word.length && cell._y === word._y);

      } else {
        return (cell._y >= word._y && cell._y < word._y + word._word.length && cell._x === word._x);
      }

    });
  }

  public findCorrectWord(cell: Cell): Word {
    const associatedWords: Word[] = this.findAssociatedWord(cell);

    // Return the words that have the same position (if they exist)
    let wordToReturn: Word[] = associatedWords.filter((word) => {
      return word._x === cell._x && word._y === cell._y;
    });

    switch (wordToReturn.length) {
      default:
        return null;

      case WordsNumber.zero: // Return the word that is horizontal
        wordToReturn = associatedWords.filter((word) => {
          return word._isHorizontal;
        });

        return wordToReturn[0];

      // Return the word that has the same position (if it exists)
      case WordsNumber.one: // Return the only word
        return wordToReturn[0];

      case WordsNumber.two: // Return the word that is horizontal
        wordToReturn = wordToReturn.filter((word) => {
          return word._isHorizontal;
        });

        return wordToReturn[0];
    }
  }

  public filterWordsFromIndex(indiceToDisable: number[]): Word[] {
    return this._listOfWords.filter((word: Word, index: number) => {
      for (const indiceD of indiceToDisable) {
        if (indiceD === index) {
          return true;
        }
      }

      return false;
    });
  }
}
