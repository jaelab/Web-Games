import { injectable } from "inversify";
import { Word } from "../../../../../../common/communication/word";

@injectable()
export class GridFillerManipulatorService {

  public searchCrossedWords(word: Word, listOfWords: Word[]): Word[] {
    const crossedWords: Word[] = [];
    if (word._isHorizontal) {
      const verticalWord: Word[] = listOfWords.filter((wordToFilter: Word) => !wordToFilter._isHorizontal);
      for (let i: number = 0; i < word._word.length; i++) {
        crossedWords.push(verticalWord.filter((vWord: Word) => {
          return vWord._y <= word._y && vWord._y + vWord._word.length >= word._y && vWord._x === word._x + i; })[0]);
      }
    } else {
      const horizontalWord: Word[] = listOfWords.filter((wordToFilter: Word) => wordToFilter._isHorizontal);
      for (let i: number = 0; i < word._word.length; i++) {
        crossedWords.push(horizontalWord.filter((hWord: Word) => {
          return hWord._x <= word._x && (hWord._x + hWord._word.length) >= word._x && hWord._y === word._y + i; })[0]);
      }
    }

    return crossedWords;
  }

  public placeLettersInCrossedWords(wordToPlace: Word, listOfWords: Word[]): Word[] {
    const crossWords: Word[] = this.searchCrossedWords(wordToPlace, listOfWords);
    let letterArray: string[];

    for (let i: number = 0; i < crossWords.length; i++) {
      letterArray = crossWords[i]._word.split("");
      if (wordToPlace._isHorizontal) {
        letterArray[wordToPlace._y - crossWords[i]._y] = wordToPlace._word[i];
      } else {
        letterArray[wordToPlace._x - crossWords[i]._x] = wordToPlace._word[i];
      }
      crossWords[i]._word = letterArray.join("");
    }

    return crossWords;
  }
}
